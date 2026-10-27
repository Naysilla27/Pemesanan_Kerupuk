import React, { useState, useEffect } from 'react';
import {
  Database,
  Key,
  Globe,
  CheckCircle2,
  AlertCircle,
  Copy,
  Download,
  RefreshCw,
  X,
  Sparkles,
  Server,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  getStoredCredentials,
  saveCredentials,
  isConfigured,
  checkSupabaseHealth,
  seedSupabaseDatabase
} from '../supabase';

export default function SupabaseModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const currentCreds = getStoredCredentials();
  const [url, setUrl] = useState(currentCreds.url);
  const [key, setKey] = useState(currentCreds.key);
  const [healthStatus, setHealthStatus] = useState(null);
  const [testing, setTesting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    if (isConfigured) {
      handleCheckHealth();
    }
  }, []);

  const handleCheckHealth = async () => {
    setTesting(true);
    const health = await checkSupabaseHealth();
    setHealthStatus(health);
    setTesting(false);
  };

  const handleSave = () => {
    saveCredentials(url, key);
  };

  const handleResetToDemo = () => {
    saveCredentials('', '');
  };

  const handleRunSeed = async () => {
    setSeeding(true);
    setSeedMsg('');
    const res = await seedSupabaseDatabase();
    setSeeding(false);
    setSeedMsg(res.message);
    if (res.success) {
      handleCheckHealth();
    }
  };

  const handleCopySql = () => {
    fetch('/supabase_schema.sql')
      .then((res) => res.text())
      .then((text) => {
        navigator.clipboard.writeText(text);
        setCopiedSql(true);
        setTimeout(() => setCopiedSql(false), 2500);
      })
      .catch(() => {
        setCopiedSql(true);
        setTimeout(() => setCopiedSql(false), 2500);
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 overflow-hidden relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center shadow-xs">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-stone-900 text-base font-['Space_Grotesk']">
                  Integrasi Supabase Database
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  PostgreSQL
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Pabrik Kerupuk Diansyah Production & POS Database
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Status Card */}
        <div
          className={`mt-4 p-4 rounded-2xl flex items-start space-x-3 text-xs transition border ${
            isConfigured
              ? 'bg-emerald-50/80 text-emerald-900 border-emerald-200'
              : 'bg-amber-50/80 text-amber-900 border-amber-200'
          }`}
        >
          {isConfigured ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <div className="font-bold text-sm">
              {isConfigured ? 'Status: Terhubung ke Supabase Live' : 'Status: Mode Demo Lokal Aktif'}
            </div>
            <p className="mt-1 opacity-90 leading-relaxed text-[11px]">
              {isConfigured
                ? 'Semua transaksi, pesanan, dan stok tersinkronisasi secara real-time dengan database Supabase PostgreSQL Anda.'
                : 'Aplikasi berjalan lancar dengan data lokal browser. Anda dapat langsung menguji coba seluruh alur pemesanan & produksi sekarang!'}
            </p>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="mt-5 space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-stone-400" />
                Project URL (Supabase API URL)
              </span>
              <span className="text-[10px] text-stone-400 font-normal">Dari menu Project Settings &gt; API</span>
            </label>
            <input
              type="text"
              placeholder="https://your-project.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-700 font-mono transition bg-stone-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-stone-400" />
                Anon Public Key (API Key)
              </span>
              <span className="text-[10px] text-stone-400 font-normal">Anon / Public client key</span>
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-700 font-mono transition bg-stone-50/50"
            />
          </div>
        </div>

        {/* Database Table Health Status Checker */}
        {isConfigured && healthStatus && (
          <div className="mt-4 p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-stone-800 flex items-center gap-1.5">
                <Server className="w-4 h-4 text-emerald-700" />
                Status Tabel PostgreSQL:
              </span>
              <button
                onClick={handleCheckHealth}
                disabled={testing}
                className="text-[11px] text-rose-700 hover:text-rose-900 font-bold flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${testing ? 'animate-spin' : ''}`} />
                <span>Cek Ulang</span>
              </button>
            </div>

            {healthStatus.tables && (
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {Object.entries(healthStatus.tables).map(([tbl, info]) => (
                  <div
                    key={tbl}
                    className={`p-2 rounded-xl flex items-center justify-between border ${
                      info.ok ? 'bg-white border-stone-200' : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}
                  >
                    <span className="font-semibold text-stone-800">{tbl}</span>
                    {info.ok ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md font-bold">
                        {info.count} baris
                      </span>
                    ) : (
                      <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded-md font-bold">
                        Belum ada
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 1-Click Seeder Button */}
            <div className="mt-3 pt-2 border-t border-stone-200 flex flex-col gap-1.5">
              <button
                onClick={handleRunSeed}
                disabled={seeding}
                className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{seeding ? 'Mengisi Data ke Supabase...' : 'Isi Data Awal Otomatis ke Supabase (1-Klik)'}</span>
              </button>
              {seedMsg && <p className="text-[11px] text-emerald-700 font-medium text-center">{seedMsg}</p>}
            </div>
          </div>
        )}

        {/* SQL Schema helper box */}
        <div className="mt-4 p-4 bg-stone-50 rounded-2xl border border-stone-200">
          <div className="flex items-center justify-between text-xs font-bold text-stone-800 mb-1">
            <span>Skema SQL Database (supabase_schema.sql)</span>
            <span className="text-[10px] text-stone-400 font-normal">Sudah tergenerate</span>
          </div>
          <p className="text-[11px] text-stone-500 mb-3 leading-relaxed">
            Jika baru membuat database di Supabase, jalankan skema SQL untuk membuat tabel, tipe enum, indeks, dan aturan RLS secara otomatis:
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopySql}
              className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 transition shadow-xs"
            >
              <Copy className="w-3.5 h-3.5 text-stone-500" />
              <span>{copiedSql ? 'Tersalin ke Clipboard!' : 'Salin Kode SQL'}</span>
            </button>
            <a
              href="/supabase_schema.sql"
              download
              className="flex items-center space-x-1.5 py-2 px-3 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 transition shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              <span>Unduh .SQL</span>
            </a>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-stone-100">
          <button
            onClick={handleResetToDemo}
            className="text-xs text-stone-400 hover:text-stone-700 font-medium underline"
          >
            Reset ke Demo Lokal
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition"
            >
              Tutup
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-gradient-to-r from-[#881337] to-[#700f2d] hover:from-[#700f2d] hover:to-[#550b22] text-white rounded-xl text-xs font-extrabold transition shadow-md hover:shadow-lg"
            >
              Simpan & Hubungkan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
