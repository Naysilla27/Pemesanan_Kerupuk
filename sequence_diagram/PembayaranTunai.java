
import java.util.Scanner;

public class PembayaranTunai {

    static Scanner input = new Scanner(System.in);

    static double totalTagihan = 50000;
    static double nominalUang;
    static double kembalian;
    static String statusTransaksi = "Belum Lunas";

    public static void main(String[] args) {

        // 1. Buka halaman pembayaran
        System.out.println("=== HALAMAN PEMBAYARAN ===");

        // 2. Request data tagihan
        tampilkanTagihan();

        // 3. Pilih metode pembayaran
        System.out.println("\nPilih metode pembayaran:");
        System.out.println("1. Tunai");
        System.out.println("2. Non-Tunai");
        System.out.print("Pilihan: ");

        int pilihan = input.nextInt();

        if (pilihan == 1) {
            pembayaranTunai();
        } else if (pilihan == 2) {
            System.out.println("Silakan gunakan menu Pembayaran Non-Tunai.");
        } else {
            System.out.println("Error: Metode pembayaran tidak valid.");
        }

        input.close();
    }

    // Menampilkan total tagihan dan metode pembayaran
    static void tampilkanTagihan() {
        System.out.println("Total tagihan: Rp" + totalTagihan);
        System.out.println("Metode: Tunai / Non-Tunai");
    }

    // Proses pembayaran tunai
    static void pembayaranTunai() {

        // 4. Tampilkan instruksi serahkan uang
        System.out.println("\n=== PEMBAYARAN TUNAI ===");
        System.out.println("Silakan serahkan uang kepada owner.");

        // 5. Input nominal uang diterima
        System.out.print("Masukkan nominal uang diterima: Rp");

        if (!input.hasNextDouble()) {
            System.out.println("Error: Nominal harus berupa angka.");
            input.next();
            return;
        }

        nominalUang = input.nextDouble();

        // 6. Kirim nominal dan konfirmasi
        System.out.println("\nMemproses pembayaran...");

        // 7. Validasi nominal
        if (nominalUang < totalTagihan || nominalUang <= 0) {
            System.out.println("Error: Uang yang diterima tidak mencukupi.");
            System.out.println("Pembayaran gagal.");
            return;
        }

        // Menghitung kembalian
        kembalian = nominalUang - totalTagihan;

        // 8. Simpan transaksi tunai
        statusTransaksi = "Lunas";

        System.out.println("\n=== BUKTI PEMBAYARAN ===");
        System.out.println("Total tagihan : Rp" + totalTagihan);
        System.out.println("Uang diterima : Rp" + nominalUang);
        System.out.println("Kembalian     : Rp" + kembalian);
        System.out.println("Status        : " + statusTransaksi);
        System.out.println("Transaksi berhasil disimpan.");
        System.out.println("Pembayaran tunai berhasil.");
    }
}
