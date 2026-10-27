-- ====================================================================
-- SISTEM INFORMASI PEMESANAN DAN PRODUKSI PABRIK KERUPUK DIANSYAH
-- Skrip Pembersihan Total & Pembuatan Database Baru (Supabase PostgreSQL)
-- Sesuai SDD & SRS Kelompok 3
-- ====================================================================

-- --------------------------------------------------------------------
-- BAGIAN 1: PEMBERSIHAN TOTAL (HAPUS SEMUA TABEL LAMA DENGAN CASCADE)
-- --------------------------------------------------------------------
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;

-- --------------------------------------------------------------------
-- BAGIAN 2: PEMBUATAN TABEL BARU DENGAN STRUKTUR 100% KONSISTEN
-- (Semua tabel menggunakan primary key: id UUID PRIMARY KEY)
-- --------------------------------------------------------------------

-- 1. TABEL: USERS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    nama VARCHAR(100) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('owner', 'staff_penggoreng', 'staff_pembungkus', 'pelanggan')),
    email VARCHAR(100),
    no_telp VARCHAR(20),
    jenis_kelamin VARCHAR(20) DEFAULT 'Laki-laki',
    alamat TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL: PELANGGAN
CREATE TABLE pelanggan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_user UUID REFERENCES users(id) ON DELETE SET NULL,
    nama_pelanggan VARCHAR(100) NOT NULL,
    no_telp VARCHAR(20) NOT NULL,
    alamat TEXT,
    email VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL: PRODUK (KATALOG KERUPUK)
