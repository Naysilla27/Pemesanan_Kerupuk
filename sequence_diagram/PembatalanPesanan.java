
import java.util.ArrayList;
import java.util.Scanner;

public class PembatalanPesanan {

    static Scanner input = new Scanner(System.in);
    static ArrayList<Pesanan> daftarPesanan = new ArrayList<>();

    static class Pesanan {
        int id;
        String namaProduk;
        String status;

        Pesanan(int id, String namaProduk, String status) {
            this.id = id;
            this.namaProduk = namaProduk;
            this.status = status;
        }
    }

    public static void main(String[] args) {

        // Data contoh pesanan
        daftarPesanan.add(
            new Pesanan(101, "Kerupuk Original", "Diproses")
        );
        daftarPesanan.add(
            new Pesanan(102, "Kerupuk Pedas", "Menunggu")
        );

        System.out.println("=== PEMBATALAN PESANAN ===");

        // 1. Membuka menu Lihat Status Pesanan
        tampilkanDaftarPesanan();

        // 4. Memilih pesanan yang akan dibatalkan
        System.out.print("\nMasukkan ID pesanan yang ingin dibatalkan: ");

        if (!input.hasNextInt()) {
            System.out.println("Error: ID pesanan harus berupa angka.");
            input.close();
            return;
        }

        int idPesanan = input.nextInt();

        Pesanan pesanan = cariPesanan(idPesanan);

        if (pesanan == null) {
            System.out.println("Error: Pesanan tidak ditemukan.");
            input.close();
            return;
        }

        // 5. Menampilkan detail pesanan
        System.out.println("\n=== DETAIL PESANAN ===");
        System.out.println("ID Pesanan : " + pesanan.id);
        System.out.println("Nama Produk: " + pesanan.namaProduk);
        System.out.println("Status     : " + pesanan.status);

        // 6. Konfirmasi pembatalan
        System.out.print("\nKonfirmasi pembatalan? (ya/tidak): ");
        String konfirmasi = input.next();

        if (!konfirmasi.equalsIgnoreCase("ya")) {
            System.out.println("Pembatalan pesanan dibatalkan oleh pelanggan.");
            input.close();
            return;
        }

        // 7 dan 8. Memeriksa status pesanan
        if (pesanan.status.equalsIgnoreCase("Diproses")) {

            // Kondisi [Diproses]
            System.out.println("\n=== PEMBATALAN GAGAL ===");
            System.out.println("Pesanan tidak dapat dibatalkan.");
            System.out.println("Error: Pesanan sudah dalam proses produksi.");

        } else if (pesanan.status.equalsIgnoreCase("Menunggu")) {

            // Kondisi [Menunggu]
            pesanan.status = "Dibatalkan";

            // 9. Memperbarui status pesanan
            System.out.println("\n=== PEMBATALAN BERHASIL ===");
            System.out.println("Status pesanan berhasil diperbarui.");
            System.out.println("Pesanan berhasil dibatalkan.");
            System.out.println("Status terbaru: " + pesanan.status);

        } else {
            System.out.println("\nPesanan tidak dapat dibatalkan.");
            System.out.println("Status pesanan: " + pesanan.status);
        }

        input.close();
    }

    // Mengambil dan menampilkan daftar pesanan
    static void tampilkanDaftarPesanan() {

        System.out.println("\n=== DAFTAR PESANAN ===");

        for (Pesanan pesanan : daftarPesanan) {
            System.out.println(
                "ID: " + pesanan.id
                + " | Produk: " + pesanan.namaProduk
                + " | Status: " + pesanan.status
            );
        }
    }

    // Mencari pesanan berdasarkan ID
    static Pesanan cariPesanan(int id) {

        for (Pesanan pesanan : daftarPesanan) {
            if (pesanan.id == id) {
                return pesanan;
            }
        }

        return null;
    }
}
