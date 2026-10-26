
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Pesanan {
    private String IdPesanan;
    private LocalDateTime TanggalPesanan;
    private int Jumlah;
    private double TotalHarga;
    private String StatusPesanan;

    private Pelanggan pelanggan;
    private List<DetailPesanan> detailPesanan;
    private Pembayaran pembayaran;
    private Produksi produksi;

    public Pesanan(
            String IdPesanan,
            LocalDateTime TanggalPesanan,
            int Jumlah,
            double TotalHarga,
            String StatusPesanan) {

        this.IdPesanan = IdPesanan;
        this.TanggalPesanan = TanggalPesanan;
        this.Jumlah = Jumlah;
        this.TotalHarga = TotalHarga;
        this.StatusPesanan = StatusPesanan;

        this.detailPesanan = new ArrayList<>();
    }

    public void CreatePesanan() {
    }

    public void BatalkanPesanan() {
    }

    public void MelihatStatusPesanan() {
    }
}
