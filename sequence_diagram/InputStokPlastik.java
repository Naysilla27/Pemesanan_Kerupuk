
import java.util.Scanner;

public class InputStokPlastik {

    static Scanner input = new Scanner(System.in);
    static int stokPlastik = 100;

    public static void main(String[] args) {
        System.out.println("=== INPUT STOK PLASTIK ===");
        System.out.println("Stok saat ini: " + stokPlastik);

        System.out.print("Masukkan jumlah stok yang ditambahkan: ");

        if (!input.hasNextInt()) {
            System.out.println("Error: Jumlah stok harus berupa angka.");
            input.close();
            return;
        }

        int jumlah = input.nextInt();

        // Validasi data
        if (jumlah <= 0) {
            System.out.println("Error: Jumlah stok harus lebih dari 0.");
        } else {
            simpanStok(jumlah);
        }

        input.close();
    }

    static void simpanStok(int jumlah) {
        stokPlastik += jumlah;

        System.out.println("Data stok berhasil disimpan.");
        System.out.println("Sukses: Stok plastik berhasil diperbarui.");
        System.out.println("Total stok plastik: " + stokPlastik);
    }
}
