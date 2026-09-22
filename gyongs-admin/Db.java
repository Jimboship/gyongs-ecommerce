import java.io.FileInputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.Properties;

// Tiny helper: reads the SAME .env the Node backend uses,
// so admin + website always point at the same PostgreSQL DB.
public class Db {
    public String host = "localhost";
    public String port = "5432";
    public String database = "gyongs_db";
    public String user = "postgres";
    public String password = "";

    public Db() {
        try {
            Path location = Paths.get("").toAbsolutePath();
            Path env = location.resolve(".env");
            while (!Files.isRegularFile(env) && location.getParent() != null) {
                location = location.getParent();
                env = location.resolve(".env");
            }
            if (!Files.isRegularFile(env)) {
                throw new java.io.FileNotFoundException(".env was not found in the working directory or its parents");
            }
            Properties p = new Properties();
            try (FileInputStream in = new FileInputStream(env.toFile())) {
                p.load(in);
            }
            host = v(p, "PGHOST", host);
            port = v(p, "PGPORT", port);
            database = v(p, "PGDATABASE", database);
            user = v(p, "PGUSER", user);
            password = v(p, "PGPASSWORD", password);
        } catch (Exception e) {
            System.out.println("Could not read .env, using defaults: " + e.getMessage());
        }
    }

    private static String v(Properties p, String k, String d) {
        String s = p.getProperty(k);
        return (s == null || s.isBlank()) ? d : s.trim();
    }

    public Connection connect() throws Exception {
        String url = "jdbc:postgresql://" + host + ":" + port + "/" + database;
        return DriverManager.getConnection(url, user, password);
    }
}
