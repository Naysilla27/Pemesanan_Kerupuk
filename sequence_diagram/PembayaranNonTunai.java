
import java.util.Scanner;

public class PembayaranNonTunai {

    static Scanner input = new Scanner(System.in);
    static double totalTagihan = 50000;
    static String statusTransaksi = "Belum Lunas";

    public static void main(String[] args) {
        System.out.println("=== PEMBAYARAN NON-TUNAI ===");
        System.out.println("Total tagihan: Rp" + totalTagihan);

        System.out.println("\nPilih metode pembayaran:");
        System.out.println("1. QRIS");
        System.out.println("2. Transfer bank");
        System.out.print("Pilihan: ");

        int pilihan = input.nextInt();

        if (pilihan != 1 && pilihan != 2) {
            System.out.println("Error: Metode pembayaran tidak valid.");
            input.close();
            return;
        }

        // Menampilkan instruksi pembayaran
        if (pilihan == 1) {
            System.out.println("\nQR Code pembayaran ditampilkan.");
            System.out.println("Silakan scan QRIS untuk membayar.");
        } else {
            System.out.println("\nSilakan transfer ke rekening tujuan.");
        }

        // Simulasi pembayaran melalui sistem eksternal
        System.out.print("\nApakah pembayaran berhasil? (ya/tidak): ");
        String konfirmasi = input.next();

        if (konfirmasi.equalsIgnoreCase("ya")) {
            simpanTransaksi();
        } else {
            System.out.println("Pembayaran belum berhasil.");
            System.out.println("Status transaksi: Belum Lunas");
        }

        input.close();
    }

    static void simpanTransaksi() {
        statusTransaksi = "Lunas";

        System.out.println("\n=== BUKTI PEMBAYARAN ===");
        System.out.println("Total tagihan: Rp" + totalTagihan);
        System.out.println("Metode: Non-Tunai");
        System.out.println("Status: " + statusTransaksi);
        System.out.println("Transaksi berhasil disimpan.");
        System.out.println("Bukti pembayaran berhasil dibuat.");
    }
}
