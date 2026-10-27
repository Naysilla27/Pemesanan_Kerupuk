# Sistem Informasi Pemesanan dan Produksi Pabrik Kerupuk Diansyah 🥟

Implementasi lengkap **Sistem Informasi Pemesanan dan Produksi Pabrik Kerupuk Diansyah** berbasis Web responsif dan terintegrasi dengan **Supabase PostgreSQL**, dibangun mengacu pada dokumen resmi **Software Design Document (SDD)** dan **Software Requirements Specification (SRS)** Kelompok 3 (Nayla Putri Romdoni, Anita Nurhayati, Meila Fitri).

---

## 🚀 Fitur Utama & Aktor Sistem

Sistem mendukung 4 hak akses peran utama sesuai rancangan sistem:

### 1. 🛒 Pelanggan (Customer)
- **Akses Tanpa Wajib Login**: Pengguna dapat langsung memilih produk dari katalog.
- **Beranda & Produk Unggulan**: Banner *Penjualan Terbaik* (*Kerupuk Makaroni* & *Kerupuk Kentang*), pencarian produk cepat, dan filter kategori.
- **Kustomisasi Pemesanan**:
  - Stepper kuantitas (+ / -) dalam satuan **Bal**.
  - Pilihan Varian Rasa: *Original*, *Balado (+Rp 40.000)*, *Pedas (+Rp 50.000)*, *Keju (+Rp 30.000)*.
  - Pilihan Kemasan Plastik: *Plastik 1/2 kg*, *Plastik 11x25 kg*, *Plastik 30x45 kg*.
  - Label Merek: *Diansyah*.
- **Keranjang Belanja**: Pemilihan item dengan checkbox, kalkulasi subtotal otomatis, dan diskon.
- **Formulir Data Pemesan**: Pengisian Nama Lengkap, Nomor WhatsApp, dan Alamat Pengiriman.
- **Metode Pembayaran Ganda**:
  - **Tunai (Cash)**: Instruksi serah uang tunai saat pengambilan di pabrik.
  - **QRIS**: Tampilan QR code dinamis, tombol unduh QR, dan countdown timer transaksi.
  - **DANA E-Wallet**: Nomor tujuan dengan tombol salin (copy) dan panduan bayar.
  - **Transfer Bank (BCA, Mandiri, BNI)**: Salin nomor rekening 1-klik dan panduan ATM/M-Banking.
- **Bukti Pembayaran & Kuitansi (Struk)**:
  - Tampilan struk thermal resmi Diansyah.
  - Cetak struk langsung ke printer kasir / thermal (`window.print()`).
  - Ekspor kuitansi digital ke format **PDF**.
- **Pelacakan Status Pesanan Real-Time**:
  - Progres: `Menunggu Diproses` ➜ `Sedang Digoreng` ➜ `Siap Diverifikasi` ➜ `Sedang Dibungkus` ➜ `Selesai / Siap Diambil`.
  - Pembatalan pesanan sebelum masuk penggorengan (sesuai skenario Use Case UC-06).

---

### 2. 🔥 Staf Penggoreng (Frying Production Staff)
- **Antrean Produksi**: Menerima pesanan baru yang masuk.
- **Mulai Penggorengan**: Mengubah status menjadi `sedang_digoreng` dan **otomatis memotong stok bahan baku** (kerupuk mentah & bumbu tabur) dari gudang.
- **Selesai Penggorengan**: Memperbarui status menjadi `siap_diverifikasi` untuk dikirim ke bagian Quality Control (pembungkus).
- **Kelola Stok Bahan Baku**:
  - Kategori: *Semua*, *Kerupuk Mentah*, *Plastik Kemasan*, *Bumbu Tabur*, *Bambu / Kayu Jemuran*.
  - Peringatan dini jika stok di bawah batas minimum (*Low Stock Alert*).
  - Modal input stok masuk cepat (pencatatan barang datang dari supplier).
  - Form tambah jenis bahan baku baru.

