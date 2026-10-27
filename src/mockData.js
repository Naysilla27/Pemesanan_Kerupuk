// ====================================================================
// DATA AWAL / SEED DATA - PABRIK KERUPUK DIANSYAH
// Sesuai dengan Software Design Document (SDD) Kelompok 3
// ====================================================================

export const INITIAL_USERS = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    username: 'owner',
    password: 'owner123',
    nama: 'Budiman (Owner)',
    role: 'owner',
    email: 'budiman123@gmail.com',
    no_telp: '081234567890',
    jenis_kelamin: 'Laki-laki',
    alamat: 'Jl. Pangeran Kornel No. 204, Pasanggrahan Baru, Kec. Sumedang Sel., Sumedang'
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    username: 'penggoreng',
    password: 'goreng123',
    nama: 'Kang Asep (Staf Penggoreng)',
    role: 'staff_penggoreng',
    email: 'asep.goreng@gmail.com',
    no_telp: '081234567891',
    jenis_kelamin: 'Laki-laki',
    alamat: 'Pabrik Kerupuk Diansyah - Ruang Penggorengan'
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    username: 'pembungkus',
    password: 'bungkus123',
    nama: 'Teh Siti (Staf Pembungkus)',
    role: 'staff_pembungkus',
    email: 'siti.bungkus@gmail.com',
    no_telp: '081234567892',
    jenis_kelamin: 'Perempuan',
    alamat: 'Pabrik Kerupuk Diansyah - Ruang Pengemasan'
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    username: 'pelanggan',
    password: 'user123',
    nama: 'Nayla Putri Romdoni',
    role: 'pelanggan',
    email: 'nayla.romdoni@gmail.com',
    no_telp: '085786900230',
    jenis_kelamin: 'Perempuan',
    alamat: 'Jl. Jenderal Sudirman No. 88, Cimahi'
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    nama_produk: 'Kerupuk Makaroni',
    kategori: 'Kerupuk',
    harga: 160000,
    satuan: 'Bal',
    stok: 15,
    min_stok: 3,
    terjual: 120,
    deskripsi: 'Kerupuk makaroni gurih renyah dengan kerenyahan maksimal. Menggunakan bumbu rempah istimewa Diansyah yang lezat di setiap gigitan.',
    gambar_url: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&auto=format&fit=crop&q=80',
    is_best_seller: true,
    tersedia_rasa: ['Original', 'Balado', 'Pedas', 'Keju']
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    nama_produk: 'Kerupuk Kentang',
    kategori: 'Kerupuk',
    harga: 160000,
    satuan: 'Bal',
    stok: 10,
    min_stok: 3,
    terjual: 90,
    deskripsi: 'Kerupuk kentang camilan renyah yang terbuat dari kentang pilihan atau campuran tepung kentang berkualitas. Sangat garing dan nikmat.',
    gambar_url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80',
    is_best_seller: true,
    tersedia_rasa: ['Original', 'Balado', 'Pedas', 'Keju']
  },
  {
    id: 'a3333333-3333-3333-3333-333333333333',
    nama_produk: 'Kerupuk Bawang',
    kategori: 'Kerupuk',
    harga: 160000,
    satuan: 'Bal',
    stok: 8,
    min_stok: 3,
    terjual: 75,
    deskripsi: 'Kerupuk bawang gurih wangi dengan aroma bawang putih yang sedap dan tekstur mekar sempurna.',
    gambar_url: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&auto=format&fit=crop&q=80',
    is_best_seller: false,
    tersedia_rasa: ['Original', 'Balado', 'Pedas']
  },
  {
    id: 'a4444444-4444-4444-4444-444444444444',
    nama_produk: 'Kerupuk Jengkol',
    kategori: 'Kerupuk',
    harga: 160000,
    satuan: 'Bal',
    stok: 6,
    min_stok: 2,
    terjual: 64,
    deskripsi: 'Kerupuk jengkol aroma khas tradisonal yang nagih, gurih mantap dan digoreng dengan minyak kelapa pilihan.',
    gambar_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80',
    is_best_seller: false,
    tersedia_rasa: ['Original', 'Pedas']
  },
  {
    id: 'a5555555-5555-5555-5555-555555555555',
    nama_produk: 'Kerupuk Warna Warni',
    kategori: 'Kerupuk',
    harga: 160000,
    satuan: 'Bal',
    stok: 12,
    min_stok: 4,
    terjual: 88,
    deskripsi: 'Kerupuk warna-warni ceria yang mekar garing. Sangat diminati untuk pesta, hajatan dan warung makan.',
    gambar_url: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80',
    is_best_seller: false,
    tersedia_rasa: ['Original', 'Balado']
  },
  {
    id: 'a6666666-6666-6666-6666-666666666666',
    nama_produk: 'Kerupuk Mie',
    kategori: 'Kerupuk',
    harga: 140000,
    satuan: 'Bal',
    stok: 14,
    min_stok: 3,
    terjual: 50,
    deskripsi: 'Kerupuk mie kuning renyah gurih, teman setia santap asinan sayur, pecel, dan rujak buah.',
    gambar_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80',
    is_best_seller: false,
    tersedia_rasa: ['Original']
  },
  {
    id: 'a7777777-7777-7777-7777-777777777777',
    nama_produk: 'Kerupuk Rafael',
    kategori: 'Kerupuk',
    harga: 150000,
    satuan: 'Bal',
    stok: 9,
    min_stok: 2,
    terjual: 42,
    deskripsi: 'Kerupuk mawar putih rafael legendaris, cocok dinikmati langsung atau diolah jadi seblak basah viral.',
    gambar_url: 'https://images.unsplash.com/photo-1621996346565-e3d5d628120e?w=600&auto=format&fit=crop&q=80',
    is_best_seller: false,
    tersedia_rasa: ['Original', 'Pedas Daun Jeruk']
  },
  {
    id: 'a8888888-8888-8888-8888-888888888888',
    nama_produk: 'Kerupuk Beton',
    kategori: 'Kerupuk',
    harga: 155000,
    satuan: 'Bal',
    stok: 8,
    min_stok: 2,
    terjual: 35,
    deskripsi: 'Kerupuk beton bulat khas Jawa Barat dengan gurih ketumbar dan rasa renyah tahan lama.',
    gambar_url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
    is_best_seller: false,
    tersedia_rasa: ['Original', 'Balado']
  },
  {
    id: 'a9999999-9999-9999-9999-999999999999',
    nama_produk: 'Kerupuk Stik Kentang',
    kategori: 'Kerupuk',
    harga: 160000,
    satuan: 'Bal',
    stok: 11,
    min_stok: 3,
    terjual: 60,
    deskripsi: 'Stik kentang renyah berbentuk batang tipis, garing dan berbumbu merata.',
    gambar_url: 'https://images.unsplash.com/photo-1600490036275-35f5f1656861?w=600&auto=format&fit=crop&q=80',
    is_best_seller: false,
    tersedia_rasa: ['Original', 'Keju', 'Balado']
  },
  {
    id: 'baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    nama_produk: 'Kerupuk Pangsit',
    kategori: 'Kerupuk',
    harga: 150000,
    satuan: 'Bal',
    stok: 8,
    min_stok: 2,
    terjual: 38,
    deskripsi: 'Kerupuk pangsit goreng segitiga renyah beraroma daun bawang dan kaldu gurih.',
    gambar_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    is_best_seller: false,
    tersedia_rasa: ['Original']
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    nama_produk: 'Kerupuk Begadang',
    kategori: 'Kerupuk',
    harga: 160000,
    satuan: 'Bal',
    stok: 7,
    min_stok: 2,
    terjual: 45,
    deskripsi: 'Kerupuk begadang renyah asin gurih yang sangat mantap untuk menemani santap malam.',
    gambar_url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80',
    is_best_seller: false,
    tersedia_rasa: ['Original', 'Pedas']
  }
];

