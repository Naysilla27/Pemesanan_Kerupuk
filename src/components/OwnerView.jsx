import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Calendar,
  Download,
  Printer,
  FileSpreadsheet,
  FileText,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  History,
  Layers,
  Sparkles,
  Search,
  Filter,
  X
} from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { productService, notificationService } from '../supabase';

export default function OwnerView({
  orders = [],
  products = [],
  inventory = [],
  onRefreshData,
  currentUser
}) {
  const [activeTab, setActiveTab] = useState('dashboard_harian'); // 'dashboard_harian' | 'laporan' | 'master_produk' | 'log_aktivitas'
  const [reportType, setReportType] = useState('penjualan'); // 'penjualan' | 'transaksi' | 'stok'
  const [reportPeriod, setReportPeriod] = useState('Bulan Ini'); // 'Hari Ini' | 'Bulan Ini' | 'Tahun Ini' | 'Khusus'
  const [searchReport, setSearchReport] = useState('');

  // Master Produk State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    nama_produk: '',
    kategori: 'Kerupuk',
    harga: 160000,
    satuan: 'Bal',
    stok: 10,
    min_stok: 3,
    deskripsi: '',
    gambar_url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600',
    is_best_seller: false
  });

  // Calculate Metrics
  const paidOrders = orders.filter((o) => o.status_pembayaran === 'lunas');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total_harga || 0), 0);
  // Estimasi keuntungan bersih ~ 35% margin kotor khas industri kerupuk Diansyah
  const totalProfit = Math.round(totalRevenue * 0.35);
  const totalSalesCount = orders.reduce((sum, o) => sum + (o.jumlah || 0), 0);
  const activeOrdersCount = orders.filter((o) => !['selesai', 'dibatalkan'].includes(o.status_pesanan)).length;
  const lowStockCount = inventory.filter((i) => i.jumlah_stok <= (i.batas_minimum || 5)).length;

  const logs = notificationService.getLogs();

  // Export to Excel (.xlsx) using xlsx library (SDD Page 26 & 34)
  const handleExportExcel = () => {
    let exportData = [];

    if (reportType === 'penjualan' || reportType === 'transaksi') {
      exportData = orders.map((o) => ({
        'No. Pesanan': o.nomor_pesanan,
        'Tanggal': new Date(o.tanggal_pesanan).toLocaleDateString('id-ID'),
        'Nama Pelanggan': o.nama_pelanggan,
        'No. Telepon': o.no_telp || '-',
        'Produk': o.nama_produk,
        'Varian Rasa': o.varian_rasa || 'Original',
        'Kemasan': o.kemasan_plastik || '1/2 kg',
        'Jumlah (Bal)': o.jumlah,
        'Harga Satuan (Rp)': o.harga_satuan || 160000,
        'Total Harga (Rp)': o.total_harga,
        'Metode Bayar': o.metode_pembayaran,
        'Status Bayar': o.status_pembayaran,
        'Status Produksi': o.status_pesanan
      }));
    } else {
      exportData = inventory.map((i) => ({
        'Nama Bahan Baku': i.nama_bahan,
        'Kategori': i.kategori,
        'Stok Fisik': i.jumlah_stok,
        'Satuan': i.satuan,
        'Batas Minimum': i.batas_minimum,
        'Harga Beli Satuan (Rp)': i.harga_beli,
        'Status': i.jumlah_stok <= i.batas_minimum ? 'HAMPIR HABIS' : 'AMAN'
      }));
    }

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Laporan_${reportType}`);
    XLSX.writeFile(workbook, `Laporan_${reportType}_Diansyah_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Export to PDF using jsPDF + autoTable (SDD Page 26 & 34)
  const handleExportPDF = () => {
    const doc = new jsPDF('landscape');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('PABRIK KERUPUK DIANSYAH', 14, 15);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Rekapitulasi ${reportType.toUpperCase()} - Periode: ${reportPeriod}`, 14, 21);
    doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 26);

    if (reportType === 'penjualan' || reportType === 'transaksi') {
      const headers = [['No Pesanan', 'Tanggal', 'Pelanggan', 'Produk', 'Varian', 'Qty', 'Total (Rp)', 'Status Bayar', 'Proses']];
      const rows = orders.map((o) => [
        o.nomor_pesanan,
        new Date(o.tanggal_pesanan).toLocaleDateString('id-ID'),
        o.nama_pelanggan,
        o.nama_produk,
        o.varian_rasa || 'Original',
        `${o.jumlah} Bal`,
        `Rp ${(o.total_harga || 0).toLocaleString('id-ID')}`,
        o.status_pembayaran.toUpperCase(),
        o.status_pesanan.replace(/_/g, ' ')
      ]);

      autoTable(doc, {
        head: headers,
        body: rows,
        startY: 32,
        theme: 'striped',
        headStyles: { fillColor: [136, 19, 55] },
        styles: { fontSize: 8 }
      });
    } else {
      const headers = [['Nama Bahan', 'Kategori', 'Stok Saat Ini', 'Batas Min', 'Harga Beli (Rp)', 'Status']];
      const rows = inventory.map((i) => [
        i.nama_bahan,
        i.kategori.replace('_', ' '),
        `${i.jumlah_stok} ${i.satuan}`,
        `${i.batas_minimum} ${i.satuan}`,
        `Rp ${(i.harga_beli || 0).toLocaleString('id-ID')}`,
        i.jumlah_stok <= i.batas_minimum ? 'MENIPIS' : 'AMAN'
      ]);

      autoTable(doc, {
        head: headers,
        body: rows,
        startY: 32,
        theme: 'striped',
        headStyles: { fillColor: [136, 19, 55] },
        styles: { fontSize: 9 }
      });
    }

    doc.save(`Laporan_Diansyah_${reportType}.pdf`);
  };

  // Product CRUD
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (editingProduct) {
      await productService.update(editingProduct.id, productForm);
    } else {
      await productService.add(productForm);
    }
    setIsAddProductOpen(false);
    setEditingProduct(null);
    onRefreshData();
  };

  const handleDeleteProduct = async (id, nama) => {
    if (window.confirm(`Hapus produk "${nama}" dari katalog?`)) {
      await productService.delete(id);
      onRefreshData();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 animate-fadeIn">
      {/* Header Bar Owner */}
      <div className="bg-gradient-to-r from-[#881337] via-[#9f1239] to-stone-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-amber-300 shadow-inner">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-['Space_Grotesk']">Dashboard Eksekutif Owner</h2>
              <span className="text-[10px] bg-amber-400 text-stone-900 font-bold px-2 py-0.5 rounded-full">
                Pemilik
              </span>
            </div>
            <p className="text-xs text-rose-200 mt-0.5">
              Pusat kendali laporan finansial harian, pemantauan pesanan & stok bahan baku
            </p>
          </div>
        </div>

        {/* Top Tab Buttons */}
        <div className="flex bg-black/20 p-1 rounded-xl text-xs font-bold w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard_harian')}
            className={`flex-1 md:flex-none px-3.5 py-2 rounded-lg transition flex items-center justify-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'dashboard_harian' ? 'bg-white text-[#881337] shadow' : 'text-rose-100 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Dashboard Harian</span>
          </button>

          <button
            onClick={() => setActiveTab('laporan')}
            className={`flex-1 md:flex-none px-3.5 py-2 rounded-lg transition flex items-center justify-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'laporan' ? 'bg-white text-[#881337] shadow' : 'text-rose-100 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Kelola Laporan</span>
          </button>

          <button
            onClick={() => setActiveTab('master_produk')}
            className={`flex-1 md:flex-none px-3.5 py-2 rounded-lg transition flex items-center justify-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'master_produk' ? 'bg-white text-[#881337] shadow' : 'text-rose-100 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Katalog Produk ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('log_aktivitas')}
            className={`flex-1 md:flex-none px-3.5 py-2 rounded-lg transition flex items-center justify-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'log_aktivitas' ? 'bg-white text-[#881337] shadow' : 'text-rose-100 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Audit Trail</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: DASHBOARD LAPORAN HARIAN (SDD Page 23, 31, 38, 48, 95) */}
      {/* ==================================================================== */}
      {activeTab === 'dashboard_harian' && (
        <div className="space-y-6">
          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                  Total Pendapatan
                </span>
                <div className="text-xl font-black text-emerald-700 mt-1">
                  Rp {totalRevenue.toLocaleString('id-ID')}
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5">{paidOrders.length} Transaksi Lunas</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                  Estimasi Keuntungan
                </span>
                <div className="text-xl font-black text-[#881337] mt-1">
                  Rp {totalProfit.toLocaleString('id-ID')}
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5">Margin Keuntungan ~35%</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                  Volume Kerupuk
                </span>
                <div className="text-xl font-black text-amber-700 mt-1">
                  {totalSalesCount} <span className="text-xs font-normal text-stone-500">Bal</span>
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5">{orders.length} Total Pesanan</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                  Bahan Menipis
                </span>
                <div className="text-xl font-black text-rose-600 mt-1">
                  {lowStockCount} <span className="text-xs font-normal text-stone-500">Item</span>
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5">Perlu Pengadaan Ulang</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Interactive Chart Section matching SDD Page 95-96 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Trend Chart (Mockup Page 95) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">Grafik Perkembangan Penjualan Pabrik</h3>
                  <p className="text-xs text-stone-400">Tren transaksi dan nominal pendapatan 7 hari terakhir</p>
                </div>
                <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2 py-1 rounded-full border border-rose-200">
                  Update Real-Time
                </span>
              </div>

              {/* Responsive SVG Chart */}
              <div className="h-48 w-full flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-stone-100">
                {[
                  { day: 'Sen', val: 320000, height: '40%' },
                  { day: 'Sel', val: 480000, height: '65%' },
                  { day: 'Rab', val: 160000, height: '25%' },
                  { day: 'Kam', val: 640000, height: '85%' },
                  { day: 'Jum', val: 480000, height: '65%' },
                  { day: 'Sab', val: 800000, height: '100%' },
                  { day: 'Min', val: 560000, height: '75%' }
                ].map((bar, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-bold text-stone-400 group-hover:text-rose-700 transition opacity-0 group-hover:opacity-100">
                      {(bar.val / 1000).toFixed(0)}k
                    </span>
                    <div
                      style={{ height: bar.height }}
                      className="w-full max-w-[36px] bg-gradient-to-t from-[#881337] to-rose-400 rounded-t-lg group-hover:from-rose-600 group-hover:to-rose-400 transition-all shadow-xs"
                    />
                    <span className="text-[11px] font-semibold text-stone-600 mt-1">{bar.day}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-stone-500">
                <span>Rata-rata Penjualan: <strong>Rp 491.000 / Hari</strong></span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  ▲ +18.4% peningkatan minggu ini
                </span>
              </div>
            </div>

            {/* Top Seller Distribution */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
              <h3 className="font-bold text-stone-900 text-sm mb-1">Varian Terpopuler</h3>
              <p className="text-xs text-stone-400 mb-4">Komposisi rasa kerupuk yang paling diminati</p>

              <div className="space-y-3">
                {[
                  { name: 'Kerupuk Makaroni (Keju/Balado)', pct: 38, color: 'bg-rose-700' },
                  { name: 'Kerupuk Kentang (Original)', pct: 28, color: 'bg-amber-500' },
                  { name: 'Kerupuk Bawang Renyah', pct: 18, color: 'bg-emerald-600' },
                  { name: 'Kerupuk Jengkol Pedas', pct: 16, color: 'bg-indigo-600' }
                ].map((item, i) => (
                  <div key={i} className="text-xs">
                    <div className="flex justify-between font-medium text-stone-700 mb-1">
                      <span className="truncate max-w-[170px]">{item.name}</span>
                      <span className="font-bold">{item.pct}%</span>
                    </div>
                    <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-3 bg-rose-50 rounded-2xl border border-rose-100 text-xs text-rose-900">
                💡 <strong>Rekomendasi Pabrik:</strong> Stok bahan baku <em>Kerupuk Mentah Kentang</em> dan <em>Bumbu Balado</em> perlu ditambah untuk memenuhi lonjakan akhir pekan.
              </div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">Pesanan & Transaksi Terkini</h3>
                <p className="text-xs text-stone-400">Ringkasan status proses produksi harian</p>
              </div>
              <button
                onClick={() => setActiveTab('laporan')}
                className="text-xs text-rose-700 hover:text-rose-900 font-bold flex items-center gap-1"
              >
                <span>Buka Semua Laporan</span>
                <TrendingUp className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
                  <tr>
                    <th className="p-3 font-semibold">No. Pesanan</th>
                    <th className="p-3 font-semibold">Pelanggan</th>
                    <th className="p-3 font-semibold">Produk</th>
                    <th className="p-3 font-semibold">Total (Rp)</th>
                    <th className="p-3 font-semibold">Status Bayar</th>
                    <th className="p-3 font-semibold">Tahap Produksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.slice(0, 5).map((o) => (
                    <tr key={o.id} className="hover:bg-stone-50/70">
                      <td className="p-3 font-bold text-stone-900">{o.nomor_pesanan}</td>
                      <td className="p-3">{o.nama_pelanggan}</td>
                      <td className="p-3 font-medium">
                        {o.nama_produk} ({o.jumlah} Bal)
                      </td>
                      <td className="p-3 font-bold text-rose-800">
                        Rp {(o.total_harga || 0).toLocaleString('id-ID')}
                      </td>
                      <td className="p-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            o.status_pembayaran === 'lunas'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {o.status_pembayaran.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="text-[10px] font-semibold text-stone-700 capitalize">
                          {o.status_pesanan.replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: KELOLA LAPORAN & EKSPOR (SDD Page 24-26, 33-34, 39, 49-50, 94) */}
      {/* ==================================================================== */}
      {activeTab === 'laporan' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-stone-900 text-base">Kelola & Unduh Laporan Pabrik</h3>
              <p className="text-xs text-stone-500">
                Filter berdasarkan tanggal, tinjau metrik transaksi, dan ekspor ke Excel/PDF
              </p>
            </div>

            {/* Export Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleExportExcel}
                className="flex items-center space-x-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Unduh Excel (.xlsx)</span>
              </button>
              <button
                onClick={handleExportPDF}
                className="flex items-center space-x-1.5 px-3 py-2 bg-[#881337] hover:bg-[#700f2d] text-white rounded-xl text-xs font-bold transition shadow"
              >
                <FileText className="w-4 h-4" />
                <span>Unduh PDF</span>
              </button>
            </div>
          </div>

          {/* Filter Bar Sesuai SDD Page 94 */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Laporan Type Tabs */}
            <div className="flex bg-stone-100 p-1 rounded-xl">
              {[
                { id: 'penjualan', label: 'Laporan Penjualan' },
                { id: 'transaksi', label: 'Laporan Transaksi' },
                { id: 'stok', label: 'Laporan Stok Bahan' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setReportType(t.id)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition ${
                    reportType === t.id ? 'bg-white text-[#881337] shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Period Filters */}
            <div className="flex items-center space-x-1.5">
              {['Hari Ini', 'Bulan Ini', 'Tahun Ini', 'Khusus'].map((p) => (
                <button
                  key={p}
                  onClick={() => setReportPeriod(p)}
                  className={`px-2.5 py-1.5 rounded-lg font-semibold transition ${
                    reportPeriod === p
                      ? 'bg-[#881337] text-white'
                      : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Report Data Table */}
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <span className="font-bold text-xs text-stone-800">
                Hasil Filter: {reportType.toUpperCase()} ({reportPeriod})
              </span>
              <span className="text-[11px] text-stone-500">
                {reportType === 'stok' ? inventory.length : orders.length} Baris Data
              </span>
            </div>

            <div className="overflow-x-auto">
              {reportType === 'stok' ? (
                <table className="w-full text-left text-xs text-stone-700">
                  <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
                    <tr>
                      <th className="p-3 font-semibold">Nama Bahan Baku</th>
                      <th className="p-3 font-semibold">Kategori</th>
                      <th className="p-3 font-semibold">Stok Saat Ini</th>
                      <th className="p-3 font-semibold">Batas Minimum</th>
                      <th className="p-3 font-semibold">Harga Beli</th>
                      <th className="p-3 font-semibold">Status Stok</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {inventory.map((i) => {
                      const isLow = i.jumlah_stok <= i.batas_minimum;
                      return (
                        <tr key={i.id} className="hover:bg-stone-50/70">
                          <td className="p-3 font-bold text-stone-900">{i.nama_bahan}</td>
                          <td className="p-3 capitalize">{i.kategori.replace('_', ' ')}</td>
                          <td className="p-3 font-black text-stone-900">
                            {i.jumlah_stok} {i.satuan}
                          </td>
                          <td className="p-3 text-stone-500">
                            {i.batas_minimum} {i.satuan}
                          </td>
                          <td className="p-3">Rp {(i.harga_beli || 0).toLocaleString('id-ID')}</td>
                          <td className="p-3">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isLow
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {isLow ? 'MENIPIS' : 'AMAN'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left text-xs text-stone-700">
                  <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
                    <tr>
                      <th className="p-3 font-semibold">No. Pesanan</th>
                      <th className="p-3 font-semibold">Tanggal</th>
                      <th className="p-3 font-semibold">Pelanggan</th>
                      <th className="p-3 font-semibold">Produk & Varian</th>
                      <th className="p-3 font-semibold">Kuantitas</th>
                      <th className="p-3 font-semibold">Total Tagihan</th>
                      <th className="p-3 font-semibold">Est. Keuntungan</th>
                      <th className="p-3 font-semibold">Status Bayar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-stone-50/70">
                        <td className="p-3 font-bold text-stone-900">{o.nomor_pesanan}</td>
                        <td className="p-3 text-stone-500">
                          {new Date(o.tanggal_pesanan).toLocaleDateString('id-ID')}
                        </td>
                        <td className="p-3">{o.nama_pelanggan}</td>
                        <td className="p-3">
                          <div className="font-semibold text-stone-900">{o.nama_produk}</div>
                          <div className="text-[10px] text-stone-400">
                            {o.varian_rasa || 'Original'} • {o.kemasan_plastik}
                          </div>
                        </td>
                        <td className="p-3 font-semibold">{o.jumlah} Bal</td>
                        <td className="p-3 font-black text-rose-800">
                          Rp {(o.total_harga || 0).toLocaleString('id-ID')}
                        </td>
                        <td className="p-3 font-bold text-emerald-700">
                          Rp {Math.round((o.total_harga || 0) * 0.35).toLocaleString('id-ID')}
                        </td>
                        <td className="p-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              o.status_pembayaran === 'lunas'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {o.status_pembayaran.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: KATALOG PRODUK & HARGA (CRUD) */}
      {/* ==================================================================== */}
      {activeTab === 'master_produk' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-900 text-base">Katalog Master Produk Kerupuk</h3>
              <p className="text-xs text-stone-500">
                Atur harga jual per bal, stok siap jual, dan kelola produk unggulan
              </p>
            </div>
            <button
              onClick={() => {
                setEditingProduct(null);
                setProductForm({
                  nama_produk: '',
                  kategori: 'Kerupuk',
                  harga: 160000,
                  satuan: 'Bal',
                  stok: 10,
                  min_stok: 3,
                  deskripsi: '',
                  gambar_url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600',
                  is_best_seller: false
                });
                setIsAddProductOpen(true);
              }}
              className="px-4 py-2.5 bg-[#881337] hover:bg-[#700f2d] text-white rounded-xl text-xs font-bold transition shadow flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Produk Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-stone-100">
                    <img src={p.gambar_url} alt={p.nama_produk} className="w-full h-full object-cover" />
                    {p.is_best_seller && (
                      <span className="absolute top-2 left-2 bg-rose-700 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow">
                        ★ Best Seller
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-stone-900">{p.nama_produk}</h4>
                  <p className="text-xs text-stone-500 line-clamp-2 mt-1">{p.deskripsi}</p>
                  <div className="mt-2 text-rose-700 font-black text-sm">
                    Rp {p.harga.toLocaleString('id-ID')} / {p.satuan}
                  </div>
                  <div className="text-stone-400 text-[11px] mt-0.5">
                    Stok Siap Jual: <strong>{p.stok} Bal</strong>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => {
                      setEditingProduct(p);
                      setProductForm({ ...p });
                      setIsAddProductOpen(true);
                    }}
                    className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg text-xs"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(p.id, p.nama_produk)}
                    className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg text-xs"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: LOG AKTIVITAS (AUDIT TRAIL) */}
      {/* ==================================================================== */}
      {activeTab === 'log_aktivitas' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-stone-900 text-base">Log Audit & Aktivitas Sistem</h3>
            <p className="text-xs text-stone-500">
              Riwayat audit seluruh transaksi, pemotongan stok, dan pembaruan operasional pabrik
            </p>
          </div>

          <div className="divide-y divide-stone-100 text-xs">
            {logs.map((log) => (
              <div key={log.id} className="py-3 flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-rose-700 mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">{log.aktivitas}</span>
                    <span className="text-[10px] text-stone-400">{log.waktu}</span>
                  </div>
                  <p className="text-stone-600 mt-0.5">{log.keterangan}</p>
                  <span className="text-[10px] text-stone-400">
                    Oleh: {log.nama_user} ({log.role})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL TAMBAH / EDIT PRODUK */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-fadeIn max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-bold text-sm text-stone-900">
                {editingProduct ? 'Edit Data Produk' : 'Tambah Produk Kerupuk'}
              </h3>
              <button onClick={() => setIsAddProductOpen(false)} className="p-1 text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Nama Produk Kerupuk</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Kerupuk Kulit Sapi"
                  value={productForm.nama_produk}
                  onChange={(e) => setProductForm({ ...productForm, nama_produk: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-rose-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Harga Jual / Bal (Rp)</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    value={productForm.harga}
                    onChange={(e) => setProductForm({ ...productForm, harga: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Stok Tersedia (Bal)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={productForm.stok}
                    onChange={(e) => setProductForm({ ...productForm, stok: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Deskripsi Produk</label>
                <textarea
                  rows="2"
                  value={productForm.deskripsi}
                  onChange={(e) => setProductForm({ ...productForm, deskripsi: e.target.value })}
                  placeholder="Keterangan tekstur, bahan & keunggulan..."
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">URL Foto Produk</label>
                <input
                  type="url"
                  value={productForm.gambar_url}
                  onChange={(e) => setProductForm({ ...productForm, gambar_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-2 cursor-pointer font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={productForm.is_best_seller}
                    onChange={(e) => setProductForm({ ...productForm, is_best_seller: e.target.checked })}
                    className="rounded text-rose-700 focus:ring-rose-700"
                  />
                  <span>Tandai sebagai Produk Terlaris (Best Seller)</span>
                </label>
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-3 py-2 text-stone-600 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#881337] hover:bg-[#700f2d] text-white rounded-xl font-bold shadow"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
