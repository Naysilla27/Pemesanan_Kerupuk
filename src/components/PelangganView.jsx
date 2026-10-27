import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Minus,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  ChevronRight,
  ArrowLeft,
  QrCode,
  CreditCard,
  Banknote,
  Sparkles,
  Printer,
  X,
  Trash2,
  Flame,
  Package,
  Award,
  ShieldCheck,
  Check,
  Truck,
  HeartHandshake,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { orderService } from '../supabase';
import PrintReceipt from './PrintReceipt';

export default function PelangganView({
  products = [],
  orders = [],
  onOrderCreated,
  cart = [],
  setCart,
  isCartOpen,
  setIsCartOpen,
  currentUser,
  isInsideMobileMockup = false
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Modal Customization State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customQty, setCustomQty] = useState(1);
  const [customRasa, setCustomRasa] = useState('Original');
  const [customPlastik, setCustomPlastik] = useState('Plastik 1/2 kg');
  const [customLabel, setCustomLabel] = useState('Diansyah');

  // Checkout Stages: 'browse' | 'form_data' | 'payment_select' | 'payment_success'
  const [checkoutStage, setCheckoutStage] = useState('browse');
  const [customerData, setCustomerData] = useState({
    nama: currentUser?.nama || 'Nayla Putri Romdoni',
    no_telp: currentUser?.no_telp || '085786900230',
    alamat: currentUser?.alamat || 'Jl. Pangeran Kornel No. 204, Pasanggrahan Baru, Sumedang'
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('qris');
  const [activePaymentOrder, setActivePaymentOrder] = useState(null);
  const [showReceiptOrder, setShowReceiptOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('katalog'); // 'katalog' | 'pesanan_saya'

  // Flavor add-on prices (SDD Page 70-71)
  const flavorAddons = {
    Original: 0,
    Balado: 40000,
    'Pedas Daun Jeruk': 50000,
    'Keju Manis': 30000
  };

  const currentFlavorAddon = flavorAddons[customRasa] || 0;
  const unitPrice = (selectedProduct?.harga || 160000) + currentFlavorAddon;
  const modalSubtotal = unitPrice * customQty;

  const handleOpenCustomize = (product) => {
    setSelectedProduct(product);
    setCustomQty(1);
    setCustomRasa('Original');
    setCustomPlastik('Plastik 1/2 kg');
    setCustomLabel('Diansyah');
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    const cartItem = {
      cartId: 'item-' + Date.now(),
      productId: selectedProduct.id,
      nama_produk: selectedProduct.nama_produk,
      gambar_url: selectedProduct.gambar_url,
      varian_rasa: customRasa,
      kemasan_plastik: customPlastik,
      label_merek: customLabel,
      jumlah: customQty,
      harga_satuan: unitPrice,
      total_harga: modalSubtotal,
      selected: true
    };
    setCart([...cart, cartItem]);
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  const handleDirectCheckout = () => {
    if (!selectedProduct) return;
    const directItem = {
      cartId: 'item-' + Date.now(),
      productId: selectedProduct.id,
      nama_produk: selectedProduct.nama_produk,
      gambar_url: selectedProduct.gambar_url,
      varian_rasa: customRasa,
      kemasan_plastik: customPlastik,
      label_merek: customLabel,
      jumlah: customQty,
      harga_satuan: unitPrice,
      total_harga: modalSubtotal,
      selected: true
    };
    setCart([directItem]);
    setSelectedProduct(null);
    setCheckoutStage('form_data');
  };

  const updateCartQty = (cartId, delta) => {
    setCart(
      cart
        .map((item) => {
          if (item.cartId === cartId) {
            const newQty = item.jumlah + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              jumlah: newQty,
              total_harga: newQty * item.harga_satuan
            };
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeCartItem = (cartId) => {
    setCart(cart.filter((item) => item.cartId !== cartId));
  };

  const toggleSelectAll = (checked) => {
    setCart(cart.map((i) => ({ ...i, selected: checked })));
  };

  const toggleSelectItem = (cartId) => {
    setCart(cart.map((i) => (i.cartId === cartId ? { ...i, selected: !i.selected } : i)));
  };

  const selectedCartItems = cart.filter((i) => i.selected);
  const cartSubtotal = selectedCartItems.reduce((acc, curr) => acc + curr.total_harga, 0);

  const handleProceedPayment = async () => {
    if (selectedCartItems.length === 0) return;

    const primaryItem = selectedCartItems[0];
    const orderPayload = {
      nama_pelanggan: customerData.nama,
      no_telp: customerData.no_telp,
      alamat: customerData.alamat,
      nama_produk:
        selectedCartItems.length > 1
          ? `${primaryItem.nama_produk} + ${selectedCartItems.length - 1} item lain`
          : primaryItem.nama_produk,
      id_produk: primaryItem.productId,
      varian_rasa: primaryItem.varian_rasa,
      kemasan_plastik: primaryItem.kemasan_plastik,
      label_merek: primaryItem.label_merek,
      jumlah: selectedCartItems.reduce((acc, curr) => acc + curr.jumlah, 0),
      harga_satuan: primaryItem.harga_satuan,
      total_harga: cartSubtotal,
      metode_pembayaran: selectedPaymentMethod,
      status_pembayaran: selectedPaymentMethod === 'tunai' ? 'pending' : 'lunas'
    };

    const created = await orderService.create(orderPayload);
    onOrderCreated(created);
    setActivePaymentOrder(created);

    if (selectedPaymentMethod !== 'tunai') {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }

    setCheckoutStage('payment_success');
    setCart(cart.filter((i) => !i.selected));
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) return;
    const res = await orderService.cancelOrder(orderId);
    if (!res.success) {
      alert(res.message);
    } else {
      alert('Pesanan berhasil dibatalkan.');
      window.location.reload();
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.nama_produk.toLowerCase().includes(searchTerm.toLowerCase());
    if (selectedCategory === 'Semua') return matchSearch;
    if (selectedCategory === 'Terlaris') return matchSearch && p.is_best_seller;
    if (selectedCategory === 'Original Gurih')
      return matchSearch && (p.nama_produk.toLowerCase().includes('kentang') || p.nama_produk.toLowerCase().includes('bawang'));
    if (selectedCategory === 'Pedas & Rempah')
      return matchSearch && (p.nama_produk.toLowerCase().includes('jengkol') || p.nama_produk.toLowerCase().includes('makaroni'));
    return matchSearch;
  });

  const bestSeller = products.find((p) => p.is_best_seller) || products[0];

  // Helper container class depending on mobile mockup or responsive desktop
  const containerClass = isInsideMobileMockup
    ? 'w-full max-w-md mx-auto bg-white min-h-screen px-4 pb-20'
    : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24';

  return (
    <div className="min-h-screen bg-[#f8f6f0] text-stone-900">
      {/* ==================================================================== */}
      {/* TOP USER NAVIGATION (KATALOG vs PESANAN SAYA) */}
      {/* ==================================================================== */}
      <div className="bg-[#4e0919] text-white shadow-md border-b border-rose-950/40 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-2.5">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setActiveTab('katalog');
                setCheckoutStage('browse');
              }}
              className={`flex items-center space-x-2 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === 'katalog' && checkoutStage === 'browse'
                  ? 'bg-white text-[#4e0919] shadow-md scale-[1.02]'
                  : 'text-rose-100 hover:bg-white/10'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-amber-500" />
              <span>Katalog Produk Kerupuk</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('pesanan_saya');
                setCheckoutStage('browse');
              }}
              className={`flex items-center space-x-2 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === 'pesanan_saya'
                  ? 'bg-white text-[#4e0919] shadow-md scale-[1.02]'
                  : 'text-rose-100 hover:bg-white/10'
              }`}
            >
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Pesanan Saya</span>
              {orders.length > 0 && (
                <span className="bg-amber-400 text-stone-950 text-[10px] font-black px-2 py-0.5 rounded-full ml-1">
                  {orders.length}
                </span>
              )}
            </button>
          </div>

          {/* Quick Cart Summary Badge on Top Right */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/15 px-3.5 py-1.5 rounded-xl text-xs font-bold text-rose-100 transition"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Keranjang:</span>
            <span className="font-mono text-amber-300 font-extrabold">{cart.length} item</span>
            {cartSubtotal > 0 && (
              <span className="hidden md:inline text-rose-200">
                • Rp {cartSubtotal.toLocaleString('id-ID')}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className={containerClass}>
        {/* ==================================================================== */}
        {/* TAB 1: KATALOG & PEMESANAN (SDD BAB IV & V) */}
        {/* ==================================================================== */}
        {activeTab === 'katalog' && checkoutStage === 'browse' && (
          <div className="space-y-8 animate-fadeIn">
            {/* HERO BANNER - MODERN & LUXURY */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4e0919] via-[#700f2d] to-[#881337] text-white p-6 sm:p-10 shadow-xl border border-rose-900/60">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center space-x-2 bg-amber-400/20 border border-amber-300/30 text-amber-200 text-xs font-bold px-3.5 py-1 rounded-full mb-3 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Pabrik Kerupuk Diansyah Sumedang</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black font-['Space_Grotesk'] tracking-tight leading-tight text-white">
                  Kerupuk Gurih Renyah Kualitas Pabrik, Langsung dari Wajan Penggorengan!
                </h1>

                <p className="mt-2.5 text-sm sm:text-base text-rose-100/90 leading-relaxed max-w-2xl font-normal">
                  Pesan satuan bal grosir dengan bebas memilih varian bumbu tabur, kemasan plastik higienis, dan pantau proses penggorengan secara real-time.
                </p>

                {/* Search Bar & Quick Counters */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  <div className="relative flex-1">
                    <Search className="w-5 h-5 absolute left-4 top-3.5 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Cari kerupuk favorit (kentang, bawang, jengkol, makaroni)..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-white text-stone-900 text-sm pl-12 pr-4 py-3 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium placeholder:text-stone-400 border border-transparent"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-700 text-xs bg-stone-100 rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold bg-black/25 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 self-start sm:self-auto">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>{products.length} Menu Kerupuk Siap Dipesan</span>
                  </div>
                </div>
              </div>
            </div>

            {/* HOW IT WORKS / 4 LANGKAH MUDAH PEMESANAN (EASY TO UNDERSTAND) */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-stone-200/90">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg font-['Space_Grotesk'] text-stone-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    <span>Cara Pemesanan di Pabrik Kerupuk Diansyah</span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Alur sistem terintegrasi dari pemesanan pelanggan hingga penggorengan & packing pabrik
                  </p>
                </div>
                <span className="hidden sm:inline text-xs font-bold text-rose-800 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                  4 Langkah Cepat
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-stone-200 flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#4e0919] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900">Pilih Kerupuk</h4>
                    <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                      Pilih aneka kerupuk mentah berkualitas (Kentang, Bawang, Makaroni, dll).
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-stone-200 flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900">Kustomisasi Pesanan</h4>
                    <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                      Pilih varian rasa (Original, Balado, Pedas, Keju) dan ukuran plastik kemasan.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-stone-200 flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900">Bayar Praktis</h4>
                    <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                      Pilih pembayaran Tunai di outlet, QRIS instan, DANA, atau Transfer Bank.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-stone-200 flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                    4
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900">Lacak Produksi Real-Time</h4>
                    <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                      Pantau antrean penggorengan, verifikasi QC, packing, dan cetak struk kuitansi.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CATEGORY FILTER PILLS */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-bold text-stone-500 mr-2">Kategori:</span>
              {['Semua', 'Terlaris', 'Original Gurih', 'Pedas & Rempah'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    selectedCategory === cat
                      ? 'bg-[#881337] text-white shadow-md shadow-rose-900/20 scale-[1.02]'
                      : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* SIGNATURE BEST SELLER HIGHLIGHT (SDD Page 67 & 86) */}
            {bestSeller && selectedCategory === 'Semua' && !searchTerm && (
              <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/5 rounded-3xl p-6 border border-amber-300/40 shadow-sm">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative w-full md:w-64 h-52 rounded-2xl overflow-hidden shrink-0 shadow-md">
                    <img
                      src={bestSeller.gambar_url}
                      alt={bestSeller.nama_produk}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-amber-500 text-stone-950 text-xs font-black px-3 py-1 rounded-full shadow">
                      ★ PALING LARIS
                    </span>
                    <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-0.5 rounded">
                      Grosir {bestSeller.satuan}
                    </span>
                  </div>

                  <div className="flex-1 space-y-2">
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#881337] bg-rose-100 px-2.5 py-1 rounded-md inline-block">
                      Pilihan Favorit Pelanggan Pabrik Diansyah
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black font-['Space_Grotesk'] text-stone-900">
                      {bestSeller.nama_produk}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {bestSeller.deskripsi}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <span className="text-xs text-stone-500">Harga Satuan Grosir:</span>
                        <div className="text-2xl font-black text-[#881337] font-['Space_Grotesk']">
                          Rp {bestSeller.harga.toLocaleString('id-ID')}
                          <span className="text-xs text-stone-400 font-normal"> / Bal</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleOpenCustomize(bestSeller)}
                          className="bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 px-4 py-2.5 rounded-xl text-xs font-extrabold transition shadow-xs flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4 text-rose-700" />
                          <span>Kustomisasi</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedProduct(bestSeller);
                            handleDirectCheckout();
                          }}
                          className="bg-gradient-to-r from-[#881337] to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white px-5 py-2.5 rounded-xl text-xs font-extrabold transition shadow-md flex items-center gap-1.5"
                        >
                          <span>Pesan Langsung</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PRODUCT CATALOG GRID (RESPONSIVE 1-4 COLUMNS) */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black font-['Space_Grotesk'] text-stone-900">
                  Daftar Produk Kerupuk Pabrik ({filteredProducts.length})
                </h3>
                <span className="text-xs text-stone-500">
                  Semua produk digoreng segar sesuai pesanan masuk
                </span>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 text-stone-500 text-sm">
                  Tidak ditemukan produk kerupuk dengan kata kunci "{searchTerm}".
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl border border-stone-200/80 hover:border-rose-300 transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div>
                        {/* Image Preview */}
                        <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 bg-stone-100">
                          <img
                            src={product.gambar_url}
                            alt={product.nama_produk}
                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                            loading="lazy"
                          />
                          {product.is_best_seller && (
                            <span className="absolute top-2.5 left-2.5 bg-amber-500 text-stone-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow">
                              ★ Terlaris
                            </span>
                          )}
                          {product.stok <= 3 && (
                            <span className="absolute top-2.5 right-2.5 bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow">
                              Sisa {product.stok} Bal
                            </span>
                          )}
                          <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            Grosir {product.satuan}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <h4 className="font-bold text-sm sm:text-base text-stone-900 line-clamp-1 group-hover:text-[#881337] transition font-['Space_Grotesk']">
                          {product.nama_produk}
                        </h4>
                        <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                          {product.deskripsi}
                        </p>
                      </div>

                      {/* Pricing & CTA */}
                      <div className="mt-4 pt-3 border-t border-stone-100">
                        <div className="flex items-baseline justify-between mb-3">
                          <div className="text-base font-black text-[#881337] font-['Space_Grotesk']">
                            Rp {product.harga.toLocaleString('id-ID')}
                          </div>
                          <span className="text-[11px] text-stone-400">/ Bal Pabrik</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleOpenCustomize(product)}
                            className="py-2.5 bg-stone-50 hover:bg-stone-100 text-stone-800 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 border border-stone-200"
                          >
                            <Plus className="w-3.5 h-3.5 text-rose-700" />
                            <span>Kustom</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              handleDirectCheckout();
                            }}
                            className="py-2.5 bg-[#881337] hover:bg-rose-800 text-white rounded-xl text-xs font-extrabold transition shadow-xs flex items-center justify-center space-x-1"
                          >
                            <span>Beli</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODAL KUSTOMISASI PESANAN (SDD Page 70-71) */}
        {/* ==================================================================== */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-stone-200 animate-slideUp">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div className="flex items-center space-x-2">
                  <span className="w-8 h-8 rounded-full bg-rose-50 text-rose-800 flex items-center justify-center font-bold">
                    ⚙️
                  </span>
                  <div>
                    <h3 className="font-extrabold text-stone-900 text-base font-['Space_Grotesk']">
                      Kustomisasi Kerupuk Diansyah
                    </h3>
                    <p className="text-xs text-stone-400">Pilih bumbu varian rasa & jenis kemasan</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Product Preview Bar */}
              <div className="mt-4 p-3.5 bg-[#fbf9f5] rounded-2xl flex items-center space-x-3.5 border border-stone-200">
                <img
                  src={selectedProduct.gambar_url}
                  alt={selectedProduct.nama_produk}
                  className="w-16 h-16 rounded-xl object-cover shadow-sm shrink-0"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-stone-900">{selectedProduct.nama_produk}</h4>
                  <p className="text-xs text-rose-800 font-black mt-0.5">
                    Rp {selectedProduct.harga.toLocaleString('id-ID')}{' '}
                    <span className="text-[11px] text-stone-400 font-normal">/ Bal</span>
                  </p>
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="mt-4 flex items-center justify-between p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                <div>
                  <span className="text-xs font-bold text-stone-800 block">Jumlah Pesanan (Bal):</span>
                  <span className="text-[11px] text-stone-400">1 Bal = Satuan Grosir Standar Pabrik</span>
                </div>
                <div className="flex items-center space-x-3 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-xs">
                  <button
                    onClick={() => setCustomQty(Math.max(1, customQty - 1))}
                    className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700 font-bold hover:bg-stone-200 transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-black text-sm text-stone-900 w-8 text-center">{customQty}</span>
                  <button
                    onClick={() => setCustomQty(customQty + 1)}
                    className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700 font-bold hover:bg-stone-200 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Flavor Selector */}
              <div className="mt-4">
                <label className="block text-xs font-bold text-stone-800 mb-2">
                  Pilih Varian Bumbu Tabur:
                </label>
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  {[
                    { name: 'Original', extra: 0, tag: 'Bawang Gurih Alami' },
                    { name: 'Balado', extra: 40000, tag: 'Manis Pedas Khas' },
                    { name: 'Pedas Daun Jeruk', extra: 50000, tag: 'Pedas Harum Jeruk' },
                    { name: 'Keju Manis', extra: 30000, tag: 'Gurih Manis Creamy' }
                  ].map((flavor) => {
                    const isSelected = customRasa === flavor.name;
                    return (
                      <div
                        key={flavor.name}
                        onClick={() => setCustomRasa(flavor.name)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? 'border-[#881337] bg-rose-50 text-[#881337] font-bold ring-2 ring-rose-700/20 shadow-xs'
                            : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold">{flavor.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-rose-800" />}
                        </div>
                        <div className="text-[10px] text-stone-500 mt-0.5">{flavor.tag}</div>
                        <div className="text-[11px] font-extrabold text-rose-700 mt-1">
                          {flavor.extra === 0 ? 'Harga Normal' : `+Rp ${flavor.extra.toLocaleString('id-ID')}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Packaging Selector */}
              <div className="mt-4">
                <label className="block text-xs font-bold text-stone-800 mb-2">
                  Pilih Ukuran Plastik Kemasan:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {['Plastik 1/2 kg', 'Plastik 11x25 kg', 'Plastik 30x45 kg'].map((p) => {
                    const isSelected = customPlastik === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setCustomPlastik(p)}
                        className={`p-2.5 rounded-xl border text-xs text-center font-bold transition-all duration-200 ${
                          isSelected
                            ? 'border-[#881337] bg-[#881337] text-white shadow-xs'
                            : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        {p.replace('Plastik ', '')}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brand Label Stiker */}
              <div className="mt-4 flex items-center justify-between text-xs text-stone-600 bg-stone-50 p-3 rounded-2xl border border-stone-200">
                <span className="font-medium">Stiker Label Kemasan:</span>
                <span className="font-black text-[#881337] bg-rose-100/80 px-3 py-1 rounded-lg">
                  Merek Pabrik Kerupuk Diansyah
                </span>
              </div>

              {/* Subtotal & Action Buttons */}
              <div className="mt-6 pt-4 border-t border-stone-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs text-stone-500 block">Total Estimasi Harga:</span>
                    <span className="text-xl font-black text-[#881337] font-['Space_Grotesk']">
                      Rp {modalSubtotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <span className="text-xs text-stone-400">
                    ({customQty} Bal • {customRasa})
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-2xl text-xs font-extrabold transition flex items-center justify-center space-x-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Keranjang</span>
                  </button>
                  <button
                    onClick={handleDirectCheckout}
                    className="py-3 px-4 bg-gradient-to-r from-[#881337] to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white rounded-2xl text-xs font-extrabold transition shadow-md flex items-center justify-center space-x-1.5"
                  >
                    <span>Check Out</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* DRAWER KERANJANG SAYA (SLIDE-OVER) */}
        {/* ==================================================================== */}
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl border-l border-stone-200 animate-slideLeft">
              {/* Header */}
              <div className="p-5 bg-gradient-to-r from-[#4e0919] to-[#881337] text-white flex items-center justify-between shadow">
                <div className="flex items-center space-x-2.5">
                  <ShoppingBag className="w-5 h-5 text-amber-300" />
                  <h3 className="font-extrabold text-base font-['Space_Grotesk']">
                    Keranjang Belanja ({cart.length})
                  </h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 text-rose-200 hover:text-white hover:bg-white/10 rounded-full transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#fbf9f5]">
                {cart.length === 0 ? (
                  <div className="text-center py-24 text-stone-400 text-xs">
                    <ShoppingBag className="w-16 h-16 mx-auto mb-3 opacity-25 text-rose-800" />
                    Keranjang masih kosong. Pilih kerupuk favorit Anda di katalog!
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between pb-2 border-b border-stone-200 text-xs text-stone-600 font-semibold">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cart.every((i) => i.selected)}
                          onChange={(e) => toggleSelectAll(e.target.checked)}
                          className="rounded text-rose-700 focus:ring-rose-700"
                        />
                        <span>Pilih Semua Item</span>
                      </label>
                      <span>{selectedCartItems.length} item terpilih</span>
                    </div>

                    {cart.map((item) => (
                      <div
                        key={item.cartId}
                        className="p-3.5 bg-white rounded-2xl shadow-xs border border-stone-200 flex items-center space-x-3"
                      >
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => toggleSelectItem(item.cartId)}
                          className="rounded text-rose-700 focus:ring-rose-700"
                        />
                        <img
                          src={item.gambar_url}
                          alt={item.nama_produk}
                          className="w-14 h-14 rounded-xl object-cover shadow-xs shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs text-stone-900 truncate">{item.nama_produk}</h4>
                          <p className="text-[11px] text-stone-500">
                            {item.varian_rasa} • {item.kemasan_plastik}
                          </p>
                          <div className="text-[#881337] font-black text-xs mt-1">
                            Rp {item.total_harga.toLocaleString('id-ID')}
                          </div>
                        </div>

                        {/* Quantity & Delete */}
                        <div className="flex flex-col items-end space-y-2 shrink-0">
                          <button
                            onClick={() => removeCartItem(item.cartId)}
                            className="text-stone-300 hover:text-rose-600 p-1 transition"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <div className="flex items-center space-x-2 bg-stone-100 px-2 py-1 rounded-xl text-xs font-bold">
                            <button
                              onClick={() => updateCartQty(item.cartId, -1)}
                              className="text-stone-700 hover:text-rose-700 px-1"
                            >
                              -
                            </button>
                            <span className="text-stone-900 text-xs w-4 text-center">{item.jumlah}</span>
                            <button
                              onClick={() => updateCartQty(item.cartId, 1)}
                              className="text-stone-700 hover:text-rose-700 px-1"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="p-5 bg-white border-t border-stone-200">
                  <div className="flex items-center justify-between text-xs text-stone-600 mb-1">
                    <span>Subtotal Produk:</span>
                    <span>Rp {cartSubtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-black text-stone-900 mb-4 pt-2 border-t border-stone-100 font-['Space_Grotesk']">
                    <span>Total Pembayaran:</span>
                    <span className="text-xl text-[#881337]">Rp {cartSubtotal.toLocaleString('id-ID')}</span>
                  </div>

                  <button
                    disabled={selectedCartItems.length === 0}
                    onClick={() => {
                      setIsCartOpen(false);
                      setCheckoutStage('form_data');
                    }}
                    className="w-full py-3.5 bg-gradient-to-r from-[#881337] to-rose-700 hover:from-rose-700 hover:to-rose-800 disabled:bg-stone-300 text-white rounded-2xl text-xs font-black transition shadow-md flex items-center justify-center space-x-1.5"
                  >
                    <span>Lanjut Isi Data Pemesan</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* CHECKOUT STEP 1: FORM IDENTITAS PEMESAN (SDD Page 77 & 98) */}
        {/* ==================================================================== */}
        {checkoutStage === 'form_data' && (
          <div className="max-w-xl mx-auto p-4 sm:p-6 animate-fadeIn">
            <button
              onClick={() => setCheckoutStage('browse')}
              className="flex items-center space-x-1.5 text-xs text-stone-500 hover:text-stone-900 mb-4 font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Katalog Produk</span>
            </button>

            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-[#881337] mx-auto flex items-center justify-center font-black text-xl mb-3 shadow-inner">
                📝
              </div>

              <h3 className="text-center font-extrabold text-stone-900 text-lg font-['Space_Grotesk']">
                Data Identitas Pemesan
              </h3>
              <p className="text-center text-xs text-stone-500 mb-6">
                Data ini dicetak pada nota faktur pabrik dan digunakan staf untuk pengiriman/pengambilan
              </p>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1.5">Nama Lengkap Pemesan *</label>
                  <input
                    type="text"
                    required
                    value={customerData.nama}
                    onChange={(e) => setCustomerData({ ...customerData, nama: e.target.value })}
                    placeholder="Nama Anda atau Toko / Warung..."
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-rose-700 text-sm font-medium transition"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1.5">No. WhatsApp / Telepon Aktif *</label>
                  <input
                    type="tel"
                    required
                    value={customerData.no_telp}
                    onChange={(e) => setCustomerData({ ...customerData, no_telp: e.target.value })}
                    placeholder="Contoh: 085786900230"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-rose-700 text-sm font-medium transition"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1.5">
                    Alamat Lengkap (Tujuan Kirim atau Ambil di Pabrik)
                  </label>
                  <textarea
                    rows="3"
                    value={customerData.alamat}
                    onChange={(e) => setCustomerData({ ...customerData, alamat: e.target.value })}
                    placeholder="Contoh: Jl. Pangeran Kornel No. 204, Pasanggrahan Baru, Sumedang (Ambil Langsung)"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-rose-700 text-sm font-medium transition"
                  />
                </div>
              </div>

              {/* Bill Summary */}
              <div className="mt-6 p-4 bg-[#fbf9f5] rounded-2xl border border-stone-200 text-xs space-y-1.5">
                <div className="flex justify-between text-stone-600">
                  <span>Estimasi Penggorengan & QC:</span>
                  <span className="font-bold text-emerald-700">3 - 5 Hari Kerja</span>
                </div>
                <div className="flex justify-between font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total Tagihan Pesanan:</span>
                  <span className="text-[#881337] font-black text-base">
                    Rp {cartSubtotal.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setCheckoutStage('payment_select')}
                disabled={!customerData.nama || !customerData.no_telp}
                className="w-full mt-6 py-3.5 bg-gradient-to-r from-[#881337] to-rose-700 hover:from-rose-700 hover:to-rose-800 disabled:bg-stone-300 text-white rounded-2xl text-xs sm:text-sm font-black transition shadow-md"
              >
                Lanjut ke Metode Pembayaran ➔
              </button>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* CHECKOUT STEP 2: METODE PEMBAYARAN (SDD Page 78-81) */}
        {/* ==================================================================== */}
        {checkoutStage === 'payment_select' && (
          <div className="max-w-xl mx-auto p-4 sm:p-6 animate-fadeIn">
            <button
              onClick={() => setCheckoutStage('form_data')}
              className="flex items-center space-x-1.5 text-xs text-stone-500 hover:text-stone-900 mb-4 font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Data Pemesan</span>
            </button>

            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200">
              <h3 className="font-extrabold text-stone-900 text-lg font-['Space_Grotesk'] mb-1">
                Pilih Metode Pembayaran
              </h3>
              <p className="text-xs text-stone-500 mb-5">
                Pabrik Diansyah mendukung pembayaran Tunai di Pabrik dan Non-Tunai Digital
              </p>

              <div className="space-y-3">
                {[
                  {
                    id: 'qris',
                    title: 'QRIS (Semua Bank & E-Wallet)',
                    desc: 'BCA, Mandiri, BRI, GoPay, OVO, Dana, ShopeePay (Instan).',
                    icon: QrCode,
                    color: 'text-indigo-600'
                  },
                  {
                    id: 'tunai',
                    title: 'Tunai di Outlet Pabrik (Cash)',
                    desc: 'Bayar kas langsung saat ambil kerupuk di pabrik Diansyah.',
                    icon: Banknote,
                    color: 'text-emerald-600'
                  },
                  {
                    id: 'dana',
                    title: 'DANA E-Wallet',
                    desc: 'Transfer ke dompet digital resmi pabrik.',
                    icon: CreditCard,
                    color: 'text-sky-600'
                  },
                  {
                    id: 'bca',
                    title: 'Transfer Bank BCA',
                    desc: 'Bank Central Asia (BCA) Cabang Sumedang.',
                    icon: CreditCard,
                    color: 'text-blue-700'
                  },
                  {
                    id: 'mandiri',
                    title: 'Transfer Bank Mandiri',
                    desc: 'Bank Mandiri Rekening Resmi Pabrik.',
                    icon: CreditCard,
                    color: 'text-amber-700'
                  },
                  {
                    id: 'bni',
                    title: 'Transfer Bank BNI',
                    desc: 'Bank Negara Indonesia (BNI).',
                    icon: CreditCard,
                    color: 'text-teal-700'
                  }
                ].map((m) => {
                  const Icon = m.icon;
                  const isChecked = selectedPaymentMethod === m.id;
                  return (
                    <label
                      key={m.id}
                      onClick={() => setSelectedPaymentMethod(m.id)}
                      className={`p-3.5 sm:p-4 rounded-2xl border flex items-start space-x-3.5 cursor-pointer transition-all duration-200 ${
                        isChecked
                          ? 'border-[#881337] bg-rose-50/70 ring-2 ring-rose-700/20 shadow-xs'
                          : 'border-stone-200 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payMethod"
                        checked={isChecked}
                        onChange={() => setSelectedPaymentMethod(m.id)}
                        className="mt-1 text-rose-700 focus:ring-rose-700"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Icon className={`w-4 h-4 ${m.color}`} />
                          <span className="font-bold text-xs sm:text-sm text-stone-900">{m.title}</span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">{m.desc}</p>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Instructions Detail Box */}
              <div className="mt-5 p-4 sm:p-5 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
                {selectedPaymentMethod === 'qris' && (
                  <div className="text-center space-y-3">
                    <span className="font-bold text-stone-800 block text-xs">
                      Scan Kode QRIS Pabrik Diansyah
                    </span>
                    <div className="w-44 h-44 bg-white p-3 mx-auto rounded-2xl border border-stone-300 shadow-sm flex items-center justify-center">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=DIANSYAH-KERUPUK-PAYMENT"
                        alt="QRIS Code"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Total Nominal: <strong className="text-rose-800">Rp {cartSubtotal.toLocaleString('id-ID')}</strong>
                    </p>
                  </div>
                )}

                {selectedPaymentMethod === 'tunai' && (
                  <div className="space-y-1.5 text-stone-700">
                    <span className="font-bold text-emerald-800">Petunjuk Pembayaran Tunai (Cash):</span>
                    <p className="text-[11px] leading-relaxed">
                      Pesanan Anda akan langsung masuk ke antrean penggorengan pabrik. Harap siapkan uang pas sebesar{' '}
                      <strong>Rp {cartSubtotal.toLocaleString('id-ID')}</strong> saat pengambilan di kasir outlet pabrik.
                    </p>
                  </div>
                )}

                {selectedPaymentMethod === 'dana' && (
                  <div className="space-y-2">
                    <span className="font-bold text-sky-700">Nomor Akun DANA Resmi Pabrik:</span>
                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-stone-200">
                      <span className="font-mono font-bold text-sm">0857-8690-0230</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText('085786900230');
                          alert('Nomor DANA berhasil disalin!');
                        }}
                        className="text-xs bg-sky-50 text-sky-700 px-3 py-1 rounded-lg font-bold hover:bg-sky-100 flex items-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" /> Salin
                      </button>
                    </div>
                    <p className="text-[10px] text-stone-400">a.n Pabrik Kerupuk Diansyah</p>
                  </div>
                )}

                {selectedPaymentMethod === 'bca' && (
                  <div className="space-y-2">
                    <span className="font-bold text-blue-700">No. Rekening BCA Pabrik:</span>
                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-stone-200">
                      <span className="font-mono font-bold text-sm">807-0012-3456</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText('80700123456');
                          alert('Nomor Rekening BCA berhasil disalin!');
                        }}
                        className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-bold hover:bg-blue-100 flex items-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" /> Salin
                      </button>
                    </div>
                    <p className="text-[10px] text-stone-400">a.n Pabrik Kerupuk Diansyah (BCA Sumedang)</p>
                  </div>
                )}
              </div>

              {/* Total & Confirm Button */}
              <div className="mt-6 pt-4 border-t border-stone-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs sm:text-sm text-stone-600 font-bold">Total yang Harus Dibayar:</span>
                  <span className="text-2xl font-black text-[#881337] font-['Space_Grotesk']">
                    Rp {cartSubtotal.toLocaleString('id-ID')}
                  </span>
                </div>

                <button
                  onClick={handleProceedPayment}
                  className="w-full py-4 bg-gradient-to-r from-[#881337] to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white rounded-2xl text-xs sm:text-sm font-black transition shadow-lg hover:shadow-xl"
                >
                  {selectedPaymentMethod === 'tunai'
                    ? 'Konfirmasi Pemesanan Tunai'
                    : 'Konfirmasi Pembayaran Selesai ✓'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* CHECKOUT STEP 3: SUKSES PEMBAYARAN (SDD Page 81-82) */}
        {/* ==================================================================== */}
        {checkoutStage === 'payment_success' && activePaymentOrder && (
          <div className="max-w-xl mx-auto p-4 sm:p-6 animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#881337] to-rose-600 text-white mx-auto flex items-center justify-center shadow-xl mb-4 ring-8 ring-rose-50 animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-stone-900 font-['Space_Grotesk']">
                Transaksi Berhasil Diterima!
              </h3>
              <div className="text-2xl font-black text-[#881337] mt-1 font-['Space_Grotesk']">
                Rp {activePaymentOrder.total_harga.toLocaleString('id-ID')}
              </div>

              <div className="my-6 p-4 sm:p-5 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-500">Nomor Pesanan:</span>
                  <span className="font-bold text-stone-900">{activePaymentOrder.nomor_pesanan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">No. Referensi:</span>
                  <span className="font-black text-rose-800">{activePaymentOrder.nomor_referensi}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Metode Bayar:</span>
                  <span className="font-bold uppercase text-stone-900">
                    {activePaymentOrder.metode_pembayaran}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Waktu Transaksi:</span>
                  <span>{new Date(activePaymentOrder.tanggal_pesanan).toLocaleString('id-ID')}</span>
                </div>
              </div>

              <p className="text-xs text-stone-600 mb-6 leading-relaxed">
                Pesanan Anda telah diteruskan ke layar <strong>Staf Penggoreng</strong> pabrik Diansyah. Anda dapat memantau proses produksi di tab <strong>Pesanan Saya</strong>.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => setShowReceiptOrder(activePaymentOrder)}
                  className="w-full py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-2xl text-xs font-extrabold transition flex items-center justify-center space-x-2 border border-stone-200 shadow-xs"
                >
                  <Printer className="w-4 h-4 text-stone-600" />
                  <span>Cetak Struk Kuitansi / Faktur PDF</span>
                </button>

                <button
                  onClick={() => {
                    setCheckoutStage('browse');
                    setActiveTab('pesanan_saya');
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-[#881337] to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white rounded-2xl text-xs sm:text-sm font-black transition shadow-md"
                >
                  Pantau Status Produksi Pesanan Saya
                </button>

                <button
                  onClick={() => setCheckoutStage('browse')}
                  className="text-xs text-stone-500 hover:text-stone-900 font-bold pt-1 block mx-auto transition"
                >
                  Kembali ke Katalog Belanja
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: PESANAN SAYA & LACAK STATUS PRODUKSI REAL-TIME (SDD BAB IV & V) */}
        {/* ==================================================================== */}
        {activeTab === 'pesanan_saya' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="font-black text-xl sm:text-2xl font-['Space_Grotesk'] text-stone-900">
                Lacak Status Pesanan & Produksi Pabrik
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                Pantau langsung status penggorengan dari Kang Asep dan verifikasi mutu dari Teh Siti secara transparan.
              </p>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-stone-200">
                <ShoppingBag className="w-16 h-16 mx-auto mb-3 text-stone-300" />
                <h4 className="font-bold text-stone-700 text-sm">Belum Ada Riwayat Pemesanan</h4>
                <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
                  Anda belum pernah membuat pesanan kerupuk. Silakan buka menu katalog untuk mulai memesan.
                </p>
                <button
                  onClick={() => setActiveTab('katalog')}
                  className="mt-4 px-5 py-2.5 bg-[#881337] text-white rounded-xl text-xs font-bold hover:bg-rose-800 transition"
                >
                  Lihat Katalog Kerupuk
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {orders.map((order) => {
                  const isCancelled = order.status_pesanan === 'dibatalkan';
                  const isDone = order.status_pesanan === 'selesai';
                  const canCancel =
                    order.status_pesanan === 'menunggu_konfirmasi' ||
                    order.status_pesanan === 'menunggu_diproses';

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200 flex flex-col justify-between space-y-4"
                    >
                      {/* Top Header Card */}
                      <div className="flex items-center justify-between pb-3 border-b border-stone-100 text-xs">
                        <div>
                          <span className="font-black text-stone-900 text-sm font-['Space_Grotesk']">
                            {order.nomor_pesanan}
                          </span>
                          <div className="text-[11px] text-stone-400">
                            {new Date(order.tanggal_pesanan).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </div>
                        </div>

                        <span
                          className={`text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                            isDone
                              ? 'bg-emerald-100 text-emerald-800'
                              : isCancelled
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {order.status_pesanan.replace(/_/g, ' ')}
                        </span>
                      </div>

                      {/* Product & Flavor Info */}
                      <div className="space-y-1.5 text-xs">
                        <div className="font-extrabold text-stone-900 text-base font-['Space_Grotesk']">
                          {order.nama_produk}
                        </div>
                        <div className="text-stone-600 text-xs">
                          Varian Rasa: <strong>{order.varian_rasa || 'Original'}</strong> • Kemasan:{' '}
                          <strong>{order.kemasan_plastik || 'Plastik 1/2 kg'}</strong>
                        </div>
                        <div className="text-stone-600 text-xs">
                          Kuantitas: <strong>{order.jumlah} Bal</strong> • Merek:{' '}
                          <strong>{order.label_merek || 'Diansyah'}</strong>
                        </div>
                        <div className="text-stone-500 text-xs">
                          Pemesan: <strong>{order.nama_pelanggan || 'Pelanggan'}</strong> ({order.no_telp || '-'})
                        </div>
                        <div className="text-[#881337] font-black text-sm pt-1">
                          Total Belanja: Rp {(order.total_harga || 0).toLocaleString('id-ID')}
                        </div>
                      </div>

                      {/* Interactive Visual Stepper Timeline */}
                      {!isCancelled && (
                        <div className="bg-[#fbf9f5] p-4 rounded-2xl border border-stone-200">
                          <div className="text-xs font-bold text-stone-700 mb-3 flex items-center justify-between">
                            <span>Alur Produksi Kerupuk:</span>
                            <span className="text-[11px] text-stone-400 font-normal">
                              Estimasi: {order.estimasi_selesai || '3 - 5 Hari'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-center text-[10px]">
                            {/* Step 1 */}
                            <div className="flex-1">
                              <div
                                className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center font-bold text-xs ${
                                  order.status_pesanan !== 'dibatalkan'
                                    ? 'bg-[#881337] text-white shadow-xs'
                                    : 'bg-stone-200 text-stone-500'
                                }`}
                              >
                                1
                              </div>
                              <span className="mt-1 block text-[10px] font-bold text-stone-700">Diproses</span>
                            </div>

                            <div className="h-0.5 flex-1 bg-stone-200 -mt-3.5" />

                            {/* Step 2 */}
                            <div className="flex-1">
                              <div
                                className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center font-bold text-xs ${
                                  [
                                    'sedang_digoreng',
                                    'siap_diverifikasi',
                                    'sedang_dibungkus',
                                    'selesai'
                                  ].includes(order.status_pesanan)
                                    ? 'bg-amber-500 text-stone-950 shadow-xs'
                                    : 'bg-stone-200 text-stone-500'
                                }`}
                              >
                                2
                              </div>
                              <span className="mt-1 block text-[10px] font-bold text-stone-700">Digoreng</span>
                            </div>

                            <div className="h-0.5 flex-1 bg-stone-200 -mt-3.5" />

                            {/* Step 3 */}
                            <div className="flex-1">
                              <div
                                className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center font-bold text-xs ${
                                  ['sedang_dibungkus', 'selesai'].includes(order.status_pesanan)
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-stone-200 text-stone-500'
                                }`}
                              >
                                3
                              </div>
                              <span className="mt-1 block text-[10px] font-bold text-stone-700">Dikemas</span>
                            </div>

                            <div className="h-0.5 flex-1 bg-stone-200 -mt-3.5" />

                            {/* Step 4 */}
                            <div className="flex-1">
                              <div
                                className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center font-bold text-xs ${
                                  order.status_pesanan === 'selesai'
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'bg-stone-200 text-stone-500'
                                }`}
                              >
                                ✓
                              </div>
                              <span className="mt-1 block text-[10px] font-bold text-stone-700">Siap Ambil</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs">
                        <button
                          onClick={() => setShowReceiptOrder(order)}
                          className="text-stone-700 hover:text-stone-900 font-bold flex items-center gap-1.5 transition"
                        >
                          <Printer className="w-4 h-4 text-stone-500" />
                          <span>Cetak Struk Nota</span>
                        </button>

                        {canCancel && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="text-rose-700 hover:text-rose-800 font-extrabold bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 transition"
                          >
                            Batalkan Pesanan
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
      </div>

      {/* Printable Receipt Modal */}
      {showReceiptOrder && (
        <PrintReceipt order={showReceiptOrder} onClose={() => setShowReceiptOrder(null)} />
      )}
    </div>
  );
}
