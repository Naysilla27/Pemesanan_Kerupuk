import React from 'react';
import { Printer, Download, CheckCircle2, ArrowLeft } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function PrintReceipt({ order, onClose }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      unit: 'mm',
      format: [80, 160] // standard POS thermal 80mm
    });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('PABRIK KERUPUK DIANSYAH', 40, 10, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Sentra Produksi Aneka Kerupuk Khas Sumedang', 40, 14, { align: 'center' });
    doc.text('Jl. Pangeran Kornel No. 204, Pasanggrahan Baru', 40, 17, { align: 'center' });
    doc.text('Telp/WA: 0812-3456-7890', 40, 20, { align: 'center' });
    doc.text('------------------------------------------------------------', 40, 23, { align: 'center' });

    doc.setFontSize(8);
    doc.text(`No Pesanan : ${order.nomor_pesanan}`, 6, 28);
    doc.text(`Ref Bukti   : ${order.nomor_referensi || 'B001480'}`, 6, 32);
    doc.text(`Tanggal      : ${new Date(order.tanggal_pesanan).toLocaleDateString('id-ID')}`, 6, 36);
    doc.text(`Pelanggan : ${order.nama_pelanggan}`, 6, 40);
    doc.text(`No Telp     : ${order.no_telp || '-'}`, 6, 44);
    doc.text('------------------------------------------------------------', 40, 48, { align: 'center' });

    // Item
    doc.setFont('helvetica', 'bold');
    doc.text(`${order.nama_produk}`, 6, 53);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text(`Varian: ${order.varian_rasa || 'Original'} | ${order.kemasan_plastik || '1/2 kg'}`, 6, 57);
    doc.text(`${order.jumlah} Bal x Rp ${(order.harga_satuan || 160000).toLocaleString('id-ID')}`, 6, 61);
    doc.setFont('helvetica', 'bold');
    doc.text(`Rp ${(order.total_harga || 0).toLocaleString('id-ID')}`, 74, 61, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.text('------------------------------------------------------------', 40, 66, { align: 'center' });

    doc.setFontSize(8);
    doc.text('Subtotal:', 6, 71);
    doc.text(`Rp ${(order.total_harga || 0).toLocaleString('id-ID')}`, 74, 71, { align: 'right' });

    doc.text('Diskon:', 6, 75);
    doc.text('Rp 0', 74, 75, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('TOTAL BAYAR:', 6, 81);
    doc.text(`Rp ${(order.total_harga || 0).toLocaleString('id-ID')}`, 74, 81, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Metode: ${(order.metode_pembayaran || 'Tunai').toUpperCase()}`, 6, 86);
    doc.text('Status: LUNAS', 6, 90);

    if (order.uang_diterima) {
      doc.text(`Diterima : Rp ${Number(order.uang_diterima).toLocaleString('id-ID')}`, 6, 94);
      doc.text(`Kembalian: Rp ${Number(order.kembalian || 0).toLocaleString('id-ID')}`, 6, 98);
    }

    doc.text('------------------------------------------------------------', 40, 103, { align: 'center' });
    doc.setFontSize(7);
    doc.text('Terima kasih atas pesanan Anda!', 40, 108, { align: 'center' });
    doc.text('Kerupuk Renyah, Gurih, Higienis Diansyah', 40, 112, { align: 'center' });

    doc.save(`Struk_Diansyah_${order.nomor_pesanan}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200">
        {/* Actions bar (hidden during print) */}
        <div className="no-print flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
          <button
            onClick={onClose}
            className="flex items-center space-x-1 text-xs text-stone-600 hover:text-stone-900 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
              title="Unduh PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#881337] hover:bg-[#700f2d] text-white text-xs font-bold shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Struk</span>
            </button>
          </div>
        </div>

        {/* Printable Struk / Thermal Receipt */}
        <div
          id="printable-receipt"
          className="bg-stone-50 p-4 rounded-xl border border-dashed border-stone-300 font-mono text-xs text-stone-800"
        >
          {/* Header */}
          <div className="text-center pb-2 border-b border-stone-300">
            <h4 className="font-extrabold text-sm text-stone-900">PABRIK KERUPUK DIANSYAH</h4>
            <p className="text-[10px] text-stone-500">Sentra Kerupuk Berkualitas Khas Sumedang</p>
            <p className="text-[10px] text-stone-500">Jl. Pangeran Kornel No. 204, Sumedang</p>
            <p className="text-[10px] text-stone-500">WA: 0812-3456-7890</p>
          </div>

          {/* Meta Info */}
          <div className="py-2.5 border-b border-stone-300 text-[11px] space-y-1">
            <div className="flex justify-between">
              <span className="text-stone-500">No. Pesanan:</span>
              <span className="font-bold">{order.nomor_pesanan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">ID Bukti Bayar:</span>
              <span className="font-bold text-rose-700">{order.nomor_referensi || 'B001480'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Waktu:</span>
              <span>{new Date(order.tanggal_pesanan).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Pelanggan:</span>
              <span className="font-medium truncate max-w-[140px]">{order.nama_pelanggan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">No. Telepon:</span>
              <span>{order.no_telp || '-'}</span>
            </div>
          </div>

          {/* Item List */}
          <div className="py-2.5 border-b border-stone-300 space-y-1.5">
            <div className="flex justify-between font-bold text-stone-900">
              <span>{order.nama_produk}</span>
              <span>Rp {(order.total_harga || 0).toLocaleString('id-ID')}</span>
            </div>
            <div className="text-[10px] text-stone-500">
              Rasa: {order.varian_rasa || 'Original'} • {order.kemasan_plastik || '1/2 kg'}
            </div>
            <div className="text-[10px] text-stone-600">
              {order.jumlah} Bal x Rp {(order.harga_satuan || 160000).toLocaleString('id-ID')}
            </div>
          </div>

          {/* Totals */}
          <div className="py-2.5 border-b border-stone-300 text-[11px] space-y-1">
            <div className="flex justify-between">
              <span className="text-stone-500">Subtotal</span>
              <span>Rp {(order.total_harga || 0).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>Diskon</span>
              <span>Rp 0</span>
            </div>
            <div className="flex justify-between text-xs font-black text-stone-900 pt-1 border-t border-stone-200">
              <span>TOTAL</span>
              <span>Rp {(order.total_harga || 0).toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="py-2 text-[11px] space-y-1">
            <div className="flex justify-between">
              <span className="text-stone-500">Metode:</span>
              <span className="font-bold uppercase">{order.metode_pembayaran || 'Tunai'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-500">Status:</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                LUNAS
              </span>
            </div>
            {order.uang_diterima > 0 && (
              <>
                <div className="flex justify-between">
                  <span className="text-stone-500">Uang Diterima:</span>
                  <span>Rp {Number(order.uang_diterima).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between font-semibold text-rose-800">
                  <span>Kembalian:</span>
                  <span>Rp {Number(order.kembalian || 0).toLocaleString('id-ID')}</span>
                </div>
              </>
            )}
          </div>

          {/* Footer note */}
          <div className="text-center pt-3 text-[10px] text-stone-500 border-t border-dashed border-stone-300">
            <p className="font-semibold text-stone-700">*** TERIMA KASIH ***</p>
            <p>Selamat menikmati kerenyahan Kerupuk Diansyah!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
