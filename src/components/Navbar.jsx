import React from 'react';
import {
  Bell,
  ShoppingBag,
  User,
  LogOut,
  Database,
  Smartphone,
  Monitor,
  Flame,
  Package,
  ShieldCheck,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { isConfigured, authService } from '../supabase';

export default function Navbar({
  activeRole,
  setActiveRole,
  currentUser,
  onOpenAuth,
  onOpenSupabase,
  onOpenNotif,
  onOpenCart,
  cartCount,
  notifCount,
  isMobilePreview,
  setIsMobilePreview,
  onLogout
}) {
  const handleLogout = () => {
    authService.logout();
    if (onLogout) {
      onLogout();
    } else {
      window.location.reload();
    }
  };

  const roles = [
    { id: 'pelanggan', label: 'Pelanggan', icon: ShoppingBag },
    { id: 'staff_penggoreng', label: 'Staf Penggoreng', icon: Flame },
    { id: 'staff_pembungkus', label: 'Staf Pembungkus (QC)', icon: Package },
    { id: 'owner', label: 'Owner (Pemilik)', icon: TrendingUp }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#4e0919]/95 backdrop-blur-md text-white shadow-xl border-b border-rose-950/60 transition-all">
      {/* Top Thin Brand Ribbon */}
      <div className="bg-[#3b0613]/90 px-4 py-1.5 text-xs text-rose-200/90 flex flex-wrap items-center justify-between gap-2 border-b border-white/5">
        <div className="flex items-center space-x-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
          </span>
          <span className="font-semibold tracking-wide text-white font-['Space_Grotesk']">
            PABRIK KERUPUK DIANSYAH
          </span>
          <span className="hidden sm:inline text-rose-300/60 font-light">•</span>
          <span className="hidden sm:inline text-rose-200/80 text-[11px]">
            Sistem Informasi Terintegrasi Produksi & Pemesanan (SDD & SRS)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Supabase Status Pill */}
          <button
            onClick={onOpenSupabase}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide transition shadow-xs ${
              isConfigured
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/30'
                : 'bg-amber-400/20 text-amber-200 border border-amber-300/30 hover:bg-amber-400/30'
            }`}
            title="Konfigurasi Supabase PostgreSQL"
          >
            <Database className="w-3 h-3" />
            <span>{isConfigured ? 'Supabase Terhubung' : 'Mode Demo Lokal'}</span>
          </button>

          {/* Toggle Mobile Phone Frame */}
          <button
            onClick={() => setIsMobilePreview(!isMobilePreview)}
            className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/15 px-2.5 py-1 rounded-full text-[11px] text-rose-100 transition border border-white/10"
            title="Simulasi Tampilan Mockup Smartphone (Bab V)"
          >
            {isMobilePreview ? <Monitor className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
            <span className="hidden md:inline font-medium">{isMobilePreview ? 'Layar Penuh' : 'Mockup HP'}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Identity */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveRole('pelanggan')}
          >
            <div className="relative">
              <img
                src="/logo-diansyah.svg"
                alt="Logo Diansyah"
                className="w-10 h-10 drop-shadow-md group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-md -z-10 group-hover:bg-amber-400/30 transition"></div>
            </div>
            <div>
              <div className="font-black text-lg tracking-wider flex items-center gap-1.5 font-['Space_Grotesk'] text-white">
                <span>DIANSYAH</span>
                <span className="text-[10px] bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-xs">
                  KERUPUK
                </span>
              </div>
              <p className="text-[10px] text-rose-200/70 tracking-wide uppercase font-medium -mt-0.5 hidden sm:block">
                Cita Rasa Nusantara • Sejak 2024
              </p>
            </div>
          </div>

          {/* Segmented Role Navigation */}
          <div className="hidden lg:flex items-center space-x-1 bg-black/30 p-1.5 rounded-2xl border border-white/10 shadow-inner">
            {roles.map((r) => {
              const Icon = r.icon;
              const isActive = activeRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setActiveRole(r.id)}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-white to-rose-50 text-[#4e0919] shadow-md shadow-black/20 scale-[1.02]'
                      : 'text-rose-100/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#881337]' : 'text-rose-300'}`} />
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2.5">
            {/* Notification Bell */}
            <button
              onClick={onOpenNotif}
              className="relative p-2.5 rounded-xl hover:bg-white/10 transition text-rose-200 hover:text-white border border-transparent hover:border-white/10"
              title="Notifikasi Produksi Real-Time"
            >
              <Bell className="w-5 h-5" />
              {notifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 text-[10px] font-black rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {notifCount}
                </span>
              )}
            </button>

            {/* Cart Button (Pelanggan) */}
            {activeRole === 'pelanggan' && (
              <button
                onClick={onOpenCart}
                className="relative flex items-center space-x-2 bg-gradient-to-r from-rose-700 to-[#881337] hover:from-rose-600 hover:to-rose-800 px-4 py-2 rounded-xl text-xs font-extrabold transition shadow-md border border-rose-600/50 hover:scale-[1.02] active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4 text-amber-300" />
                <span className="hidden sm:inline">Keranjang</span>
                {cartCount > 0 ? (
                  <span className="w-5 h-5 bg-white text-[#881337] rounded-full flex items-center justify-center text-[10px] font-black shadow-xs">
                    {cartCount}
                  </span>
                ) : (
                  <span className="text-[10px] opacity-75 hidden sm:inline">(0)</span>
                )}
              </button>
            )}

            {/* User Profile / Auth Button */}
            {currentUser ? (
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15 shadow-sm">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-400 to-amber-300 text-stone-950 font-black flex items-center justify-center text-xs shadow-xs">
                  {currentUser.nama.charAt(0)}
                </div>
                <div className="hidden md:block text-left text-xs leading-tight">
                  <div className="font-bold text-white truncate max-w-[120px]">{currentUser.nama}</div>
                  <div className="text-[10px] text-rose-200 capitalize font-medium">{currentUser.role.replace('_', ' ')}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1 text-rose-200 hover:text-white hover:bg-white/10 rounded-lg transition"
                  title="Keluar (Logout)"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-1.5 bg-white text-[#4e0919] hover:bg-rose-50 px-4 py-2 rounded-xl text-xs font-extrabold transition shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                <User className="w-3.5 h-3.5 text-rose-800" />
                <span>Masuk Akun</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Horizontal Role Menu */}
        <div className="lg:hidden py-2.5 border-t border-rose-900/60 overflow-x-auto flex space-x-2 no-scrollbar">
          {roles.map((r) => {
            const Icon = r.icon;
            const isActive = activeRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setActiveRole(r.id)}
                className={`flex-shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'bg-white text-[#4e0919] font-black shadow-sm'
                    : 'text-rose-100 hover:bg-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
