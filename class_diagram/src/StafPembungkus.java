
public class StafPembungkus extends User {
    private String Nama;
    private String Email;
    private int NoTelp;

    public StafPembungkus(
            String idUser,
            String Username,
            String Password,
            String Nama,
            String Email,
            int NoTelp) {

        super(idUser, Username, Password, "StafPembungkus");

        this.Nama = Nama;
        this.Email = Email;
        this.NoTelp = NoTelp;
    }

    public void LihatPesanan() {
    }

    public void UpdateStatusProduksi() {
    }
}