CREATE TABLE produk (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_produk VARCHAR(100) NOT NULL,
    kategori VARCHAR(50) DEFAULT 'Kerupuk',
    harga DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    satuan VARCHAR(20) DEFAULT 'Bal',
    stok INT NOT NULL DEFAULT 0,
    min_stok INT DEFAULT 5,
    deskripsi TEXT,
    gambar_url TEXT,
    is_best_seller BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL: PESANAN
CREATE TABLE pesanan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nomor_pesanan VARCHAR(50) UNIQUE NOT NULL,
    id_pelanggan UUID REFERENCES pelanggan(id) ON DELETE CASCADE,
    id_produk UUID REFERENCES produk(id) ON DELETE SET NULL,
    varian_rasa VARCHAR(50) DEFAULT 'Original',
    kemasan_plastik VARCHAR(50) DEFAULT 'Plastik 1/2 kg',
    label_merek VARCHAR(50) DEFAULT 'Diansyah',
    jumlah INT NOT NULL DEFAULT 1,
    harga_satuan DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    total_harga DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    status_pesanan VARCHAR(30) NOT NULL DEFAULT 'menunggu_diproses' CHECK (
        status_pesanan IN (
            'menunggu_konfirmasi',
            'menunggu_diproses',
            'sedang_digoreng',
            'siap_diverifikasi',
            'sedang_dibungkus',
            'selesai',
            'dibatalkan'
        )
    ),
    estimasi_selesai VARCHAR(50) DEFAULT '3 - 5 Hari',
    catatan TEXT,
    tanggal_pesanan TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABEL: DETAIL_PESANAN
CREATE TABLE detail_pesanan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_pesanan UUID REFERENCES pesanan(id) ON DELETE CASCADE,
    id_produk UUID REFERENCES produk(id) ON DELETE SET NULL,
    nama_produk VARCHAR(100) NOT NULL,
    varian_rasa VARCHAR(50),
    kemasan_plastik VARCHAR(50),
    jumlah INT NOT NULL DEFAULT 1,
    harga_satuan DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABEL: PRODUKSI (PENGGORENGAN & JADWAL)
CREATE TABLE produksi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_pesanan UUID REFERENCES pesanan(id) ON DELETE CASCADE,
    id_produk UUID REFERENCES produk(id) ON DELETE SET NULL,
    tanggal_mulai TIMESTAMPTZ DEFAULT NOW(),
    tanggal_selesai TIMESTAMPTZ,
    status_produksi VARCHAR(30) DEFAULT 'menunggu' CHECK (
        status_produksi IN ('menunggu', 'diproses', 'selesai')
    ),
    jumlah_hasil INT DEFAULT 0,
    catatan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABEL: VERIFIKASI_PRODUKSI (QUALITY CONTROL STAF PEMBUNGKUS)
CREATE TABLE verifikasi_produksi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_produksi UUID REFERENCES produksi(id) ON DELETE CASCADE,
    id_user UUID REFERENCES users(id) ON DELETE SET NULL,
    status_verifikasi BOOLEAN DEFAULT FALSE,
    catatan_kualitas TEXT,
    tanggal_verifikasi TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABEL: STOK_BAHAN (LOGISTIK & INVENTARIS BAHAN BAKU)
CREATE TABLE stok_bahan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_user UUID REFERENCES users(id) ON DELETE SET NULL,
    nama_bahan VARCHAR(100) NOT NULL,
    kategori VARCHAR(50) NOT NULL CHECK (
        kategori IN ('kerupuk_mentah', 'bumbu', 'plastik', 'kayu_bambu', 'lainnya')
    ),
    jumlah_stok INT NOT NULL DEFAULT 0,
    satuan VARCHAR(20) NOT NULL DEFAULT 'Kg',
    batas_minimum INT DEFAULT 10,
    harga_beli DECIMAL(12,2) DEFAULT 0.00,
    gambar_url TEXT,
    tanggal_update TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TABEL: PEMBAYARAN (TRANSAKSI KAS & DIGITAL)
CREATE TABLE pembayaran (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_pesanan UUID REFERENCES pesanan(id) ON DELETE CASCADE,
    id_pelanggan UUID REFERENCES pelanggan(id) ON DELETE SET NULL,
    metode_pembayaran VARCHAR(30) NOT NULL CHECK (
        metode_pembayaran IN ('tunai', 'qris', 'dana', 'bca', 'mandiri', 'bni')
    ),
    status_pembayaran VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (
        status_pembayaran IN ('pending', 'lunas', 'gagal')
    ),
    jumlah_bayar DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    uang_diterima DECIMAL(12,2) DEFAULT 0.00,
    kembalian DECIMAL(12,2) DEFAULT 0.00,
    nomor_referensi VARCHAR(50),
    bukti_transfer TEXT,
    tanggal_pembayaran TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TABEL: LAPORAN (ARSIP PDF/EXCEL)
CREATE TABLE laporan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_user UUID REFERENCES users(id) ON DELETE SET NULL,
    jenis_laporan VARCHAR(50) NOT NULL,
    periode VARCHAR(50) NOT NULL,
    total_penjualan INT DEFAULT 0,
    total_pendapatan DECIMAL(14,2) DEFAULT 0.00,
    total_keuntungan DECIMAL(14,2) DEFAULT 0.00,
    format VARCHAR(10) DEFAULT 'PDF',
    file_url TEXT,
    tanggal_generate TIMESTAMPTZ DEFAULT NOW()
);

-- 11. TABEL: LOG_AKTIVITAS (AUDIT TRAIL OPERASIONAL)
CREATE TABLE log_aktivitas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_user UUID REFERENCES users(id) ON DELETE SET NULL,
    nama_user VARCHAR(100),
    role VARCHAR(50),
    aktivitas VARCHAR(150) NOT NULL,
    keterangan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- BAGIAN 3: ROW LEVEL SECURITY (RLS) - IZINKAN AKSES BACA & TULIS
-- --------------------------------------------------------------------
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pelanggan ENABLE ROW LEVEL SECURITY;
ALTER TABLE produk ENABLE ROW LEVEL SECURITY;
ALTER TABLE pesanan ENABLE ROW LEVEL SECURITY;
ALTER TABLE detail_pesanan ENABLE ROW LEVEL SECURITY;
ALTER TABLE produksi ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifikasi_produksi ENABLE ROW LEVEL SECURITY;
ALTER TABLE stok_bahan ENABLE ROW LEVEL SECURITY;
ALTER TABLE pembayaran ENABLE ROW LEVEL SECURITY;
ALTER TABLE laporan ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_aktivitas ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' 
    AND tablename IN ('users', 'pelanggan', 'produk', 'pesanan', 'detail_pesanan', 'produksi', 'verifikasi_produksi', 'stok_bahan', 'pembayaran', 'laporan', 'log_aktivitas')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Public access policy for %I" ON %I;', tbl, tbl);
        EXECUTE format('CREATE POLICY "Public access policy for %I" ON %I FOR ALL USING (true) WITH CHECK (true);', tbl, tbl);
    END LOOP;
END $$;

-- --------------------------------------------------------------------
-- BAGIAN 4: DATA AWAL (SEEDING PABRIK KERUPUK DIANSYAH)
-- --------------------------------------------------------------------

-- 1. Pengguna Awal
INSERT INTO users (id, username, password, nama, role, email, no_telp, jenis_kelamin, alamat)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'owner', 'owner123', 'Budiman (Owner)', 'owner', 'budiman123@gmail.com', '081234567890', 'Laki-laki', 'Jl. Pangeran Kornel No. 204, Pasanggrahan Baru, Sumedang'),
    ('22222222-2222-2222-2222-222222222222', 'penggoreng', 'goreng123', 'Kang Asep (Staf Penggoreng)', 'staff_penggoreng', 'asep.goreng@gmail.com', '081234567891', 'Laki-laki', 'Pabrik Kerupuk Diansyah - Area Penggorengan'),
    ('33333333-3333-3333-3333-333333333333', 'pembungkus', 'bungkus123', 'Teh Siti (Staf Pembungkus)', 'staff_pembungkus', 'siti.bungkus@gmail.com', '081234567892', 'Perempuan', 'Pabrik Kerupuk Diansyah - Area Packaging'),
    ('44444444-4444-4444-4444-444444444444', 'pelanggan', 'user123', 'Nayla Putri Romdoni', 'pelanggan', 'nayla.romdoni@gmail.com', '085786900230', 'Perempuan', 'Jl. Melati No. 45, Cimahi');

