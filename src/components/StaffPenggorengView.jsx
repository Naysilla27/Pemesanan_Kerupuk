import React, { useState } from 'react';
import {
  Flame,
  Package,
  Plus,
  Minus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  TrendingDown,
  Clock,
  Sparkles,
  X
} from 'lucide-react';
import { orderService, inventoryService } from '../supabase';

export default function StaffPenggorengView({
  orders = [],
  inventory = [],
  onRefreshData,
  currentUser
}) {
  const [activeTab, setActiveTab] = useState('antrean_produksi'); // 'antrean_produksi' | 'kelola_stok'
  const [stockCategory, setStockCategory] = useState('Semua');
  const [searchStock, setSearchStock] = useState('');

  // Modal Tambah Barang / Stok Baru (SDD Page 92-93)
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [newStockItem, setNewStockItem] = useState({
    nama_bahan: '',
    kategori: 'kerupuk_mentah',
    jumlah_stok: 20,
    satuan: 'Bal',
    batas_minimum: 5,
    harga_beli: 100000,
    gambar_url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400'
  });

  // Modal Update Stok Masuk Cepat
  const [selectedStockForEdit, setSelectedStockForEdit] = useState(null);
  const [incomingQty, setIncomingQty] = useState(10);

  // Filter antrean pesanan penggorengan
  const fryingQueue = orders.filter((o) =>
    ['menunggu_diproses', 'sedang_digoreng'].includes(o.status_pesanan)
  );

  // Aksi 1: Mulai Goreng
  const handleStartFrying = async (order) => {
    // Kurangi stok kerupuk mentah & bumbu secara otomatis
    const rawMaterial = inventory.find((i) =>
      i.nama_bahan.toLowerCase().includes('mentah')
    );
    if (rawMaterial && rawMaterial.jumlah_stok >= order.jumlah) {
      await inventoryService.updateStock(
        rawMaterial.id,
        rawMaterial.jumlah_stok - order.jumlah
      );
    }

    await orderService.updateStatus(
      order.id,
      'sedang_digoreng',
      `Dimulai penggorengan oleh ${currentUser?.nama || 'Staf Penggoreng'}`
    );
    onRefreshData();
  };

  // Aksi 2: Selesai Goreng & Kirim ke Verifikasi Pembungkus
  const handleFinishFrying = async (order) => {
    await orderService.updateStatus(
      order.id,
      'siap_diverifikasi',
      'Penggorengan matang sempurna, diserahkan ke Staf Pembungkus untuk QC verifikasi.'
    );
    onRefreshData();
  };

  // Filter Stok Bahan Baku
  const filteredInventory = inventory.filter((item) => {
    const matchSearch = item.nama_bahan.toLowerCase().includes(searchStock.toLowerCase());
    if (stockCategory === 'Semua') return matchSearch;
    if (stockCategory === 'Kerupuk') return matchSearch && item.kategori === 'kerupuk_mentah';
    if (stockCategory === 'Plastik') return matchSearch && item.kategori === 'plastik';
    if (stockCategory === 'Bumbu') return matchSearch && item.kategori === 'bumbu';
    if (stockCategory === 'Bambu') return matchSearch && item.kategori === 'kayu_bambu';
    return matchSearch;
  });

  const handleCreateStockSubmit = async (e) => {
    e.preventDefault();
    await inventoryService.add(newStockItem);
    setIsAddStockOpen(false);
    onRefreshData();
  };

  const handleUpdateStockQuantity = async () => {
    if (!selectedStockForEdit) return;
    const newTotal = selectedStockForEdit.jumlah_stok + Number(incomingQty);
    await inventoryService.updateStock(selectedStockForEdit.id, newTotal);
    setSelectedStockForEdit(null);
    onRefreshData();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 animate-fadeIn">
      {/* Hero Bar Staf Penggoreng */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-amber-300 shadow-inner">
            <Flame className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-['Space_Grotesk']">Portal Staf Penggoreng</h2>
              <span className="text-[10px] bg-amber-400 text-stone-900 font-bold px-2 py-0.5 rounded-full">
                Produksi
              </span>
            </div>
            <p className="text-xs text-amber-200 mt-0.5">
              Kelola proses penggorengan pesanan & pencatatan stok bahan mentah
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-black/20 p-1 rounded-xl text-xs font-bold w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('antrean_produksi')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition flex items-center justify-center space-x-1.5 ${
              activeTab === 'antrean_produksi' ? 'bg-white text-amber-900 shadow' : 'text-amber-100 hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Antrean Goreng ({fryingQueue.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('kelola_stok')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition flex items-center justify-center space-x-1.5 ${
              activeTab === 'kelola_stok' ? 'bg-white text-amber-900 shadow' : 'text-amber-100 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Stok Bahan Baku ({inventory.length})</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SECTION 1: ANTREAN PRODUKSI PENGGORENGAN */}
      {/* ==================================================================== */}
      {activeTab === 'antrean_produksi' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-900 text-base">Antrean Penggorengan Kerupuk</h3>
              <p className="text-xs text-stone-500">
                Pesanan yang siap digoreng dan sedang dalam proses di wajan pabrik
              </p>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              {fryingQueue.length} Pesanan Aktif
            </span>
          </div>

          {fryingQueue.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm text-stone-400 text-xs">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-emerald-500 opacity-60" />
              Tidak ada antrean pesanan yang menunggu penggorengan. Semua pesanan telah selesai digoreng!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fryingQueue.map((order) => {
                const isFrying = order.status_pesanan === 'sedang_digoreng';

                return (
                  <div
                    key={order.id}
                    className={`bg-white rounded-2xl p-5 shadow-sm border transition flex flex-col justify-between ${
                      isFrying ? 'border-amber-400 ring-2 ring-amber-100' : 'border-stone-200'
                    }`}
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-stone-100 text-xs">
                        <div>
                          <span className="font-bold text-stone-900">{order.nomor_pesanan}</span>
                          <span className="text-stone-400 block text-[10px]">
                            Pelanggan: {order.nama_pelanggan} ({order.no_telp || '-'})
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            isFrying
                              ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {isFrying ? '🔥 SEDANG DIGORENG' : '⏳ MENUNGGU DIGORENG'}
                        </span>
                      </div>

                      {/* Detail Pesanan */}
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
                          Kemasan: <strong>{order.kemasan_plastik || '1/2 kg'}</strong> • Merek:{' '}
                          <strong>{order.label_merek || 'Diansyah'}</strong>
                        </div>
                        {order.catatan && (
                          <div className="p-2 bg-amber-50/70 rounded-lg text-[11px] text-amber-900 border border-amber-100 mt-2">
                            <strong>Catatan:</strong> {order.catatan}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons Sesuai Use Case SDD UC-11 */}
                    <div className="mt-5 pt-3 border-t border-stone-100 flex items-center gap-2">
                      {!isFrying ? (
                        <button
                          onClick={() => handleStartFrying(order)}
                          className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow flex items-center justify-center space-x-1"
                        >
                          <Flame className="w-4 h-4" />
                          <span>Mulai Goreng (Potong Bahan)</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleFinishFrying(order)}
                          className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow flex items-center justify-center space-x-1"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Selesai Goreng & Kirim ke QC</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* SECTION 2: KELOLA STOK BAHAN BAKU (SDD Mockup Page 88-93) */}
      {/* ==================================================================== */}
      {activeTab === 'kelola_stok' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-stone-900 text-base">Kelola Stok Bahan Baku</h3>
              <p className="text-xs text-stone-500">
                Pencatatan masuknya kerupuk mentah, bumbu tabur, plastik kemasan & bambu jemuran
              </p>
            </div>
            <button
              onClick={() => setIsAddStockOpen(true)}
              className="px-4 py-2.5 bg-[#881337] hover:bg-[#700f2d] text-white rounded-xl text-xs font-bold transition shadow flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Bahan Baru</span>
            </button>
          </div>

          {/* Search & Category Filter Pills matching SDD Page 88 */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
              <input
                type="text"
                placeholder="Cari bahan baku (misal: mentah, plastik, bumbu, bambu)..."
                value={searchStock}
                onChange={(e) => setSearchStock(e.target.value)}
                className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex space-x-2 overflow-x-auto text-xs pb-1">
              {['Semua', 'Kerupuk', 'Plastik', 'Bumbu', 'Bambu'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setStockCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition ${
                    stockCategory === cat
                      ? 'bg-amber-600 text-white shadow-xs font-bold'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Item Cards (SDD Page 88-91) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInventory.map((item) => {
              const isLow = item.jumlah_stok <= (item.batas_minimum || 5);

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl p-4 shadow-sm border transition flex flex-col justify-between ${
                    isLow ? 'border-rose-300 bg-rose-50/20' : 'border-stone-200'
                  }`}
                >
                  <div>
                    <div className="flex items-start space-x-3">
                      <img
                        src={item.gambar_url}
                        alt={item.nama_bahan}
                        className="w-16 h-16 rounded-xl object-cover border border-stone-200 shadow-xs"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                          {item.kategori.replace('_', ' ')}
                        </span>
                        <h4 className="font-bold text-xs text-stone-900 truncate">{item.nama_bahan}</h4>
                        <div className="text-[11px] font-semibold text-rose-700 mt-0.5">
                          Rp {(item.harga_beli || 0).toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>

                    {/* Stock Status Bar */}
                    <div className="mt-3 p-2.5 bg-stone-50 rounded-xl border border-stone-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-stone-500 text-[10px] block">Jumlah Tersedia:</span>
                        <span className="text-sm font-black text-stone-900">
                          {item.jumlah_stok}{' '}
                          <span className="text-xs font-normal text-stone-500">{item.satuan}</span>
                        </span>
                      </div>

                      {isLow ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-1 rounded-md">
                          <AlertTriangle className="w-3 h-3" />
                          Hampir Habis!
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                          Stok Aman
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions: Quick Stock Refill */}
                  <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedStockForEdit(item)}
                      className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Input Stok Masuk</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: INPUT STOK MASUK CEPAT (SDD UC-07, 08, 09) */}
      {selectedStockForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h4 className="font-bold text-sm text-stone-900">Tambah Stok Masuk</h4>
              <button
                onClick={() => setSelectedStockForEdit(null)}
                className="p-1 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 text-xs space-y-3">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-500 block text-[10px]">Nama Bahan:</span>
                <span className="font-bold text-sm text-stone-900">{selectedStockForEdit.nama_bahan}</span>
                <span className="text-stone-500 block text-[11px] mt-1">
                  Stok saat ini: {selectedStockForEdit.jumlah_stok} {selectedStockForEdit.satuan}
                </span>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Jumlah Stok Baru Masuk ({selectedStockForEdit.satuan}):
                </label>
                <input
                  type="number"
                  min="1"
                  value={incomingQty}
                  onChange={(e) => setIncomingQty(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 font-bold focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-[11px]">
                Stok setelah penambahan: <strong>{selectedStockForEdit.jumlah_stok + Number(incomingQty || 0)} {selectedStockForEdit.satuan}</strong>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end space-x-2">
              <button
                onClick={() => setSelectedStockForEdit(null)}
                className="px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Batal
              </button>
              <button
                onClick={handleUpdateStockQuantity}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow"
              >
                Simpan Penambahan Stok
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH BAHAN BARU (SDD Page 92-93) */}
      {isAddStockOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-fadeIn max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-bold text-sm text-stone-900">Tambah Data Bahan Baku</h3>
              <button onClick={() => setIsAddStockOpen(false)} className="p-1 text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStockSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Nama Bahan Baku</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Kerupuk Mentah Udang"
                  value={newStockItem.nama_bahan}
                  onChange={(e) => setNewStockItem({ ...newStockItem, nama_bahan: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-rose-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Kategori</label>
                  <select
                    value={newStockItem.kategori}
                    onChange={(e) => setNewStockItem({ ...newStockItem, kategori: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="kerupuk_mentah">Kerupuk Mentah</option>
                    <option value="bumbu">Bumbu Tabur</option>
                    <option value="plastik">Plastik Kemasan</option>
                    <option value="kayu_bambu">Kayu / Bambu</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Satuan</label>
                  <select
                    value={newStockItem.satuan}
                    onChange={(e) => setNewStockItem({ ...newStockItem, satuan: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="Bal">Bal</option>
                    <option value="Kg">Kg</option>
                    <option value="Pcs">Pcs</option>
                    <option value="Ikat">Ikat</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Stok Awal</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newStockItem.jumlah_stok}
                    onChange={(e) => setNewStockItem({ ...newStockItem, jumlah_stok: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Batas Minimum Stok</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newStockItem.batas_minimum}
                    onChange={(e) => setNewStockItem({ ...newStockItem, batas_minimum: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Harga Beli / Satuan (Rp)</label>
                <input
                  type="number"
                  value={newStockItem.harga_beli}
                  onChange={(e) => setNewStockItem({ ...newStockItem, harga_beli: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">URL Foto Bahan</label>
                <input
                  type="url"
                  value={newStockItem.gambar_url}
                  onChange={(e) => setNewStockItem({ ...newStockItem, gambar_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddStockOpen(false)}
                  className="px-3 py-2 text-stone-600 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#881337] hover:bg-[#700f2d] text-white rounded-xl font-bold shadow"
                >
                  Simpan Bahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
