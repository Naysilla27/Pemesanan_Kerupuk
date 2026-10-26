
public class StafPenggoreng extends User {
    private String Nama;
    private String Email;
    private int NoTelp;

    public StafPenggoreng(
            String idUser,
            String Username,
            String Password,
            String Nama,
            String Email,
            int NoTelp) {

        super(idUser, Username, Password, "StafPenggoreng");

        this.Nama = Nama;
        this.Email = Email;
        this.NoTelp = NoTelp;
    }

    public void LihatPesanan() {
    }

    public void UpdateStatusPenggorengan() {
    }

    public void InputStok() {
    }
}
