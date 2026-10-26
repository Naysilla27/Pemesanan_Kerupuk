
public class Produk {
    private String idProduk;
    private String NamaProduk;
    private String Jenis;
    private String Rasa;
    private String Label;
    private double Harga;

    public Produk(
            String idProduk,
            String NamaProduk,
            String Jenis,
            String Rasa,
            String Label,
            double Harga) {

        this.idProduk = idProduk;
        this.NamaProduk = NamaProduk;
        this.Jenis = Jenis;
        this.Rasa = Rasa;
        this.Label = Label;
        this.Harga = Harga;
    }

    public void UpdateHarga() {
    }

    public void UpdateDataProduk() {
    }
}