-- 2. Data Profil Pelanggan
INSERT INTO pelanggan (id, id_user, nama_pelanggan, no_telp, alamat, email)
VALUES
    ('55555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444', 'Nayla Putri Romdoni', '085786900230', 'Jl. Melati No. 45, Cimahi', 'nayla.romdoni@gmail.com');

-- 3. Katalog Produk Kerupuk
INSERT INTO produk (id, nama_produk, kategori, harga, satuan, stok, min_stok, deskripsi, gambar_url, is_best_seller)
VALUES
    ('a1111111-1111-1111-1111-111111111111', 'Kerupuk Makaroni', 'Kerupuk', 160000.00, 'Bal', 15, 3, 'Kerupuk makaroni gurih renyah dengan tekstur khas Diansyah, sangat cocok untuk camilan maupun lauk makan.', 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&auto=format&fit=crop&q=80', TRUE),
    ('a2222222-2222-2222-2222-222222222222', 'Kerupuk Kentang', 'Kerupuk', 160000.00, 'Bal', 10, 3, 'Kerupuk kentang adalah camilan renyah yang terbuat dari kentang pilihan atau campuran tepung kentang berkualitas.', 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80', TRUE),
    ('a3333333-3333-3333-3333-333333333333', 'Kerupuk Bawang', 'Kerupuk', 160000.00, 'Bal', 8, 3, 'Kerupuk bawang aroma harum dengan kerenyahan maksimal yang digoreng dengan minyak kelapa higienis.', 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&auto=format&fit=crop&q=80', FALSE),
    ('a4444444-4444-4444-4444-444444444444', 'Kerupuk Jengkol', 'Kerupuk', 160000.00, 'Bal', 6, 2, 'Kerupuk jengkol cita rasa nusantara otentik, sedap dan renyah di setiap gigitan.', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80', FALSE),
    ('a5555555-5555-5555-5555-555555555555', 'Kerupuk Warna Warni', 'Kerupuk', 160000.00, 'Bal', 12, 4, 'Kerupuk warna-warni ceria yang selalu menjadi favorit keluarga, cocok untuk hajatan maupun warung makan.', 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80', FALSE);

-- 4. Stok Bahan Baku Awal
INSERT INTO stok_bahan (nama_bahan, kategori, jumlah_stok, satuan, batas_minimum, harga_beli, gambar_url)
VALUES
    ('Kerupuk Mentah Kentang', 'kerupuk_mentah', 50, 'Bal', 10, 110000.00, 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400'),
    ('Kerupuk Mentah Bawang', 'kerupuk_mentah', 40, 'Bal', 10, 105000.00, 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400'),
    ('Bumbu Balado Tabur', 'bumbu', 18, 'Kg', 5, 40000.00, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400'),
    ('Plastik Ukuran 1/2 kg', 'plastik', 8, 'Pcs', 3, 24000.00, 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=400');

-- 5. Contoh Transaksi Pesanan & Produksi
INSERT INTO pesanan (id, nomor_pesanan, id_pelanggan, id_produk, varian_rasa, kemasan_plastik, label_merek, jumlah, harga_satuan, total_harga, status_pesanan, estimasi_selesai, catatan)
VALUES
    ('b1111111-1111-1111-1111-111111111111', 'ORD-202610-001', '55555555-5555-5555-5555-555555555555', 'a1111111-1111-1111-1111-111111111111', 'Original', 'Plastik 1/2 kg', 'Diansyah', 2, 160000.00, 320000.00, 'sedang_digoreng', '3 - 5 Hari', 'Pesanan reguler langganan warung makan Bu Titin.'),
    ('b2222222-2222-2222-2222-222222222222', 'ORD-202610-002', '55555555-5555-5555-5555-555555555555', 'a2222222-2222-2222-2222-222222222222', 'Pedas Daun Jeruk', 'Plastik 1/2 kg', 'Diansyah', 1, 160000.00, 160000.00, 'siap_diverifikasi', '2 Hari', 'Mohon bumbu pedas daun jeruk ekstra melimpah.');

INSERT INTO detail_pesanan (id_pesanan, id_produk, nama_produk, varian_rasa, kemasan_plastik, jumlah, harga_satuan, subtotal)
VALUES
    ('b1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Kerupuk Makaroni', 'Original', 'Plastik 1/2 kg', 2, 160000.00, 320000.00),
    ('b2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 'Kerupuk Kentang', 'Pedas Daun Jeruk', 'Plastik 1/2 kg', 1, 160000.00, 160000.00);

INSERT INTO produksi (id, id_pesanan, id_produk, status_produksi, jumlah_hasil, catatan)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'diproses', 0, 'Sedang tahap penggorengan pertama'),
    ('c2222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 'selesai', 1, 'Penggorengan selesai, menunggu verifikasi QC Staf Pembungkus');

INSERT INTO verifikasi_produksi (id_produksi, id_user, status_verifikasi, catatan_kualitas)
VALUES
    ('c2222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', TRUE, 'Kerenyahan sempurna, warna kuning keemasan merata.');

INSERT INTO pembayaran (id_pesanan, id_pelanggan, metode_pembayaran, status_pembayaran, jumlah_bayar, uang_diterima, kembalian, nomor_referensi)
VALUES
    ('b1111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 'qris', 'lunas', 320000.00, 320000.00, 0.00, 'QRIS-202610-0982'),
    ('b2222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', 'tunai', 'pending', 160000.00, 0.00, 0.00, 'CASH-OUTLET-001');

INSERT INTO log_aktivitas (id_user, nama_user, role, aktivitas, keterangan)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Budiman (Owner)', 'owner', 'Inisialisasi Sistem', 'Database pabrik kerupuk diansyah berhasil di-setup dan aktif.');
