
class UILaporan {

    Sistem sistem = new Sistem();

    // 1. Owner memilih menu Kelola Laporan
    // dan klik Lihat Laporan
    public void lihatLaporan() {

        // 2. Minta daftar jenis laporan
        DaftarLaporan daftar = sistem.mintaDaftarLaporan();

        // Menampilkan daftar laporan
        tampilkanDaftarLaporan(daftar);
    }

    // Menampilkan daftar jenis laporan
    public void tampilkanDaftarLaporan(DaftarLaporan daftar) {
        // Menampilkan daftar jenis laporan kepada Owner
    }

    // 4. Owner memilih jenis laporan (Penjualan)
    public void pilihJenisLaporan(String jenisLaporan) {

        // Menampilkan form filter range tanggal
        tampilkanFormFilter();

    }

    // Menampilkan form filter
    public void tampilkanFormFilter() {
        // Menampilkan form filter tanggal
    }

    // 5. Owner mengisi filter dan klik Tampilkan
    public void tampilkanLaporan(String tanggalMulai, String tanggalAkhir) {

        // 6. Request data laporan sesuai filter
        DataLaporan laporan = sistem.requestDataLaporan(
                tanggalMulai,
                tanggalAkhir
        );

        // Menampilkan detail laporan
        tampilkanDetailLaporan(laporan);
    }

    // Menampilkan detail laporan
    public void tampilkanDetailLaporan(DataLaporan laporan) {
        // Menampilkan hasil laporan kepada Owner
    }
}

class Sistem {

    Database database = new Database();

    // 3. Ambil daftar laporan
    public DaftarLaporan mintaDaftarLaporan() {

        DaftarLaporan daftar = database.ambilDaftarLaporan();

        // Kirim daftar laporan ke UI
        return daftar;
    }

    // 6. Request data laporan sesuai filter
    public DataLaporan requestDataLaporan(
            String tanggalMulai,
            String tanggalAkhir) {

        // 7. Query data laporan
        DataLaporan laporan = database.queryDataLaporan(
                tanggalMulai,
                tanggalAkhir
        );

        // Proses dan kirim laporan ke UI
        return laporan;
    }
}

class Database {

    // Mengambil daftar jenis laporan
    public DaftarLaporan ambilDaftarLaporan() {

        // Query daftar jenis laporan

        return new DaftarLaporan();
    }

    // 7. Query data laporan sesuai filter
    public DataLaporan queryDataLaporan(
            String tanggalMulai,
            String tanggalAkhir) {

        // Query data laporan berdasarkan range tanggal

        return new DataLaporan();
    }
}

// Class untuk daftar jenis laporan
class DaftarLaporan {

    String[] jenisLaporan;
}

// Class untuk data laporan
class DataLaporan {

    String jenisLaporan;
    String tanggalMulai;
    String tanggalAkhir;
    double totalPenjualan;
    int jumlahTransaksi;
}
