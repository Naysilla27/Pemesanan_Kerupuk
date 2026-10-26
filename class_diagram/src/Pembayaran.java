
public class Pembayaran {
    private String idPembayaran;
    private String MetodePembayaran;
    private double JumlahBayar;
    private String StatusPembayaran;

    public Pembayaran(
            String idPembayaran,
            String MetodePembayaran,
            double JumlahBayar,
            String StatusPembayaran) {

        this.idPembayaran = idPembayaran;
        this.MetodePembayaran = MetodePembayaran;
        this.JumlahBayar = JumlahBayar;
        this.StatusPembayaran = StatusPembayaran;
    }

    public void ProsesPembayaran() {
    }

    public void LihatDataPembayaran() {
    }
}
