
import java.time.LocalDateTime;

public class Produksi {
    private String IdProduksi;
    private LocalDateTime TanggalProduksi;
    private int JumlahHasil;
    private String StatusProduksi;

    public Produksi(
            String IdProduksi,
            LocalDateTime TanggalProduksi,
            int JumlahHasil,
            String StatusProduksi) {

        this.IdProduksi = IdProduksi;
        this.TanggalProduksi = TanggalProduksi;
        this.JumlahHasil = JumlahHasil;
        this.StatusProduksi = StatusProduksi;
    }

    public void UpdateStatusProduksi() {
    }
}
