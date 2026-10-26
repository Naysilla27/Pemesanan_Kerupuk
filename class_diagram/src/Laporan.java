
import java.time.LocalDateTime;

public class Laporan {
    private String idLaporan;
    private String jenisLaporan;
    private String periode;
    private double totalPendapatan;
    private LocalDateTime tanggalPembuatan;

    public Laporan(
            String idLaporan,
            String jenisLaporan,
            String periode,
            double totalPendapatan,
            LocalDateTime tanggalPembuatan) {

        this.idLaporan = idLaporan;
        this.jenisLaporan = jenisLaporan;
        this.periode = periode;
        this.totalPendapatan = totalPendapatan;
        this.tanggalPembuatan = tanggalPembuatan;
    }

    public void GenerateLaporan() {
    }

    public void UnduhLaporan() {
    }
}
