import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PelangganView from './components/PelangganView';
import StaffPenggorengView from './components/StaffPenggorengView';
import StaffPembungkusView from './components/StaffPembungkusView';
import OwnerView from './components/OwnerView';
import AuthModal from './components/AuthModal';
import SupabaseModal from './components/SupabaseModal';
import NotificationDrawer from './components/NotificationDrawer';
import {
  productService,
  orderService,
  inventoryService,
  notificationService,
  authService,
  isConfigured
} from './supabase';

export default function App() {
  const [activeRole, setActiveRole] = useState('pelanggan');
  const [currentUser, setCurrentUser] = useState(null);

  // App Data
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [cart, setCart] = useState([]);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSupabaseOpen, setIsSupabaseOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Phone Frame Simulation (as in Bab V Mockup)
  const [isMobilePreview, setIsMobilePreview] = useState(false);

  const refreshData = async () => {
    try {
      const [prods, ords, inv] = await Promise.all([
        productService.getAll(),
        orderService.getAll(),
        inventoryService.getAll()
      ]);
      setProducts(prods || []);
      setOrders(ords || []);
      setInventory(inv || []);
      setNotifications(notificationService.getNotifications());
    } catch (err) {
      console.warn('Refresh data failed:', err);
    }
  };

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      if (user.role) {
        setActiveRole(user.role);
      }
    }
    refreshData();
  }, []);

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    if (user && user.role) {
      setActiveRole(user.role);
    }
    refreshData();
  };

  const handleOrderCreated = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    refreshData();
  };

  return (
    <div className="min-h-screen bg-[#f8f6f0] flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Global Luxury Navbar */}
      <Navbar
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSupabase={() => setIsSupabaseOpen(true)}
        onOpenNotif={() => setIsNotifOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cart.reduce((a, c) => a + c.jumlah, 0)}
        notifCount={notifications.length}
        isMobilePreview={isMobilePreview}
        setIsMobilePreview={setIsMobilePreview}
      />

      {/* Main View Container */}
      <main className="flex-1 w-full">
        {/* Role Helper Info Bar - Easy to understand for users and evaluators */}
        <div className="bg-stone-900/90 text-stone-300 text-xs py-2 px-4 border-b border-stone-800">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider bg-rose-950 text-rose-300 border border-rose-800/80 px-2.5 py-0.5 rounded-md">
                Peran Aktif:
              </span>
              <span className="font-bold text-white text-xs">
                {activeRole === 'pelanggan' && '🛒 Pelanggan (Pesan Kerupuk, Kustomisasi Rasa, Bayar & Lacak)'}
                {activeRole === 'staff_penggoreng' && '🔥 Staf Penggoreng (Kelola Antrean Wajan & Stok Bahan Baku)'}
                {activeRole === 'staff_pembungkus' && '📦 Staf Pembungkus (QC Verifikasi Mutu, Packing & Kasir Tunai)'}
                {activeRole === 'owner' && '📊 Owner / Pemilik (Laporan Omzet, Ekspor Excel/PDF & Kelola Produk)'}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-[11px]">
              <span className="text-stone-400">Ganti Peran:</span>
              <div className="inline-flex rounded-lg bg-stone-800 p-0.5">
                {[
                  { id: 'pelanggan', label: 'Pelanggan' },
                  { id: 'staff_penggoreng', label: 'Penggoreng' },
                  { id: 'staff_pembungkus', label: 'Pembungkus (QC)' },
                  { id: 'owner', label: 'Owner' }
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setActiveRole(r.id)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                      activeRole === r.id
                        ? 'bg-rose-700 text-white shadow-xs'
                        : 'text-stone-300 hover:text-white hover:bg-stone-700/60'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {isMobilePreview && activeRole === 'pelanggan' ? (
          /* Phone Mockup Frame Mode (Replicating Bab V Mockup with Titanium Frame) */
          <div className="py-8 flex flex-col justify-center items-center">
            <div className="text-center mb-3">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-widest bg-stone-200/60 px-3 py-1 rounded-full">
                Simulasi Layar Smartphone (Mockup Bab V SDD)
              </span>
            </div>

            <div className="w-[390px] h-[844px] bg-stone-900 rounded-[52px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-white/10 ring-offset-4 ring-offset-stone-800 relative overflow-hidden flex flex-col">
              {/* Dynamic Island */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-between px-3">
                <div className="w-2.5 h-2.5 rounded-full bg-stone-800"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse"></div>
              </div>

              {/* Screen Area */}
              <div className="w-full h-full bg-[#fbf9f5] rounded-[42px] overflow-y-auto no-scrollbar pt-6">
                <PelangganView
                  products={products}
                  orders={orders}
                  onOrderCreated={handleOrderCreated}
                  cart={cart}
                  setCart={setCart}
                  isCartOpen={isCartOpen}
                  setIsCartOpen={setIsCartOpen}
                  currentUser={currentUser}
                  isInsideMobileMockup={true}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Responsive Desktop & Tablet Mode */
          <div>
            {activeRole === 'pelanggan' && (
              <PelangganView
                products={products}
                orders={orders}
                onOrderCreated={handleOrderCreated}
                cart={cart}
                setCart={setCart}
                isCartOpen={isCartOpen}
                setIsCartOpen={setIsCartOpen}
                currentUser={currentUser}
                isInsideMobileMockup={false}
              />
            )}

            {activeRole === 'staff_penggoreng' && (
              <StaffPenggorengView
                orders={orders}
                inventory={inventory}
                onRefreshData={refreshData}
                currentUser={currentUser}
              />
            )}

            {activeRole === 'staff_pembungkus' && (
              <StaffPembungkusView
                orders={orders}
                inventory={inventory}
                onRefreshData={refreshData}
                currentUser={currentUser}
              />
            )}

            {activeRole === 'owner' && (
              <OwnerView
                orders={orders}
                products={products}
                inventory={inventory}
                onRefreshData={refreshData}
                currentUser={currentUser}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer (SDD & SRS Academic Credits) */}
      <footer className="no-print bg-[#3b0613] text-rose-200 text-xs py-5 px-4 text-center border-t border-rose-950/80">
        <div className="max-w-4xl mx-auto space-y-1.5">
          <p className="font-extrabold text-white text-sm font-['Space_Grotesk'] tracking-wide">
            PABRIK KERUPUK DIANSYAH
          </p>
          <p className="text-[11px] text-rose-200/80">
            Sistem Informasi Pemesanan & Pengendalian Produksi • Software Design Document (SDD) Kelompok 3
          </p>
          <p className="text-[10px] text-rose-300/60">
            Ketua: Nayla Putri Romdoni (2450231051) • Anggota: Anita Nurhayati (2450231046) & Meila Fitri (2450231054)
          </p>
          <div className="pt-2 flex items-center justify-center gap-3 text-[10px] text-amber-300/80 font-mono">
            <span>Supabase PostgreSQL Engine</span>
            <span>•</span>
            <span>Real-time Production Pipeline</span>
            <span>•</span>
            <span>POS Thermal & PDF Invoicing</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <SupabaseModal
        isOpen={isSupabaseOpen}
        onClose={() => setIsSupabaseOpen(false)}
      />

      <NotificationDrawer
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
      />
    </div>
  );
}
