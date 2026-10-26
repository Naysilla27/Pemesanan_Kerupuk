
import java.time.LocalDateTime;

public class StokBahan {
    private String IdStok;
    private String JenisKerupuk;
    private int Jumlah;
    private LocalDateTime TanggalMasuk;
    private String StatusPesanan;

    public StokBahan(
            String IdStok,
            String JenisKerupuk,
            int Jumlah,
            LocalDateTime TanggalMasuk,
            String StatusPesanan) {

        this.IdStok = IdStok;
        this.JenisKerupuk = JenisKerupuk;
        this.Jumlah = Jumlah;
        this.TanggalMasuk = TanggalMasuk;
        this.StatusPesanan = StatusPesanan;
    }

    public void InputStok() {
    }
}
