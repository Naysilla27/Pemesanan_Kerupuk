
class UILaporan {

    Sistem sistem = new Sistem();

    // 1. Owner melihat detail laporan
    public void lihatDetailLaporan() {

        // Menampilkan tombol Unduh/Ekspor
        tampilkanTombolUnduh();
    }

    public void tampilkanTombolUnduh() {
        // Menampilkan tombol Unduh/Ekspor pada UI
    }

    // 2. Owner klik tombol Unduh Laporan
    public void klikUnduhLaporan() {

        // Menampilkan pilihan format
        tampilkanPilihanFormat();
    }

    public void tampilkanPilihanFormat() {
        // Menampilkan pilihan format PDF, Excel, dan CSV
    }

    // 3. Owner memilih format laporan
    public void pilihFormat(String format) {

        // 4. Request unduh laporan + format
        FileLaporan file = sistem.requestUnduhLaporan(format);

        // Kirim file hasil unduhan
        kirimFileUnduhan(file);
    }

    public void kirimFileUnduhan(FileLaporan file) {
        // Mengirim file hasil unduhan ke Owner
    }
}

class Sistem {

    Database database = new Database();

    // 4. Request unduh laporan + format
    public FileLaporan requestUnduhLaporan(String format) {

        // 5. Ambil data laporan
        DataLaporan data = database.ambilDataLaporan();

        // 6. Proses data dan generate file sesuai format
        FileLaporan file = generateFile(data, format);

        return file;
    }

    // 6. Proses data dan generate file sesuai format
    public FileLaporan generateFile(DataLaporan data, String format) {

        // Generate file berdasarkan format yang dipilih

        return new FileLaporan(data, format);
    }
}

class Database {

    // 5. Ambil data laporan
    public DataLaporan ambilDataLaporan() {

        // Query untuk mengambil data laporan

        return new DataLaporan();
    }
}

// Class untuk data laporan
class DataLaporan {

    String jenisLaporan;
    String tanggalLaporan;
    double totalPenjualan;
    int jumlahTransaksi;
}

// Class untuk file laporan
class FileLaporan {

    DataLaporan data;
    String format;

    public FileLaporan(DataLaporan data, String format) {
        this.data = data;
        this.format = format;
    }
}
