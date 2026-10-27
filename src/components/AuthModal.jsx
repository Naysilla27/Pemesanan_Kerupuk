import React, { useState } from 'react';
import { User, Lock, Mail, Phone, MapPin, X, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { authService } from '../supabase';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  if (!isOpen) return null;

  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nama: '',
    email: '',
    no_telp: '',
    jenis_kelamin: 'Laki-laki',
    alamat: '',
    role: 'owner'
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setErrorMsg('Harap isi username dan password.');
      return;
    }

    setLoading(true);
    const result = await authService.login(formData.username, formData.password);
    setLoading(false);

    if (result.success) {
      onAuthSuccess(result.user);
      onClose();
    } else {
      setErrorMsg(result.message || 'Username atau password salah.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.nama || !formData.no_telp) {
      setErrorMsg('Harap lengkapi semua field yang wajib diisi.');
      return;
    }

    setLoading(true);
    const result = await authService.register(formData);
    setLoading(false);

    if (result.success) {
      onAuthSuccess(result.user);
      onClose();
    } else {
      setErrorMsg('Pendaftaran gagal. Silakan coba kembali.');
    }
  };

  // Quick Demo Account Clicker
  const quickLogin = async (username, password) => {
    setFormData({ ...formData, username, password });
    setLoading(true);
    const res = await authService.login(username, password);
    setLoading(false);
    if (res.success) {
      onAuthSuccess(res.user);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-100 animate-fadeIn">
        {/* Header Marun Mockup Style (SDD Page 83) */}
        <div className="bg-[#881337] p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-rose-200 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* User Avatar Circle */}
          <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/20 mx-auto flex items-center justify-center mb-2 shadow-inner">
            <User className="w-9 h-9 text-rose-100" />
          </div>

          <h3 className="text-xl font-bold font-['Space_Grotesk']">Pabrik Kerupuk Diansyah</h3>
          <p className="text-xs text-rose-200 mt-0.5">Sistem Autentikasi Pengguna & Karyawan</p>

          {/* Tab Switcher */}
          <div className="mt-4 flex bg-black/20 p-1 rounded-xl">
            <button
              onClick={() => { setTab('login'); setErrorMsg(''); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                tab === 'login' ? 'bg-white text-[#881337] shadow' : 'text-rose-100 hover:text-white'
              }`}
            >
              Masuk (Login)
            </button>
            <button
              onClick={() => { setTab('register'); setErrorMsg(''); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                tab === 'register' ? 'bg-white text-[#881337] shadow' : 'text-rose-100 hover:text-white'
              }`}
            >
              Daftar Akun
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <span className="font-bold">Error:</span> {errorMsg}
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-rose-800" />
                  <span>Username</span>
                </label>
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Masukkan username"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-rose-800" />
                  <span>Password</span>
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Masukkan kata sandi"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-700"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#881337] hover:bg-[#700f2d] text-white rounded-xl text-xs font-bold transition shadow-md hover:shadow-lg flex items-center justify-center space-x-1 mt-2"
              >
                <span>{loading ? 'Memproses...' : 'Masuk ke Sistem'}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              {/* Quick Demo Logins as per SDD actors */}
              <div className="pt-4 border-t border-stone-100">
                <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2 text-center">
                  Login Cepat Akun Demo (Sesuai SDD)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => quickLogin('owner', 'owner123')}
                    className="p-2 text-left rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs transition"
                  >
                    <div className="font-bold">👑 Owner</div>
                    <div className="text-[10px] text-purple-700">user: owner / owner123</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => quickLogin('penggoreng', 'goreng123')}
                    className="p-2 text-left rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs transition"
                  >
                    <div className="font-bold">🔥 Staf Penggoreng</div>
                    <div className="text-[10px] text-amber-700">user: penggoreng</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => quickLogin('pembungkus', 'bungkus123')}
                    className="p-2 text-left rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs transition"
                  >
                    <div className="font-bold">📦 Staf Pembungkus</div>
                    <div className="text-[10px] text-emerald-700">user: pembungkus</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => quickLogin('pelanggan', 'user123')}
                    className="p-2 text-left rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-900 text-xs transition"
                  >
                    <div className="font-bold">🛒 Pelanggan</div>
                    <div className="text-[10px] text-rose-700">user: pelanggan</div>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Registration Form matching SDD Page 84-85 */
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  name="nama"
                  required
                  value={formData.nama}
                  onChange={handleInputChange}
                  placeholder="Nama lengkap Anda"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-rose-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Username"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-rose-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Kata sandi"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-rose-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="nama@email.com"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-rose-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">No. Telepon / WA</label>
                  <input
                    type="tel"
                    name="no_telp"
                    required
                    value={formData.no_telp}
                    onChange={handleInputChange}
                    placeholder="0812xxxxxxx"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-rose-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Jenis Kelamin</label>
                <div className="flex space-x-4 text-xs text-stone-700">
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="jenis_kelamin"
                      value="Laki-laki"
                      checked={formData.jenis_kelamin === 'Laki-laki'}
                      onChange={handleInputChange}
                      className="text-rose-700 focus:ring-rose-700"
                    />
                    <span>Laki-laki</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="jenis_kelamin"
                      value="Perempuan"
                      checked={formData.jenis_kelamin === 'Perempuan'}
                      onChange={handleInputChange}
                      className="text-rose-700 focus:ring-rose-700"
                    />
                    <span>Perempuan</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Alamat</label>
                <input
                  type="text"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  placeholder="Alamat tempat tinggal"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-rose-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Jabatan / Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-rose-700 bg-white"
                >
                  <option value="owner">Owner (Pemilik Pabrik)</option>
                  <option value="staff_penggoreng">Staf Penggoreng</option>
                  <option value="staff_pembungkus">Staf Pembungkus</option>
                  <option value="pelanggan">Pelanggan</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#881337] hover:bg-[#700f2d] text-white rounded-xl text-xs font-bold transition shadow mt-3"
              >
                {loading ? 'Menyimpan...' : 'Selesai & Daftarkan'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
