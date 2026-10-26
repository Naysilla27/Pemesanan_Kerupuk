
public class Pelanggan extends User {
    private String Nama;
    private String Alamat;
    private int NoTelp;
    private String Email;

    public Pelanggan(
            String idUser,
            String Username,
            String Password,
            String Nama,
            String Alamat,
            int NoTelp,
            String Email) {

        super(idUser, Username, Password, "Pelanggan");

        this.Nama = Nama;
        this.Alamat = Alamat;
        this.NoTelp = NoTelp;
        this.Email = Email;
    }

    public void MemesanProduk() {
    }

    public void LihatPesanan() {
    }

    public void MelakukanPembayaran() {
    }
}
