import { createClient } from '@supabase/supabase-js';
import {
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_INVENTORY,
  INITIAL_ORDERS,
  INITIAL_NOTIFICATIONS
} from './mockData';

// 1. Get credentials from env or local storage
const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const getStoredCredentials = () => {
  const url = localStorage.getItem('diansyah_sb_url') || envUrl;
  const key = localStorage.getItem('diansyah_sb_key') || envKey;
  return { url: url.trim(), key: key.trim() };
};

export const saveCredentials = (url, key) => {
  if (url) localStorage.setItem('diansyah_sb_url', url.trim());
  else localStorage.removeItem('diansyah_sb_url');

  if (key) localStorage.setItem('diansyah_sb_key', key.trim());
  else localStorage.removeItem('diansyah_sb_key');

  window.location.reload();
};

const creds = getStoredCredentials();
export const isConfigured = Boolean(creds.url && creds.key && creds.url.startsWith('http'));

export let supabase = null;
if (isConfigured) {
  try {
    supabase = createClient(creds.url, creds.key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
  } catch (err) {
    console.warn('Gagal inisialisasi Supabase client:', err);
    supabase = null;
  }
}

// ====================================================================
// LOCAL STORAGE PERSISTENCE (SEAMLESS OFFLINE DEMO & INSTANT TESTING)
// ====================================================================
const loadFromStorage = (key, fallback) => {
  try {
    const item = localStorage.getItem(`diansyah_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(`diansyah_${key}`, JSON.stringify(data));
  } catch (err) {
    console.error('Storage save error:', err);
  }
};

let localProducts = loadFromStorage('products', INITIAL_PRODUCTS);
let localInventory = loadFromStorage('inventory', INITIAL_INVENTORY);
let localOrders = loadFromStorage('orders', INITIAL_ORDERS);
let localUsers = loadFromStorage('users', INITIAL_USERS);
let localNotifications = loadFromStorage('notifications', INITIAL_NOTIFICATIONS);
let localLogs = loadFromStorage('logs', [
  {
    id: 'log-1',
    nama_user: 'Budiman (Owner)',
    role: 'Owner',
    aktivitas: 'Sistem Diaktifkan',
    keterangan: 'Sistem Informasi Pabrik Kerupuk Diansyah online & siap operasional.',
    waktu: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  }
]);

// Helper to log activities
export const logActivity = async (user, aktivitas, keterangan) => {
  const newLog = {
    id: 'log-' + Date.now(),
    nama_user: user?.nama || 'Pengguna',
    role: user?.role || 'Sistem',
    aktivitas,
    keterangan,
    waktu: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  };

  localLogs = [newLog, ...localLogs];
  saveToStorage('logs', localLogs);

  if (supabase) {
    try {
      await supabase.from('log_aktivitas').insert([
        {
          id_user: user?.id && user.id.includes('-') && user.id.length === 36 ? user.id : null,
          nama_user: user?.nama || 'Pengguna',
          role: user?.role || 'Pelanggan',
          aktivitas,
          keterangan
        }
      ]);
    } catch (e) {
      console.warn('Log Supabase error:', e);
    }
  }
};

// ====================================================================
// SUPABASE HEALTH CHECK & 1-CLICK SEEDING
// ====================================================================
export const checkSupabaseHealth = async () => {
  if (!supabase) return { connected: false, message: 'Kredensial belum diatur.' };

  const tables = ['users', 'produk', 'pesanan', 'stok_bahan', 'pembayaran'];
  const results = {};

  try {
    for (const tbl of tables) {
      const { count, error } = await supabase.from(tbl).select('*', { count: 'exact', head: true });
      results[tbl] = { ok: !error, count: count ?? 0, error: error?.message };
    }
    const allOk = Object.values(results).every((r) => r.ok);
    return {
      connected: true,
      allOk,
      tables: results,
      message: allOk
        ? 'Semua tabel Supabase terhubung dengan sempurna!'
        : 'Beberapa tabel belum dibuat di Supabase. Jalankan supabase_schema.sql di SQL Editor!'
    };
  } catch (err) {
    return { connected: false, message: err.message };
  }
};

export const seedSupabaseDatabase = async () => {
  if (!supabase) return { success: false, message: 'Supabase belum terhubung.' };

  try {
    // 1. Seed users
    for (const u of INITIAL_USERS) {
      await supabase.from('users').upsert({
        username: u.username,
        password: u.password,
        nama: u.nama,
        role: u.role,
        email: u.email,
        no_telp: u.no_telp,
        jenis_kelamin: u.jenis_kelamin,
        alamat: u.alamat
      }, { onConflict: 'username' });
    }

    // 2. Seed products
    for (const p of INITIAL_PRODUCTS) {
      await supabase.from('produk').insert({
        nama_produk: p.nama_produk,
        kategori: p.kategori,
        harga: p.harga,
        satuan: p.satuan,
        stok: p.stok,
        min_stok: p.min_stok,
        deskripsi: p.deskripsi,
        gambar_url: p.gambar_url,
        is_best_seller: p.is_best_seller
      });
    }

    // 3. Seed inventory
    for (const inv of INITIAL_INVENTORY) {
      await supabase.from('stok_bahan').insert({
        nama_bahan: inv.nama_bahan,
        kategori: inv.kategori,
        jumlah_stok: inv.jumlah_stok,
        satuan: inv.satuan,
        batas_minimum: inv.batas_minimum,
        harga_beli: inv.harga_beli,
        gambar_url: inv.gambar_url
      });
    }

    return { success: true, message: 'Data awal berhasil di-seed langsung ke database Supabase Anda!' };
  } catch (err) {
    return { success: false, message: 'Gagal melakukan seed: ' + err.message };
  }
};

// ====================================================================
// API: AUTHENTICATION
// ====================================================================
export const authService = {
  async login(username, password) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('username', username.trim())
          .eq('password', password.trim())
          .maybeSingle();

        if (data && !error) {
          localStorage.setItem('diansyah_active_user', JSON.stringify(data));
          logActivity(data, 'Login Pengguna', `User ${data.nama} berhasil masuk sebagai ${data.role}`);
          return { success: true, user: data };
        }
      } catch (err) {
        console.warn('Supabase login check:', err);
      }
    }

    const found = localUsers.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password.trim()
    );

    if (found) {
      localStorage.setItem('diansyah_active_user', JSON.stringify(found));
      logActivity(found, 'Login Pengguna', `User ${found.nama} login sebagai ${found.role}`);
      return { success: true, user: found };
    }

    return { success: false, message: 'Username atau kata sandi tidak cocok.' };
  },

  async register(userData) {
    const newUser = {
      id: 'usr-' + Date.now(),
      ...userData
    };

    if (supabase) {
      try {
        const { data } = await supabase.from('users').insert([{
          username: userData.username,
          password: userData.password,
          nama: userData.nama,
          role: userData.role,
          email: userData.email,
          no_telp: userData.no_telp,
          jenis_kelamin: userData.jenis_kelamin,
          alamat: userData.alamat
        }]).select().single();

        if (data) newUser.id = data.id;
      } catch (e) {
        console.warn('Supabase register error:', e);
      }
    }

    localUsers.push(newUser);
    saveToStorage('users', localUsers);
    localStorage.setItem('diansyah_active_user', JSON.stringify(newUser));
    logActivity(newUser, 'Pendaftaran Akun Baru', `Pendaftaran berhasil untuk ${newUser.nama}`);
    return { success: true, user: newUser };
  },

  getCurrentUser() {
    try {
      const stored = localStorage.getItem('diansyah_active_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  logout() {
    const current = this.getCurrentUser();
    if (current) {
      logActivity(current, 'Logout Sesi', `Pengguna ${current.nama} keluar dari sistem.`);
    }
    localStorage.removeItem('diansyah_active_user');
  }
};

// ====================================================================
// API: PRODUK (CATALOG)
// ====================================================================
export const productService = {
  async getAll() {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('produk')
          .select('*')
          .order('is_best_seller', { ascending: false });

        if (data && !error && data.length > 0) {
          localProducts = data;
          saveToStorage('products', localProducts);
          return data;
        }
      } catch (err) {
        console.warn('Supabase get products error:', err);
      }
    }
    return localProducts;
  },

  async add(productData) {
    const newProd = {
      id: 'prod-' + Date.now(),
      ...productData,
      stok: Number(productData.stok || 0),
      min_stok: Number(productData.min_stok || 3),
      harga: Number(productData.harga || 0),
      terjual: 0
    };

    if (supabase) {
      try {
        const { data } = await supabase.from('produk').insert([{
          nama_produk: newProd.nama_produk,
          kategori: newProd.kategori,
          harga: newProd.harga,
          satuan: newProd.satuan,
          stok: newProd.stok,
          min_stok: newProd.min_stok,
          deskripsi: newProd.deskripsi,
          gambar_url: newProd.gambar_url,
          is_best_seller: Boolean(newProd.is_best_seller)
        }]).select().single();

        if (data) newProd.id = data.id;
      } catch (e) {
        console.warn('Supabase add product error:', e);
      }
    }

    localProducts = [newProd, ...localProducts];
    saveToStorage('products', localProducts);
    logActivity(null, 'Tambah Produk Baru', `Menambahkan produk baru: ${newProd.nama_produk}`);
    return newProd;
  },

  async update(id, updates) {
    if (supabase) {
      try {
        await supabase.from('produk').update(updates).eq('id', id);
      } catch (e) {
        console.warn('Supabase update product error:', e);
      }
    }

    localProducts = localProducts.map((p) => (p.id === id ? { ...p, ...updates } : p));
    saveToStorage('products', localProducts);
    return true;
  },

  async delete(id) {
    if (supabase) {
      try {
        await supabase.from('produk').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete product error:', e);
      }
    }
    localProducts = localProducts.filter((p) => p.id !== id);
    saveToStorage('products', localProducts);
    return true;
  }
};

// ====================================================================
// API: PESANAN & TRANSAKSI
// ====================================================================
export const orderService = {
  async getAll() {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('pesanan')
          .select('*')
          .order('tanggal_pesanan', { ascending: false });

        if (data && !error && data.length > 0) {
          localOrders = data;
          saveToStorage('orders', localOrders);
          return data;
        }
      } catch (err) {
        console.warn('Supabase get orders error:', err);
      }
    }
    return localOrders;
  },

  async create(orderPayload) {
    const orderNumber = 'ORD-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(100 + Math.random() * 900);
    const newOrder = {
      id: 'ord-' + Date.now(),
      nomor_pesanan: orderNumber,
      nama_pelanggan: orderPayload.nama_pelanggan,
      no_telp: orderPayload.no_telp,
      alamat: orderPayload.alamat || '',
      nama_produk: orderPayload.nama_produk,
      id_produk: (orderPayload.id_produk && orderPayload.id_produk.length === 36) ? orderPayload.id_produk : null,
      varian_rasa: orderPayload.varian_rasa || 'Original',
      kemasan_plastik: orderPayload.kemasan_plastik || 'Plastik 1/2 kg',
      label_merek: orderPayload.label_merek || 'Diansyah',
      jumlah: Number(orderPayload.jumlah || 1),
      harga_satuan: Number(orderPayload.harga_satuan || 160000),
      total_harga: Number(orderPayload.total_harga || 0),
      status_pesanan: 'menunggu_diproses',
      status_pembayaran: orderPayload.status_pembayaran || 'pending',
      metode_pembayaran: orderPayload.metode_pembayaran || 'qris',
      nomor_referensi: 'B' + Math.floor(100000 + Math.random() * 900000),
      estimasi_selesai: '3 - 5 Hari',
      catatan: orderPayload.catatan || '',
      tanggal_pesanan: new Date().toISOString()
    };

    if (supabase) {
      try {
        const { data } = await supabase.from('pesanan').insert([{
          nomor_pesanan: newOrder.nomor_pesanan,
          id_produk: newOrder.id_produk,
          varian_rasa: newOrder.varian_rasa,
          kemasan_plastik: newOrder.kemasan_plastik,
          label_merek: newOrder.label_merek,
          jumlah: newOrder.jumlah,
          harga_satuan: newOrder.harga_satuan,
          total_harga: newOrder.total_harga,
          status_pesanan: newOrder.status_pesanan,
          estimasi_selesai: newOrder.estimasi_selesai,
          catatan: `${newOrder.nama_pelanggan} (${newOrder.no_telp}): ${newOrder.catatan}`
        }]).select().single();

        if (data) newOrder.id = data.id;
      } catch (err) {
        console.warn('Supabase create order error:', err);
      }
    }

    localOrders = [newOrder, ...localOrders];
    saveToStorage('orders', localOrders);

    // Auto notification
    const newNotif = {
      id: 'notif-' + Date.now(),
      judul: newOrder.nama_produk,
      deskripsi: `Pesanan Baru dari ${newOrder.nama_pelanggan} (${newOrder.jumlah} Bal) - ${newOrder.varian_rasa}`,
      status: 'Menunggu Diproses',
      waktu: 'Baru saja',
      type: 'info',
      jumlah: `${newOrder.jumlah}x`
    };
    localNotifications = [newNotif, ...localNotifications];
    saveToStorage('notifications', localNotifications);

    logActivity(
      null,
      'Pemesanan Baru',
      `Pesanan ${orderNumber} berhasil dibuat oleh ${newOrder.nama_pelanggan} (Total: Rp ${newOrder.total_harga.toLocaleString('id-ID')})`
    );

    return newOrder;
  },

  async updateStatus(id, newStatus, reason = '') {
    if (supabase) {
      try {
        await supabase
          .from('pesanan')
          .update({ status_pesanan: newStatus, updated_at: new Date().toISOString() })
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase status update error:', err);
      }
    }

    let updatedOrder = null;
    localOrders = localOrders.map((o) => {
      if (o.id === id) {
        updatedOrder = { ...o, status_pesanan: newStatus };
        return updatedOrder;
      }
      return o;
    });
    saveToStorage('orders', localOrders);

    if (updatedOrder) {
      let notifText = '';
      if (newStatus === 'sedang_digoreng') notifText = 'Sedang digoreng oleh Staf Penggoreng';
      else if (newStatus === 'siap_diverifikasi') notifText = 'Selesai digoreng & Siap Diverifikasi QC';
      else if (newStatus === 'sedang_dibungkus') notifText = 'Lolos Verifikasi, Sedang dibungkus kemasan';
      else if (newStatus === 'selesai') notifText = 'Selesai! Pesanan siap diambil atau dikirim';
      else if (newStatus === 'dibatalkan') notifText = 'Pesanan dibatalkan';

      const notif = {
        id: 'notif-' + Date.now(),
        judul: updatedOrder.nama_produk,
        deskripsi: `${updatedOrder.label_merek || 'Diansyah'}, ${updatedOrder.kemasan_plastik}, ${updatedOrder.varian_rasa}`,
        status: notifText,
        waktu: 'Baru saja',
        type: newStatus === 'selesai' ? 'success' : newStatus === 'dibatalkan' ? 'danger' : 'warning',
        jumlah: `${updatedOrder.jumlah}x`
      };
      localNotifications = [notif, ...localNotifications];
      saveToStorage('notifications', localNotifications);

      logActivity(
        null,
        'Update Status Pesanan',
        `Pesanan ${updatedOrder.nomor_pesanan} diubah ke [${newStatus}]. ${reason}`
      );
    }

    return updatedOrder;
  },

  async cancelOrder(id) {
    const order = localOrders.find((o) => o.id === id);
    if (!order) return { success: false, message: 'Pesanan tidak ditemukan' };

    if (order.status_pesanan !== 'menunggu_konfirmasi' && order.status_pesanan !== 'menunggu_diproses') {
      return {
        success: false,
        message: 'Pesanan sudah masuk proses produksi (penggorengan) dan tidak dapat dibatalkan.'
      };
    }

    await this.updateStatus(id, 'dibatalkan', 'Dibatalkan oleh Pelanggan.');
    return { success: true, message: 'Pesanan berhasil dibatalkan.' };
  },

  async confirmCashPayment(id, nominalDiterima) {
    const order = localOrders.find((o) => o.id === id);
    if (!order) return { success: false, message: 'Pesanan tidak ditemukan' };

    if (nominalDiterima < order.total_harga) {
      return { success: false, message: 'Nominal uang yang diterima kurang dari total tagihan!' };
    }

    const kembalian = nominalDiterima - order.total_harga;

    localOrders = localOrders.map((o) =>
      o.id === id
        ? {
            ...o,
            status_pembayaran: 'lunas',
            uang_diterima: nominalDiterima,
            kembalian: kembalian
          }
        : o
    );
    saveToStorage('orders', localOrders);

    if (supabase) {
      try {
        await supabase
          .from('pembayaran')
          .update({
            status_pembayaran: 'lunas',
            uang_diterima: nominalDiterima,
            kembalian: kembalian
          })
          .eq('id_pesanan', id);
      } catch (e) {
        console.warn('Supabase cash payment update error:', e);
      }
    }

    logActivity(
      null,
      'Konfirmasi Pembayaran Tunai',
      `Pembayaran pesanan ${order.nomor_pesanan} sebesar Rp ${order.total_harga.toLocaleString('id-ID')} lunas tunai. Kembalian: Rp ${kembalian.toLocaleString('id-ID')}`
    );

    return { success: true, kembalian };
  }
};

// ====================================================================
// API: STOK BAHAN BAKU (INVENTORY)
// ====================================================================
export const inventoryService = {
  async getAll() {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('stok_bahan').select('*').order('nama_bahan');
        if (data && !error && data.length > 0) {
          localInventory = data;
          saveToStorage('inventory', localInventory);
          return data;
        }
      } catch (err) {
        console.warn('Supabase inventory get error:', err);
      }
    }
    return localInventory;
  },

  async updateStock(id, newQuantity) {
    const qty = Math.max(0, Number(newQuantity));
    if (supabase) {
      try {
        await supabase.from('stok_bahan').update({ jumlah_stok: qty, tanggal_update: new Date().toISOString() }).eq('id', id);
      } catch (e) {
        console.warn('Supabase update stock error:', e);
      }
    }

    let itemNama = '';
    localInventory = localInventory.map((i) => {
      if (i.id === id) {
        itemNama = i.nama_bahan;
        return { ...i, jumlah_stok: qty };
      }
      return i;
    });
    saveToStorage('inventory', localInventory);

    logActivity(null, 'Update Stok Bahan', `Stok ${itemNama} diperbarui menjadi ${qty}`);
    return true;
  },

  async add(itemData) {
    const newItem = {
      id: 'inv-' + Date.now(),
      ...itemData,
      jumlah_stok: Number(itemData.jumlah_stok || 0),
      batas_minimum: Number(itemData.batas_minimum || 5),
      harga_beli: Number(itemData.harga_beli || 0)
    };

    if (supabase) {
      try {
        const { data } = await supabase.from('stok_bahan').insert([{
          nama_bahan: newItem.nama_bahan,
          kategori: newItem.kategori,
          jumlah_stok: newItem.jumlah_stok,
          satuan: newItem.satuan,
          batas_minimum: newItem.batas_minimum,
          harga_beli: newItem.harga_beli,
          gambar_url: newItem.gambar_url
        }]).select().single();

        if (data) newItem.id = data.id;
      } catch (e) {
        console.warn('Supabase add inventory error:', e);
      }
    }

    localInventory = [newItem, ...localInventory];
    saveToStorage('inventory', localInventory);
    logActivity(null, 'Input Bahan Baru', `Pencatatan bahan baku baru: ${newItem.nama_bahan} (${newItem.jumlah_stok} ${newItem.satuan})`);
    return newItem;
  }
};

// ====================================================================
// API: NOTIFIKASI & LOG AKTIVITAS
// ====================================================================
export const notificationService = {
  getNotifications() {
    return localNotifications;
  },
  getLogs() {
    return localLogs;
  }
};
