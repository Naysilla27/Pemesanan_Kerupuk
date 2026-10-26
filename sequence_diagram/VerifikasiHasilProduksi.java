
import java.util.Scanner;

public class VerifikasiHasilProduksi {

    static Scanner input = new Scanner(System.in);
    static String namaProduk = "Kerupuk Original";
    static String statusProduksi = "Selesai";
    static boolean sudahDiverifikasi = false;

    public static void main(String[] args) {
        System.out.println("=== VERIFIKASI HASIL PRODUKSI ===");

        // Mengambil data produksi yang siap diverifikasi
        System.out.println("Daftar produksi:");
        System.out.println("1. " + namaProduk);
        System.out.println("Status produksi: " + statusProduksi);

        System.out.print("\nPilih nomor produksi: ");
        int pilihan = input.nextInt();

        if (pilihan != 1) {
            System.out.println("Error: Data produksi tidak ditemukan.");
            input.close();
            return;
        }

        // Memilih hasil produksi dan melakukan verifikasi
        System.out.println("\n=== FORM VERIFIKASI ===");
        System.out.println("1. Data lengkap");
        System.out.println("2. Data tidak lengkap");
        System.out.print("Pilih hasil verifikasi: ");

        int hasil = input.nextInt();

        if (hasil == 1) {
            verifikasiBerhasil();
        } else if (hasil == 2) {
            System.out.println("\nVerifikasi gagal.");
            System.out.println("Data hasil produksi belum lengkap.");
            System.out.println("Status tetap belum diverifikasi.");
        } else {
            System.out.println("Error: Pilihan tidak valid.");
        }

        input.close();
    }

    static void verifikasiBerhasil() {
        sudahDiverifikasi = true;

        System.out.println("\nHasil produksi berhasil diverifikasi.");
        System.out.println("Produk: " + namaProduk);
        System.out.println("Status verifikasi: Terverifikasi");
    }
}
