
import java.util.Scanner;

class UIPembayaran {
    Sistem sistem = new Sistem();
    Scanner input = new Scanner(System.in);

    public void tampilkanPembayaran() {

        // 1. Notifikasi pembayaran berhasil
        System.out.println("1. Notifikasi Pembayaran Berhasil");

        // 2. Ambil data rincian pembayaran
        Pembayaran data = sistem.ambilDataPembayaran();

        // Tampilkan rincian pembayaran
        System.out.println("\nRincian Pembayaran");
        System.out.println("Kode Pembayaran : " + data.kode);
        System.out.println("Nama Pelanggan  : " + data.nama);
        System.out.println("Total Pembayaran: Rp " + data.total);

        // 3. Pelanggan memilih cetak bukti
        System.out.println("\n3. Pilih Cetak Bukti");

        // 4. Panggil method cetak bukti pembayaran
        sistem.cetakBuktiPembayaran(data);
    }
}

class Sistem {

    Database database = new Database();
    Printer printer = new Printer();

    public Pembayaran ambilDataPembayaran() {

        System.out.println("2. Ambil data rincian pembayaran");

        return database.kirimDataPembayaran();
    }

    public void cetakBuktiPembayaran(Pembayaran data) {

        System.out.println("4. cetakbuktipembayaran()");

        // 5. Format data menjadi bukti pembayaran
        String bukti = formatBukti(data);

        Scanner input = new Scanner(System.in);

        System.out.println("\nPilih jenis cetak:");
        System.out.println("1. Cetak Bukti Fisik");
        System.out.println("2. Cetak Bukti Digital");

        System.out.print("Pilihan: ");
        int pilihan = input.nextInt();

        if (pilihan == 1) {

            // 5.1 Kirim perintah cetak bukti
            printer.cetakBukti(bukti);

            System.out.println("Status Cetak Berhasil");
            System.out.println("Notifikasi bukti fisik siap diambil");

        } else if (pilihan == 2) {

            // Cetak bukti digital
            System.out.println("Tampilkan bukti pembayaran digital/PDF");
            System.out.println("Bukti digital siap diunduh");

        } else {

            System.out.println("Pilihan tidak valid");
        }
    }

    public String formatBukti(Pembayaran data) {

        System.out.println("5. Format data menjadi bukti pembayaran");

        return "Bukti Pembayaran\n"
                + "Kode: " + data.kode + "\n"
                + "Nama: " + data.nama + "\n"
                + "Total: Rp " + data.total;
    }
}

class Database {

    public Pembayaran kirimDataPembayaran() {

        Pembayaran data = new Pembayaran(
                "PAY001",
                "Pelanggan",
                1500000
        );

        System.out.println("Kirim data pembayaran");

        return data;
    }
}

class Printer {

    public void cetakBukti(String bukti) {

        System.out.println("5.1 Kirim perintah cetak bukti");
        System.out.println("\n" + bukti);
    }
}

class Pembayaran {

    String kode;
    String nama;
    double total;

    public Pembayaran(String kode, String nama, double total) {

        this.kode = kode;
        this.nama = nama;
        this.total = total;
    }
}

public class Main {

    public static void main(String[] args) {

        UIPembayaran ui = new UIPembayaran();

        ui.tampilkanPembayaran();
    }
}
