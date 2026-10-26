
class UIDashboard {

    Sistem sistem = new Sistem();

    // 1. Owner memilih menu Dashboard/Laporan Harian
    public void pilihMenuDashboard() {

        // 2. Request data laporan harian
        LaporanHarian laporan = sistem.requestDataLaporanHarian();

        // Tampilkan Dashboard dan metrik utama
        tampilkanDashboard(laporan);
    }

    // Menampilkan ringkasan metrik harian
    public void tampilkanDashboard(LaporanHarian laporan) {
        // Menampilkan total penjualan,
        // jumlah transaksi, dan metrik utama
    }

    // 4. Owner klik salah satu metrik untuk detail
    public void klikMetrik(String namaMetrik) {

        // 5. Request detail metrik
        DetailMetrik detail = sistem.requestDetailMetrik(namaMetrik);

        // Tampilkan pop-up/halaman detail metrik
        tampilkanDetailMetrik(detail);
    }

    public void tampilkanDetailMetrik(DetailMetrik detail) {
        // Menampilkan data detail metrik
    }
}

class Sistem {

    Database database = new Database();

    // 3. Query data penjualan harian
    public LaporanHarian requestDataLaporanHarian() {

        LaporanHarian laporan = database.queryDataPenjualanHarian();

        // Kirim ringkasan metrik harian ke UI Dashboard
        return laporan;
    }

    // 6. Query data detail metrik
    public DetailMetrik requestDetailMetrik(String namaMetrik) {

        DetailMetrik detail = database.queryDataDetailMetrik(namaMetrik);

        // Kirim data detail metrik ke UI Dashboard
        return detail;
    }
}

class Database {

    // Mengambil data laporan harian
    public LaporanHarian queryDataPenjualanHarian() {

        // Query data total penjualan,
        // jumlah transaksi, dan metrik utama

        return new LaporanHarian();
    }

    // Mengambil data detail metrik
    public DetailMetrik queryDataDetailMetrik(String namaMetrik) {

        // Query data detail berdasarkan metrik yang dipilih

        return new DetailMetrik();
    }
}

// Class untuk data laporan harian
class LaporanHarian {

    double totalPenjualan;
    int jumlahTransaksi;
    String metrikUtama;
}

// Class untuk data detail metrik
class DetailMetrik {

    String namaMetrik;
    String dataDetail;
}
