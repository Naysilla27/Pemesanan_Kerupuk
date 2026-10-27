import React, { useState } from 'react';
import {
  Package,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  Banknote,
  Search,
  ShieldCheck,
  Tag,
  ArrowRight
} from 'lucide-react';
import { orderService, inventoryService } from '../supabase';
import PrintReceipt from './PrintReceipt';

export default function StaffPembungkusView({
  orders = [],
  inventory = [],
  onRefreshData,
  currentUser
}) {
  const [activeTab, setActiveTab] = useState('verifikasi'); // 'verifikasi' | 'pengemasan' | 'kasir_outlet'
  const [selectedOrderReceipt, setSelectedOrderReceipt] = useState(null);

  // Cash payment modal state
  const [cashPaymentOrder, setCashPaymentOrder] = useState(null);
  const [cashAmount, setCashAmount] = useState('');
  const [cashError, setCashError] = useState('');

  // Orders waiting for Quality Check / Verification (status: 'siap_diverifikasi')
  const verificationQueue = orders.filter((o) => o.status_pesanan === 'siap_diverifikasi');

  // Orders currently being packed (status: 'sedang_dibungkus')
  const packagingQueue = orders.filter((o) => o.status_pesanan === 'sedang_dibungkus');

  // Completed or ready for pickup orders
  const readyOrders = orders.filter((o) => o.status_pesanan === 'selesai');

  // Aksi 1: Verifikasi Hasil Produksi Lolos (SDD UC-10)
  const handleApproveVerification = async (order) => {
    await orderService.updateStatus(
      order.id,
      'sedang_dibungkus',
      `Verifikasi kualitas lolos oleh ${currentUser?.nama || 'Staf Pembungkus'}. Siap dilakukan pengemasan plastik & label.`
    );
    onRefreshData();
  };

  // Aksi 2: Tolak Verifikasi Produksi Cacat (SDD UC-10 Exception)
  const handleRejectVerification = async (order) => {
    const reason = window.prompt('Masukkan alasan verifikasi gagal (misal: kerenyahan kurang, bumbu belum merata):');
    if (reason) {
      await orderService.updateStatus(
        order.id,
        'sedang_digoreng',
        `Verifikasi ditolak oleh QC: ${reason}. Dikembalikan ke penggorengan.`
      );
      onRefreshData();
    }
  };

  // Aksi 3: Selesai Pengemasan (Potong Plastik & Label)
  const handleFinishPackaging = async (order) => {
    // Potong stok plastik & label
    const plasticItem = inventory.find((i) => i.kategori === 'plastik');
    if (plasticItem && plasticItem.jumlah_stok > 0) {
      await inventoryService.updateStock(plasticItem.id, Math.max(0, plasticItem.jumlah_stok - 1));
    }

    const labelItem = inventory.find((i) => i.nama_bahan.toLowerCase().includes('label'));
    if (labelItem && labelItem.jumlah_stok > 0) {
      await inventoryService.updateStock(labelItem.id, Math.max(0, labelItem.jumlah_stok - order.jumlah));
    }

    await orderService.updateStatus(
      order.id,
      'selesai',
      'Pengemasan plastik dan label Diansyah selesai. Pesanan siap diambil atau dikirim.'
    );
    onRefreshData();
  };

  // Aksi 4: Bayar Tunai di Kasir Outlet (SDD UC-12)
  const handleCashPaymentSubmit = async (e) => {
    e.preventDefault();
    if (!cashPaymentOrder) return;

    const amount = Number(cashAmount);
    const result = await orderService.confirmCashPayment(cashPaymentOrder.id, amount);

    if (!result.success) {
      setCashError(result.message);
    } else {
      alert(`Pembayaran tunai berhasil! Kembalian: Rp ${result.kembalian.toLocaleString('id-ID')}`);
      const updatedOrder = {
        ...cashPaymentOrder,
        status_pembayaran: 'lunas',
        uang_diterima: amount,
        kembalian: result.kembalian
      };
      setCashPaymentOrder(null);
      setCashAmount('');
      setCashError('');
      setSelectedOrderReceipt(updatedOrder);
      onRefreshData();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 animate-fadeIn">
      {/* Hero Bar Staf Pembungkus */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-stone-900 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-emerald-300 shadow-inner">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-['Space_Grotesk']">Portal Staf Pembungkus (QC)</h2>
              <span className="text-[10px] bg-emerald-400 text-stone-900 font-bold px-2 py-0.5 rounded-full">
                Packaging & QC
              </span>
            </div>
            <p className="text-xs text-emerald-200 mt-0.5">
              Verifikasi mutu kerenyahan, pengemasan plastik, label Diansyah & kasir outlet
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-black/20 p-1 rounded-xl text-xs font-bold w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('verifikasi')}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-lg transition flex items-center justify-center space-x-1 whitespace-nowrap ${
              activeTab === 'verifikasi' ? 'bg-white text-emerald-900 shadow' : 'text-emerald-100 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verifikasi QC ({verificationQueue.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('pengemasan')}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-lg transition flex items-center justify-center space-x-1 whitespace-nowrap ${
              activeTab === 'pengemasan' ? 'bg-white text-emerald-900 shadow' : 'text-emerald-100 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Sedang Dikemas ({packagingQueue.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('kasir_outlet')}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-lg transition flex items-center justify-center space-x-1 whitespace-nowrap ${
              activeTab === 'kasir_outlet' ? 'bg-white text-emerald-900 shadow' : 'text-emerald-100 hover:text-white'
            }`}
          >
            <Banknote className="w-4 h-4" />
            <span>Kasir & Pelunasan</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SECTION 1: VERIFIKASI HASIL PRODUKSI (QC - SDD Page 20, 28, 34) */}
      {/* ==================================================================== */}
      {activeTab === 'verifikasi' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-900 text-base">Verifikasi Hasil Penggorengan</h3>
              <p className="text-xs text-stone-500">
                Pemeriksaan kualitas fisik kerupuk dari wajan penggorengan sebelum dibungkus ke plastik
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {verificationQueue.length} Menunggu QC
            </span>
          </div>

          {verificationQueue.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm text-stone-400 text-xs">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-emerald-500 opacity-60" />
              Tidak ada kerupuk yang sedang menunggu verifikasi.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {verificationQueue.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-stone-100 text-xs">
                      <div>
                        <span className="font-bold text-stone-900">{order.nomor_pesanan}</span>
                        <div className="text-[10px] text-stone-400">
                          Pemesan: {order.nama_pelanggan} ({order.no_telp || '-'})
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        🔍 SIAP DIVERIFIKASI
                      </span>
                    </div>

                    <div className="mt-3 space-y-1.5 text-xs">
                      <div className="text-base font-black text-stone-900">{order.nama_produk}</div>
                      <div className="text-stone-600 flex items-center gap-2">
                        <span className="bg-stone-100 px-2 py-0.5 rounded font-semibold">
                          Jumlah: {order.jumlah} Bal
                        </span>
                        <span className="bg-rose-50 text-rose-800 px-2 py-0.5 rounded font-semibold border border-rose-100">
                          Rasa: {order.varian_rasa || 'Original'}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-500">
                        Target Kemasan: <strong>{order.kemasan_plastik}</strong>
                      </div>

                      {/* QC Checklist Sesuai SDD UC-10 */}
                      <div className="mt-3 p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] space-y-1 text-stone-700">
                        <div className="font-bold text-stone-900 mb-1 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Kriteria Kelayakan Mutu Diansyah:</span>
                        </div>
                        <div>✓ Tingkat kerenyahan optimal (garing, mekar)</div>
                        <div>✓ Bumbu tabur {order.varian_rasa} merata dan pas</div>
                        <div>✓ Berat timbangan sesuai pesanan ({order.jumlah} Bal)</div>
                        <div>✓ Higienitas bersih bebas sisa minyak jelantah</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2">
                    <button
                      onClick={() => handleRejectVerification(order)}
                      className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition border border-rose-200"
                    >
                      Tolak / Cacat
                    </button>
                    <button
                      onClick={() => handleApproveVerification(order)}
                      className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow flex items-center justify-center space-x-1"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verifikasi Lolos & Siap Bungkus</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* SECTION 2: PROSES PENGEMASAN / PEMBUNGKUSAN (SDD Page 21, 28) */}
      {/* ==================================================================== */}
      {activeTab === 'pengemasan' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-900 text-base">Proses Pengemasan Kerupuk</h3>
              <p className="text-xs text-stone-500">
                Pemasangan plastik kemasan, stiker label Diansyah & penyegelan rapat
              </p>
            </div>
            <span className="text-xs font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              {packagingQueue.length} Sedang Dikemas
            </span>
          </div>

          {packagingQueue.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm text-stone-400 text-xs">
              <Package className="w-12 h-12 mx-auto mb-2 text-blue-500 opacity-60" />
              Tidak ada pesanan yang sedang dalam proses pengemasan.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {packagingQueue.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-blue-200 ring-2 ring-blue-50 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-stone-100 text-xs">
                      <div>
                        <span className="font-bold text-stone-900">{order.nomor_pesanan}</span>
                        <div className="text-[10px] text-stone-400">
                          Pemesan: {order.nama_pelanggan} ({order.no_telp || '-'})
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 animate-pulse">
                        📦 SEDANG DIKEMAS
                      </span>
                    </div>

                    <div className="mt-3 space-y-1 text-xs">
                      <div className="text-base font-black text-stone-900">{order.nama_produk}</div>
                      <div className="text-stone-600">
                        Jumlah: <strong>{order.jumlah} Bal</strong> • Varian:{' '}
                        <strong>{order.varian_rasa || 'Original'}</strong>
                      </div>
                      <div className="text-stone-600">
                        Kemasan: <strong>{order.kemasan_plastik}</strong>
                      </div>
                      <div className="text-stone-600">
                        Label Merek: <strong>Diansyah</strong>
                      </div>
                    </div>

                    <div className="mt-3 p-2.5 bg-blue-50 rounded-xl text-[11px] text-blue-900">
                      Instruksi: Masukkan kerupuk ke dalam {order.kemasan_plastik}, tempelkan stiker label Diansyah, lalu segel menggunakan sealer panas.
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-stone-100">
                    <button
                      onClick={() => handleFinishPackaging(order)}
                      className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow flex items-center justify-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Selesai Kemas & Siap Diambil</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* SECTION 3: KASIR OUTLET & PELUNASAN TUNAI (SDD Page 21-23, 29-30) */}
      {/* ==================================================================== */}
      {activeTab === 'kasir_outlet' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-900 text-base">Kasir Pelunasan & Cetak Struk Outlet</h3>
              <p className="text-xs text-stone-500">
                Pencatatan pembayaran tunai pelanggan saat pengambilan kerupuk di pabrik
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <span className="font-bold text-xs text-stone-800">Daftar Transaksi Pesanan</span>
              <span className="text-[11px] text-stone-500">{orders.length} Transaksi</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
                  <tr>
                    <th className="p-3 font-semibold">No. Pesanan</th>
                    <th className="p-3 font-semibold">Pelanggan</th>
                    <th className="p-3 font-semibold">Produk & Qty</th>
                    <th className="p-3 font-semibold">Total Tagihan</th>
                    <th className="p-3 font-semibold">Status Bayar</th>
                    <th className="p-3 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.map((order) => {
                    const isPaid = order.status_pembayaran === 'lunas';

                    return (
                      <tr key={order.id} className="hover:bg-stone-50/70">
                        <td className="p-3 font-bold text-stone-900">{order.nomor_pesanan}</td>
                        <td className="p-3">
                          <div className="font-medium text-stone-900">{order.nama_pelanggan}</div>
                          <div className="text-[10px] text-stone-400">{order.no_telp || '-'}</div>
                        </td>
                        <td className="p-3">
                          <div>{order.nama_produk}</div>
                          <div className="text-[10px] text-stone-500">
                            {order.jumlah} Bal ({order.varian_rasa})
                          </div>
                        </td>
                        <td className="p-3 font-bold text-rose-700">
                          Rp {(order.total_harga || 0).toLocaleString('id-ID')}
                        </td>
                        <td className="p-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isPaid
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {order.status_pembayaran.toUpperCase()} ({order.metode_pembayaran})
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                          {!isPaid ? (
                            <button
                              onClick={() => {
                                setCashPaymentOrder(order);
                                setCashAmount(order.total_harga);
                                setCashError('');
                              }}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
                            >
                              Bayar Kasir
                            </button>
                          ) : (
                            <button
                              onClick={() => setSelectedOrderReceipt(order)}
                              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition flex items-center gap-1 inline-flex"
                            >
                              <Printer className="w-3 h-3" />
                              <span>Struk</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: INPUT PEMBAYARAN TUNAI (SDD Page 22-23, 29-30) */}
      {cashPaymentOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 animate-fadeIn">
            <h4 className="font-bold text-sm text-stone-900 pb-2 border-b border-stone-100">
              Konfirmasi Pembayaran Tunai
            </h4>

            <div className="mt-3 text-xs space-y-2">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div className="text-stone-500">No. Pesanan: {cashPaymentOrder.nomor_pesanan}</div>
                <div className="font-bold text-stone-900 mt-1">{cashPaymentOrder.nama_pelanggan}</div>
                <div className="text-stone-500 mt-0.5">
                  {cashPaymentOrder.nama_produk} ({cashPaymentOrder.jumlah} Bal)
                </div>
                <div className="text-base font-black text-rose-800 mt-2">
                  Total Tagihan: Rp {cashPaymentOrder.total_harga.toLocaleString('id-ID')}
                </div>
              </div>

              {cashError && (
                <div className="p-2 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {cashError}
                </div>
              )}

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Nominal Uang Diterima dari Pelanggan (Rp):
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  placeholder="Misal: 500000"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 font-bold focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {Number(cashAmount) >= cashPaymentOrder.total_harga && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex justify-between">
                  <span>Kembalian:</span>
                  <span>Rp {(Number(cashAmount) - cashPaymentOrder.total_harga).toLocaleString('id-ID')}</span>
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setCashPaymentOrder(null)}
                className="px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleCashPaymentSubmit}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow"
              >
                Konfirmasi & Cetak Struk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedOrderReceipt && (
        <PrintReceipt
          order={selectedOrderReceipt}
          onClose={() => setSelectedOrderReceipt(null)}
        />
      )}
    </div>
  );
}
