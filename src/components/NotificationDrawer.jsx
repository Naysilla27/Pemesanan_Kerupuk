import React from 'react';
import { Bell, CheckCircle2, Clock, Flame, Package, X } from 'lucide-react';

export default function NotificationDrawer({ isOpen, onClose, notifications = [] }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-sm w-full flex pl-10">
        <div className="w-full bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 bg-[#881337] text-white flex items-center justify-between shadow">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-white/10 rounded-lg">
                <Bell className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="font-bold text-base">Notifikasi Produksi</h3>
                <p className="text-xs text-rose-200">Update status pesanan & pabrik real-time</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-rose-200 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Notification List (Matching SDD Page 72) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-stone-400 text-xs">
                Belum ada notifikasi baru.
              </div>
            ) : (
              notifications.map((notif) => {
                const isReady = notif.status.toLowerCase().includes('siap diambil') || notif.status.toLowerCase().includes('selesai');
                const isPacking = notif.status.toLowerCase().includes('dibungkus') || notif.status.toLowerCase().includes('kemas');
                const isFrying = notif.status.toLowerCase().includes('digoreng');

                return (
                  <div
                    key={notif.id}
                    className="p-3.5 bg-white rounded-xl shadow-xs border border-stone-200/80 hover:border-rose-200 transition flex items-start space-x-3"
                  >
                    {/* Status Icon */}
                    <div className="mt-0.5">
                      {isReady && (
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                      {isPacking && (
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          <Package className="w-4 h-4" />
                        </div>
                      )}
                      {isFrying && (
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                          <Flame className="w-4 h-4" />
                        </div>
                      )}
                      {!isReady && !isPacking && !isFrying && (
                        <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center">
                          <Clock className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-bold text-sm text-stone-900 truncate">{notif.judul}</h4>
                        <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                          {notif.jumlah}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{notif.deskripsi}</p>
                      <div className="mt-2 flex items-center justify-between text-[11px]">
                        <span
                          className={`font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                            isReady
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isPacking
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : isFrying
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {notif.status}
                        </span>
                        <span className="text-stone-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {notif.waktu}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="p-3 border-t border-stone-200 bg-white text-center text-[11px] text-stone-500">
            Pabrik Kerupuk Diansyah Production Sync
          </div>
        </div>
      </div>
    </div>
  );
}
