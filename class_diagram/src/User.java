
public class User {
    private String idUser;
    private String Username;
    private String Password;
    private String Role;

    public User(String idUser, String Username, String Password, String Role) {
        this.idUser = idUser;
        this.Username = Username;
        this.Password = Password;
        this.Role = Role;
    }

    public void Login() {
        System.out.println(Username + " berhasil login.");
    }

    public void Logout() {
        System.out.println(Username + " berhasil logout.");
    }
}
