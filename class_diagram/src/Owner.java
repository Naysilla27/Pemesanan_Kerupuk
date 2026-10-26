
public class Owner extends User {
    private String Nama;
    private String Email;
    private int NoTelp;

    public Owner(
            String idUser,
            String Username,
            String Password,
            String Nama,
            String Email,
            int NoTelp) {

        super(idUser, Username, Password, "Owner");

        this.Nama = Nama;
        this.Email = Email;
        this.NoTelp = NoTelp;
    }

    public void LihatLaporan() {
    }

    public void UnduhLaporan() {
    }

    public void InputPembayaran() {
    }
}
