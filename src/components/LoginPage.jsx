import React, { useState } from 'react';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Flame,
  Package,
  TrendingUp,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Phone,
  MapPin,
  Mail,
  ChevronRight
} from 'lucide-react';
import { authService, isConfigured } from '../supabase';

export default function LoginPage({ onLoginSuccess, onExploreAsGuest }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    rememberMe: true
  });

  const [registerData, setRegisterData] = useState({
    nama: '',
    username: '',
    password: '',
    email: '',
    no_telp: '',
    alamat: '',
    role: 'pelanggan'
  });

  const handleCredChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.username.trim() || !credentials.password.trim()) {
      setErrorMsg('Harap masukkan username dan kata sandi Anda.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await authService.login(credentials.username, credentials.password);
      if (res.success) {
        setSuccessMsg(`Selamat datang kembali, ${res.user.nama}!`);
        setTimeout(() => {
          onLoginSuccess(res.user);
        }, 600);
      } else {
        setErrorMsg(res.message || 'Username atau password tidak cocok.');
      }
    } catch (err) {
      setErrorMsg('Terjadi kendala koneksi. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!registerData.nama || !registerData.username || !registerData.password || !registerData.no_telp) {
      setErrorMsg('Harap lengkapi semua bidang yang wajib diisi.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await authService.register(registerData);
      if (res.success) {
        setSuccessMsg(`Pendaftaran berhasil! Selamat datang, ${res.user.nama}!`);
        setTimeout(() => {
          onLoginSuccess(res.user);
        }, 600);
      } else {
        setErrorMsg('Pendaftaran gagal. Silakan gunakan username lain.');
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan saat pendaftaran.');
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Demo Login Quick Fill
  const handleQuickLogin = async (username, password) => {
    setCredentials({ username, password, rememberMe: true });
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await authService.login(username, password);
      if (res.success) {
        setSuccessMsg(`Masuk sebagai ${res.user.nama}...`);
        setTimeout(() => {
          onLoginSuccess(res.user);
        }, 500);
      } else {
        setErrorMsg(res.message);
      }
    } catch (e) {
      setErrorMsg('Gagal masuk akun demo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1c040a] text-stone-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-rose-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/15 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Top Simple Brand Bar */}
      <header className="relative z-10 py-5 px-6 sm:px-12 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#881337] to-amber-500 p-0.5 shadow-lg shadow-black/40">
            <div className="w-full h-full bg-[#3b0613] rounded-[14px] flex items-center justify-center">
              <img src="/logo-diansyah.svg" alt="Logo" className="w-6 h-6 object-contain" />
            </div>
          </div>
          <div>
            <div className="font-black text-lg tracking-wider font-['Space_Grotesk'] text-white flex items-center gap-1.5">
              <span>DIANSYAH</span>
              <span className="text-[10px] bg-amber-400 text-stone-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                KERUPUK
              </span>
            </div>
            <p className="text-[10px] text-rose-200/70 uppercase tracking-widest font-medium">
              Sistem Informasi Pemesanan & Produksi
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-1.5 text-xs text-rose-200/80 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{isConfigured ? 'Supabase Database Online' : 'Mode Demo Lokal Aktif'}</span>
          </div>

          <button
            onClick={onExploreAsGuest}
            className="text-xs font-bold text-amber-300 hover:text-white bg-amber-400/10 hover:bg-amber-400/20 border border-amber-300/30 px-3.5 py-1.5 rounded-full transition flex items-center gap-1"
          >
            <span>Katalog Tamu</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Login / Register Area */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14">
        {/* Left Side: Brand Narrative & Key Values (Desktop) */}
        <div className="hidden lg:block flex-1 space-y-6">
          <div className="inline-flex items-center space-x-2 bg-amber-400/15 border border-amber-300/30 text-amber-300 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Pabrik Kerupuk Diansyah Sumedang</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-black font-['Space_Grotesk'] text-white tracking-tight leading-tight">
            Portal Digital Terpadu Produksi & Pemesanan
          </h1>

          <p className="text-sm text-rose-200/80 leading-relaxed max-w-lg">
            Satu sistem untuk seluruh alur bisnis pabrik kerupuk: mulai dari pesanan pelanggan, antrean wajan penggorengan, verifikasi mutu kerenyahan (QC), hingga pelaporan keuangan omzet otomatis.
          </p>

          {/* 4 Actors Grid (SDD Page 14-16) */}
          <div className="grid grid-cols-2 gap-3.5 pt-2 max-w-lg">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
              <div className="flex items-center space-x-2.5 text-amber-300 font-bold text-xs mb-1">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span>Owner (Pemilik)</span>
              </div>
              <p className="text-[11px] text-stone-300">
                Pantau omzet harian, grafik transaksi, dan ekspor laporan PDF / Excel.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
              <div className="flex items-center space-x-2.5 text-amber-300 font-bold text-xs mb-1">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Staf Penggoreng</span>
              </div>
              <p className="text-[11px] text-stone-300">
                Kelola antrean wajan, pengurangan stok bahan mentah otomatis.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
              <div className="flex items-center space-x-2.5 text-amber-300 font-bold text-xs mb-1">
                <Package className="w-4 h-4 text-amber-400" />
                <span>Staf Pembungkus (QC)</span>
              </div>
              <p className="text-[11px] text-stone-300">
                Verifikasi mutu kerenyahan, packing plastik, & kasir outlet tunai.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
              <div className="flex items-center space-x-2.5 text-amber-300 font-bold text-xs mb-1">
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>Pelanggan</span>
              </div>
              <p className="text-[11px] text-stone-300">
                Pesan bal kerupuk, kustomisasi rasa, bayar QRIS & lacak real-time.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Modern Card Form */}
        <div className="w-full max-w-md bg-[#2d0713]/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-900/60 ring-1 ring-white/10 relative">
          {/* Header Switcher */}
          <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 mb-6">
            <button
              onClick={() => {
                setActiveTab('login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === 'login'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 shadow-md scale-[1.01]'
                  : 'text-rose-200/80 hover:text-white'
              }`}
            >
              Masuk (Login)
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === 'register'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 shadow-md scale-[1.01]'
                  : 'text-rose-200/80 hover:text-white'
              }`}
            >
              Daftar Akun Baru
            </button>
          </div>

          {/* Alerts */}
          {errorMsg && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-950/80 border border-rose-700/80 text-rose-200 text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-600/80 text-emerald-200 text-xs flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: FORM LOGIN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-rose-200 mb-1.5">Username</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-rose-300/60" />
                  <input
                    type="text"
                    name="username"
                    required
                    value={credentials.username}
                    onChange={handleCredChange}
                    placeholder="Masukkan username Anda..."
                    className="w-full bg-black/40 text-white text-xs sm:text-sm pl-10 pr-4 py-3 rounded-2xl border border-rose-900/80 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium placeholder:text-stone-500 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-rose-200">Kata Sandi (Password)</label>
                  <span className="text-[11px] text-amber-300/80 hover:underline cursor-pointer">
                    Lupa Password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-rose-300/60" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={credentials.password}
                    onChange={handleCredChange}
                    placeholder="Masukkan password Anda..."
                    className="w-full bg-black/40 text-white text-xs sm:text-sm pl-10 pr-11 py-3 rounded-2xl border border-rose-900/80 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium placeholder:text-stone-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-stone-400 hover:text-white transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center space-x-2 text-rose-200/90 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={credentials.rememberMe}
                    onChange={(e) => setCredentials({ ...credentials, rememberMe: e.target.checked })}
                    className="rounded bg-black/40 border-rose-900 text-amber-500 focus:ring-amber-400"
                  />
                  <span>Ingat Saya di Perangkat Ini</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-500 text-stone-950 rounded-2xl text-xs sm:text-sm font-extrabold transition shadow-lg hover:shadow-xl shadow-amber-500/20 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{loading ? 'Memvalidasi...' : 'Masuk ke Sistem Diansyah'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* 1-Click Fast Demo Logins for Evaluator & Team */}
              <div className="pt-5 border-t border-white/10">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-300/80">
                    Akses Cepat Pengujian (1-Klik):
                  </span>
                  <span className="text-[10px] text-amber-300 font-mono">Sesuai SDD Bab IV</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('owner', 'owner123')}
                    className="p-2.5 text-left rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-200 transition group"
                  >
                    <div className="font-extrabold flex items-center justify-between">
                      <span>👑 Owner</span>
                      <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">
                        Pabrik
                      </span>
                    </div>
                    <div className="text-[10px] text-purple-300/70 font-mono mt-0.5">owner / owner123</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('penggoreng', 'goreng123')}
                    className="p-2.5 text-left rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 text-amber-200 transition group"
                  >
                    <div className="font-extrabold flex items-center justify-between">
                      <span>🔥 Penggoreng</span>
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">
                        Wajan
                      </span>
                    </div>
                    <div className="text-[10px] text-amber-300/70 font-mono mt-0.5">penggoreng / goreng123</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('pembungkus', 'bungkus123')}
                    className="p-2.5 text-left rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-200 transition group"
                  >
                    <div className="font-extrabold flex items-center justify-between">
                      <span>📦 Pembungkus</span>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                        QC & POS
                      </span>
                    </div>
                    <div className="text-[10px] text-emerald-300/70 font-mono mt-0.5">pembungkus / bungkus123</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('pelanggan', 'user123')}
                    className="p-2.5 text-left rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-200 transition group"
                  >
                    <div className="font-extrabold flex items-center justify-between">
                      <span>🛒 Pelanggan</span>
                      <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded">
                        Pesan
                      </span>
                    </div>
                    <div className="text-[10px] text-rose-300/70 font-mono mt-0.5">pelanggan / user123</div>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: FORM REGISTRASI PELANGGAN / KARYAWAN */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-rose-200 mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  name="nama"
                  required
                  value={registerData.nama}
                  onChange={handleRegisterChange}
                  placeholder="Contoh: Nayla Putri Romdoni"
                  className="w-full bg-black/40 text-white px-3.5 py-2.5 rounded-xl border border-rose-900/80 focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-stone-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-rose-200 mb-1">Username Baru *</label>
                  <input
                    type="text"
                    name="username"
                    required
                    value={registerData.username}
                    onChange={handleRegisterChange}
                    placeholder="username"
                    className="w-full bg-black/40 text-white px-3.5 py-2.5 rounded-xl border border-rose-900/80 focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-stone-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-rose-200 mb-1">Password *</label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    placeholder="******"
                    className="w-full bg-black/40 text-white px-3.5 py-2.5 rounded-xl border border-rose-900/80 focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-stone-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-rose-200 mb-1">No. WhatsApp / Telepon *</label>
                <input
                  type="tel"
                  name="no_telp"
                  required
                  value={registerData.no_telp}
                  onChange={handleRegisterChange}
                  placeholder="085786900230"
                  className="w-full bg-black/40 text-white px-3.5 py-2.5 rounded-xl border border-rose-900/80 focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-stone-500"
                />
              </div>

              <div>
                <label className="block font-bold text-rose-200 mb-1">Alamat Domisili / Toko</label>
                <input
                  type="text"
                  name="alamat"
                  value={registerData.alamat}
                  onChange={handleRegisterChange}
                  placeholder="Jl. Melati No. 45, Cimahi"
                  className="w-full bg-black/40 text-white px-3.5 py-2.5 rounded-xl border border-rose-900/80 focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-stone-500"
                />
              </div>

              <div>
                <label className="block font-bold text-rose-200 mb-1">Daftar Sebagai Peran:</label>
                <select
                  name="role"
                  value={registerData.role}
                  onChange={handleRegisterChange}
                  className="w-full bg-black/40 text-white px-3 py-2 rounded-xl border border-rose-900/80 focus:outline-none focus:ring-2 focus:ring-amber-400 text-xs"
                >
                  <option value="pelanggan" className="bg-stone-900 text-white">Pelanggan (Pemesanan Kerupuk)</option>
                  <option value="staff_penggoreng" className="bg-stone-900 text-white">Staf Penggorengan Pabrik</option>
                  <option value="staff_pembungkus" className="bg-stone-900 text-white">Staf Pembungkus (QC)</option>
                  <option value="owner" className="bg-stone-900 text-white">Owner / Pemilik Pabrik</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-500 text-stone-950 rounded-2xl font-black text-xs transition shadow-lg disabled:opacity-50"
              >
                {loading ? 'Mendaftarkan...' : 'Selesaikan Pendaftaran Akun'}
              </button>
            </form>
          )}

          {/* Guest Explorer Pill */}
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={onExploreAsGuest}
              className="text-xs text-rose-300/80 hover:text-white transition inline-flex items-center gap-1 font-medium"
            >
              <span>Belum ingin masuk? Lihat katalog kerupuk sebagai Tamu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer Credits */}
      <footer className="relative z-10 py-4 px-6 text-center text-xs text-rose-300/50 border-t border-white/5">
        <p>
          Sistem Informasi Pemesanan & Produksi Pabrik Kerupuk Diansyah • Sesuai SDD & SRS Kelompok 3 (Nayla, Anita, Meila)
        </p>
      </footer>
    </div>
  );
}