---

### 3. 📦 Staf Pembungkus (Packaging & QC Staff)
- **Verifikasi Hasil Produksi (QC)**:
  - Memeriksa kerenyahan, kematangan warna, aroma, takaran timbangan, dan higienitas.
  - Lolos verifikasi ➜ status berubah menjadi `sedang_dibungkus`.
  - Tolak verifikasi jika cacat ➜ dikembalikan ke bagian penggorengan dengan catatan revisi.
- **Proses Pengemasan**:
  - Memasukkan kerupuk ke kemasan plastik dan menempelkan stiker merek Diansyah.
  - Selesai kemas ➜ status pesanan menjadi `selesai` (siap diambil) dan **otomatis memotong stok plastik & label**.
- **Kasir Pelunasan Outlet**:
  - Memproses pembayaran tunai dari pelanggan yang datang ke pabrik.
  - Menghitung kembalian uang otomatis dan mencetak bukti pembayaran.

---

### 4. 👑 Owner (Pemilik Pabrik)
- **Dashboard Laporan Harian**:
  - Metrik: Total Penjualan Hari Ini, Jumlah Transaksi, Total Pendapatan, Estimasi Keuntungan Bersih (margin ~35%), dan Indikator Bahan Menipis.
  - Grafik tren penjualan mingguan & grafik varian rasa terlaris.
  - Tabel transaksi terkini.
- **Kelola & Ekspor Laporan**:
  - Tab: *Laporan Penjualan*, *Laporan Transaksi*, dan *Laporan Stok Bahan Baku*.
  - Filter: *Hari Ini*, *Bulan Ini*, *Tahun Ini*, atau rentang tanggal *Khusus*.
  - Ekspor data ke format **Excel (.xlsx)** menggunakan sheet data terstruktur.
  - Ekspor data ke format **PDF resmi**.
- **Katalog Master Produk (CRUD)**:
  - Tambah varian kerupuk baru, atur harga satuan per bal, dan update stok siap jual.
- **Audit Trail (Log Aktivitas)**:
  - Rekam jejak seluruh proses login, order, update produksi, dan keuangan.

---

## 🛠️ Arsitektur Teknologi

- **Frontend**: React 19 + Vite + Tailwind CSS v4
- **Komponen & Ikon**: Lucide React + Canvas Confetti
- **Ekspor Dokumen**: `jspdf`, `jspdf-autotable`, `xlsx`
- **Database**: Supabase PostgreSQL (dengan skema relasi foreign key, indeks, enum, dan RLS)
- **Offline / Local Demo Engine**: Otomatis aktif jika kredensial Supabase belum diisi, sehingga aplikasi dapat diuji coba 100% langsung tanpa hambatan.

---

## 💾 Menghubungkan ke Supabase Anda

File skema SQL telah disiapkan di root repository: `supabase_schema.sql`.

1. Buka dashboard proyek Supabase Anda: [supabase.com](https://supabase.com).
2. Masuk ke menu **SQL Editor** di panel kiri.
3. Buka file `supabase_schema.sql` (bisa diunduh juga lewat tombol **Supabase** di header aplikasi).
4. Salin seluruh isi SQL ke SQL Editor, lalu klik **Run**.
5. Salin **Project URL** dan **Anon Key** dari menu *Project Settings > API*.
6. Pada aplikasi web Diansyah, klik tombol **"Mode Demo / Supabase"** di pojok kanan atas, tempelkan URL dan Key Anda, lalu klik **"Simpan & Terapkan"**.
7. Aplikasi sekarang terhubung langsung ke database Supabase Anda!

---

## 📱 Cara Menjalankan Aplikasi Secara Lokal

```bash
# 1. Install dependensi
npm install

# 2. Jalankan development server
npm run dev
```

Buka peramban di: **`http://localhost:5173`**

Tersedia tombol toggle **"Frame HP"** di header untuk melihat aplikasi persis dalam bingkai smartphone seperti mockup Bab V SDD!