export const INITIAL_INVENTORY = [
  {
    id: 'inv-1',
    nama_bahan: 'Kerupuk Mentah Kentang',
    kategori: 'kerupuk_mentah',
    jumlah_stok: 50,
    satuan: 'Bal',
    batas_minimum: 10,
    harga_beli: 110000,
    gambar_url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400'
  },
  {
    id: 'inv-2',
    nama_bahan: 'Kerupuk Mentah Bawang',
    kategori: 'kerupuk_mentah',
    jumlah_stok: 40,
    satuan: 'Bal',
    batas_minimum: 10,
    harga_beli: 105000,
    gambar_url: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400'
  },
  {
    id: 'inv-3',
    nama_bahan: 'Kerupuk Mentah Jengkol',
    kategori: 'kerupuk_mentah',
    jumlah_stok: 30,
    satuan: 'Bal',
    batas_minimum: 8,
    harga_beli: 115000,
    gambar_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400'
  },
  {
    id: 'inv-4',
    nama_bahan: 'Bumbu Balado Tabur',
    kategori: 'bumbu',
    jumlah_stok: 18,
    satuan: 'Kg',
    batas_minimum: 5,
    harga_beli: 40000,
    gambar_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400'
  },
  {
    id: 'inv-5',
    nama_bahan: 'Bumbu Keju Bubuk',
    kategori: 'bumbu',
    jumlah_stok: 15,
    satuan: 'Kg',
    batas_minimum: 5,
    harga_beli: 36000,
    gambar_url: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400'
  },
  {
    id: 'inv-6',
    nama_bahan: 'Bumbu Pedas Daun Jeruk',
    kategori: 'bumbu',
    jumlah_stok: 20,
    satuan: 'Kg',
    batas_minimum: 5,
    harga_beli: 50000,
    gambar_url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400'
  },
  {
    id: 'inv-7',
    nama_bahan: 'Bumbu Original Gurih',
    kategori: 'bumbu',
    jumlah_stok: 25,
    satuan: 'Kg',
    batas_minimum: 5,
    harga_beli: 50000,
    gambar_url: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=400'
  },
  {
    id: 'inv-8',
    nama_bahan: 'Plastik Kemasan 1/2 kg',
    kategori: 'plastik',
    jumlah_stok: 8,
    satuan: 'Pcs',
    batas_minimum: 3,
    harga_beli: 24000,
    gambar_url: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=400'
  },
  {
    id: 'inv-9',
    nama_bahan: 'Plastik Bal 11x25 kg',
    kategori: 'plastik',
    jumlah_stok: 10,
    satuan: 'Pcs',
    batas_minimum: 4,
    harga_beli: 34000,
    gambar_url: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=400'
  },
  {
    id: 'inv-10',
    nama_bahan: 'Plastik Bal 30x45 kg',
    kategori: 'plastik',
    jumlah_stok: 9,
    satuan: 'Pcs',
    batas_minimum: 3,
    harga_beli: 34000,
    gambar_url: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=400'
  },
  {
    id: 'inv-11',
    nama_bahan: 'Bambu & Rak Jemuran Kerupuk',
    kategori: 'kayu_bambu',
    jumlah_stok: 24,
    satuan: 'Ikat',
    batas_minimum: 5,
    harga_beli: 20000,
    gambar_url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400'
  },
  {
    id: 'inv-12',
    nama_bahan: 'Label Stiker Merek Diansyah',
    kategori: 'lainnya',
    jumlah_stok: 500,
    satuan: 'Pcs',
    batas_minimum: 50,
    harga_beli: 500,
    gambar_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400'
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    nomor_pesanan: 'ORD-20261025-001',
    nama_pelanggan: 'Nayla Putri Romdoni',
    no_telp: '085786900230',
    alamat: 'Jl. Jenderal Sudirman No. 88, Cimahi',
    nama_produk: 'Kerupuk Kentang',
    id_produk: 'a2222222-2222-2222-2222-222222222222',
    varian_rasa: 'Balado',
    kemasan_plastik: 'Plastik 1/2 kg',
    label_merek: 'Diansyah',
    jumlah: 3,
    harga_satuan: 160000,
    total_harga: 480000,
    status_pesanan: 'selesai',
    status_pembayaran: 'lunas',
    metode_pembayaran: 'qris',
    nomor_referensi: 'B001480',
    estimasi_selesai: '3 - 5 Hari',
    catatan: 'Untuk acara keluarga di Cimahi.',
    tanggal_pesanan: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    nomor_pesanan: 'ORD-20261027-002',
    nama_pelanggan: 'Bagas Ramadhan',
    no_telp: '082194783288',
    alamat: 'Jl. Raya Cibeureum No. 12',
    nama_produk: 'Kerupuk Bawang',
    id_produk: 'a3333333-3333-3333-3333-333333333333',
    varian_rasa: 'Original',
    kemasan_plastik: 'Plastik 11x25 kg',
    label_merek: 'Diansyah',
    jumlah: 2,
    harga_satuan: 160000,
    total_harga: 320000,
    status_pesanan: 'sedang_dibungkus',
    status_pembayaran: 'lunas',
    metode_pembayaran: 'tunai',
    nomor_referensi: 'B001481',
    estimasi_selesai: '3 - 5 Hari',
    catatan: 'Goreng renyah garing ya kang.',
    tanggal_pesanan: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    nomor_pesanan: 'ORD-20261029-003',
    nama_pelanggan: 'Anita Nurhayati',
    no_telp: '081398765432',
    alamat: 'Komp. Permata No. 5, Sumedang',
    nama_produk: 'Kerupuk Jengkol',
    id_produk: 'a4444444-4444-4444-4444-444444444444',
    varian_rasa: 'Pedas',
    kemasan_plastik: 'Plastik 1/2 kg',
    label_merek: 'Diansyah',
    jumlah: 1,
    harga_satuan: 160000,
    total_harga: 160000,
    status_pesanan: 'sedang_digoreng',
    status_pembayaran: 'lunas',
    metode_pembayaran: 'bca',
    nomor_referensi: 'B001482',
    estimasi_selesai: '3 - 5 Hari',
    catatan: 'Bumbu pedasnya mantap.',
    tanggal_pesanan: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'c4444444-4444-4444-4444-444444444444',
    nomor_pesanan: 'ORD-20261030-004',
    nama_pelanggan: 'Meila Fitri',
    no_telp: '085211223344',
    alamat: 'Jl. Ahmad Yani No. 19, Cimahi',
    nama_produk: 'Kerupuk Makaroni',
    id_produk: 'a1111111-1111-1111-1111-111111111111',
    varian_rasa: 'Keju',
    kemasan_plastik: 'Plastik 1/2 kg',
    label_merek: 'Diansyah',
    jumlah: 2,
    harga_satuan: 160000,
    total_harga: 320000,
    status_pesanan: 'menunggu_diproses',
    status_pembayaran: 'pending',
    metode_pembayaran: 'dana',
    nomor_referensi: 'B001483',
    estimasi_selesai: '3 - 5 Hari',
    catatan: 'Pesanan baru masuk dari website.',
    tanggal_pesanan: new Date().toISOString()
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    judul: 'Kerupuk Bawang',
    deskripsi: 'Label Diansyah, Plastik 1 1/2, Original',
    status: 'Siap diambil',
    waktu: 'Hari ini, 09:00',
    type: 'success',
    jumlah: '1x'
  },
  {
    id: 'notif-2',
    judul: 'Kerupuk Kentang',
    deskripsi: 'Label Diansyah, Plastik 1 1/2, Original',
    status: 'Siap diambil',
    waktu: 'Hari ini, 08:30',
    type: 'success',
    jumlah: '2x'
  },
  {
    id: 'notif-3',
    judul: 'Kerupuk Kentang',
    deskripsi: 'Label Diansyah, Plastik 1 1/2, Original',
    status: 'Sedang dibungkus',
    waktu: 'Kemarin, 12:00',
    type: 'warning',
    jumlah: '2x'
  },
  {
    id: 'notif-4',
    judul: 'Kerupuk Bawang',
    deskripsi: 'Label Diansyah, Plastik 1 1/2, Original',
    status: 'Sedang dibungkus',
    waktu: 'Kemarin, 09:00',
    type: 'warning',
    jumlah: '1x'
  },
  {
    id: 'notif-5',
    judul: 'Kerupuk Kentang',
    deskripsi: 'Label Diansyah, Plastik 1 1/2, Original',
    status: 'Sedang digoreng',
    waktu: 'Senin, 14:00',
    type: 'info',
    jumlah: '2x'
  },
  {
    id: 'notif-6',
    judul: 'Kerupuk Bawang',
    deskripsi: 'Label Diansyah, Plastik 1 1/2, Original',
    status: 'Sedang digoreng',
    waktu: 'Senin, 10:00',
    type: 'info',
    jumlah: '1x'
  }
];
