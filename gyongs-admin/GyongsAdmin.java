// GyongsAdmin launcher — separate admin desktop app (NOT the website).
// Run from the project root folder (see gyongs-admin/README.txt).
import javax.swing.SwingUtilities;

public class GyongsAdmin {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            Db db = new Db(); // reads PGHOST/PGPORT/PGDATABASE/PGUSER/PGPASSWORD from .env
            new MainFrame(db).setVisible(true);
        });
    }
}
