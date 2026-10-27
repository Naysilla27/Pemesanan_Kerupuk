
import java.util.Scanner;

public class InputStokBumbu {

    static Scanner input = new Scanner(System.in);
    static int stokBumbu = 100;

    public static void main(String[] args) {

        // 1. Pilih menu Input Stok Bumbu
        System.out.println("=== INPUT STOK BUMBU ===");
        System.out.println("Stok bumbu saat ini: " + stokBumbu);

        // 2. Menekan tombol Tambah Stok Bumbu
        System.out.println("\n=== FORM INPUT STOK BUMBU ===");

        // 3. Mengisi jumlah stok lalu menekan Simpan
        System.out.print("Masukkan jumlah stok bumbu yang ditambahkan: ");

        if (!input.hasNextInt()) {
            System.out.println("Error: Jumlah stok harus berupa angka.");
            input.close();
            return;
        }

        int jumlahStok = input.nextInt();

        // Proses validasi data
        System.out.println("\nMengirim data stok ke sistem...");

        if (validasiData(jumlahStok)) {
            simpanStok(jumlahStok);

            System.out.println("Data stok berhasil disimpan.");
            System.out.println("Sukses: Stok bumbu berhasil ditambahkan.");
            System.out.println("Total stok bumbu sekarang: " + stokBumbu);
        } else {
            System.out.println("Validasi gagal.");
            System.out.println("Error: Jumlah stok harus lebih dari 0.");
        }

        input.close();
    }

    // Memeriksa validitas jumlah stok
    static boolean validasiData(int jumlah) {
        return jumlah > 0;
    }

    // Menyimpan stok ke simulasi penyimpanan sistem
    static void simpanStok(int jumlah) {
        stokBumbu += jumlah;
    }
}
