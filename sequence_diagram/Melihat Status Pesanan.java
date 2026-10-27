
import java.util.ArrayList;
import java.util.Scanner;

public class MelihatStatusPesanan {

    static Scanner input = new Scanner(System.in);
    static ArrayList<Pesanan> daftarPesanan = new ArrayList<>();

    static class Pesanan {
        int id;
        String namaProduk;
        String status;
        boolean aktif;

        Pesanan(int id, String namaProduk, String status, boolean aktif) {
            this.id = id;
            this.namaProduk = namaProduk;
            this.status = status;
            this.aktif = aktif;
        }
    }

    public static void main(String[] args) {

        // Data contoh untuk simulasi database
        daftarPesanan.add(new Pesanan(101, "Kerupuk Original", "Diproses", true));
        daftarPesanan.add(new Pesanan(102, "Kerupuk Pedas", "Selesai", true));
        daftarPesanan.add(new Pesanan(103, "Kerupuk Ikan", "Dibatalkan", false));

        System.out.println("=== MENU STATUS PESANAN ===");
        System.out.println("1. Melihat daftar pesanan");
        System.out.println("2. Melihat status pesanan");
        System.out.print("Pilih menu: ");

        if (!input.hasNextInt()) {
            System.out.println("Error: Pilihan harus berupa angka.");
            input.close();
            return;
        }

        int pilihan = input.nextInt();

        if (pilihan == 1) {
            tampilkanDaftarPesanan();
        } else if (pilihan == 2) {
            tampilkanStatusPesanan();
        } else {
            System.out.println("Error: Menu tidak tersedia.");
        }

        input.close();
    }

    // Mengambil dan menampilkan daftar pesanan
    static void tampilkanDaftarPesanan() {

        if (daftarPesanan.isEmpty()) {
            System.out.println("Belum Ada Pesanan yang dibuat.");
            return;
        }

        System.out.println("\n=== DAFTAR PESANAN ===");

        for (Pesanan pesanan : daftarPesanan) {
            System.out.println(
                "ID: " + pesanan.id
                + " | Produk: " + pesanan.namaProduk
                + " | Status: " + pesanan.status
            );
        }
    }

    // Mengambil status pesanan berdasarkan ID
    static void tampilkanStatusPesanan() {

        if (daftarPesanan.isEmpty()) {
            System.out.println("Belum Ada Pesanan yang dibuat.");
            return;
        }

        tampilkanDaftarPesanan();

        System.out.print("\nMasukkan ID pesanan: ");

        if (!input.hasNextInt()) {
            System.out.println("Error: ID pesanan harus berupa angka.");
            return;
        }

        int idPesanan = input.nextInt();

        Pesanan pesananDitemukan = null;

        for (Pesanan pesanan : daftarPesanan) {
            if (pesanan.id == idPesanan) {
                pesananDitemukan = pesanan;
                break;
            }
        }

        // Data pesanan tidak ditemukan
        if (pesananDitemukan == null) {
            System.out.println(
                "Error: Pesanan tidak ditemukan."
            );
            return;
        }

        // Pesanan ditemukan tetapi sudah tidak aktif
        if (!pesananDitemukan.aktif) {
            System.out.println(
                "Error: Pesanan tidak ditemukan atau sudah tidak aktif."
            );
            return;
        }

        // Menampilkan status terbaru
        System.out.println("\n=== STATUS PESANAN ===");
        System.out.println("ID Pesanan : " + pesananDitemukan.id);
        System.out.println("Nama Produk: " + pesananDitemukan.namaProduk);
        System.out.println("Status     : " + pesananDitemukan.status);
    }
}
