
import java.util.ArrayList;
import java.util.Scanner;

public class LihatDaftarPesanan {

    static Scanner input = new Scanner(System.in);
    static ArrayList<Pesanan> daftarPesanan = new ArrayList<>();

    static class Pesanan {
        int id;
        String namaProduk;
        int jumlah;
        String status;

        Pesanan(int id, String namaProduk, int jumlah, String status) {
            this.id = id;
            this.namaProduk = namaProduk;
            this.jumlah = jumlah;
            this.status = status;
        }
    }

    public static void main(String[] args) {

        // Data contoh sebagai simulasi database
        daftarPesanan.add(
            new Pesanan(101, "Kerupuk Original", 10, "Menunggu")
        );
        daftarPesanan.add(
            new Pesanan(102, "Kerupuk Pedas", 5, "Diproses")
        );

        // 1. Pelanggan memilih menu Lihat Daftar Pesanan
        System.out.println("=== LIHAT DAFTAR PESANAN ===");

        // 2 dan 3. Sistem mengambil daftar pesanan
        if (daftarPesanan.isEmpty()) {
            System.out.println("\nError: Belum Ada Pesanan yang dibuat.");
            input.close();
            return;
        }

        tampilkanDaftarPesanan();

        // Memilih tombol Detail Pesanan
        System.out.print("\nMasukkan ID pesanan untuk melihat detail: ");

        if (!input.hasNextInt()) {
            System.out.println("Error: ID pesanan harus berupa angka.");
            input.close();
            return;
        }

        int idPesanan = input.nextInt();

        // Mengambil detail pesanan
        Pesanan pesanan = cariPesanan(idPesanan);

        if (pesanan == null) {
            System.out.println("\nError: Data pesanan tidak ditemukan.");
        } else {
            tampilkanDetailPesanan(pesanan);
        }

        input.close();
    }

    // Menampilkan daftar pesanan
    static void tampilkanDaftarPesanan() {

        System.out.println("\n=== DAFTAR PESANAN ===");

        for (Pesanan pesanan : daftarPesanan) {
            System.out.println(
                "ID: " + pesanan.id
                + " | Produk: " + pesanan.namaProduk
                + " | Jumlah: " + pesanan.jumlah
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

    // Menampilkan detail pesanan yang ditemukan
    static void tampilkanDetailPesanan(Pesanan pesanan) {

        System.out.println("\n=== DETAIL PESANAN ===");
        System.out.println("ID Pesanan  : " + pesanan.id);
        System.out.println("Nama Produk : " + pesanan.namaProduk);
        System.out.println("Jumlah      : " + pesanan.jumlah);
        System.out.println("Status      : " + pesanan.status);
        System.out.println("Detail pesanan berhasil ditampilkan.");
    }
}
