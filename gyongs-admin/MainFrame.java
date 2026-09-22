import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.sql.*;

public class MainFrame extends JFrame {
    private final Db db;

    public MainFrame(Db db) {
        super("GYONGS Admin (Swing -> PostgreSQL)");
        this.db = db;
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setSize(860, 560);
        setLocationRelativeTo(null);
        JTabbedPane tabs = new JTabbedPane();
        tabs.addTab("Products", productsPanel());
        tabs.addTab("Customers", tablePanel(
                "SELECT id, name, email, created_at FROM users ORDER BY id",
                new String[]{"ID", "Name", "Email", "Created"}));
        tabs.addTab("Orders", ordersPanel());
        add(tabs);
    }
    private JPanel productsPanel() {
        String[] cols = {"ID", "Name", "Category", "Price", "Image"};
        DefaultTableModel model = new DefaultTableModel(cols, 0) {
            public boolean isCellEditable(int r, int c) { return false; }
        };
        JTable table = new JTable(model);
        Runnable reload = () -> {
            model.setRowCount(0);
            try (Connection c = db.connect();
                 Statement s = c.createStatement();
                 ResultSet rs = s.executeQuery("SELECT id,name,category,price,image FROM products ORDER BY id")) {
                while (rs.next()) model.addRow(new Object[]{
                        rs.getInt(1), rs.getString(2), rs.getString(3),
                        rs.getBigDecimal(4), rs.getString(5)});
            } catch (Exception e) { popup(e); }
        };
        reload.run();
        JTextField fName = new JTextField(14);
        JTextField fCat = new JTextField(8);
        JTextField fPrice = new JTextField(6);
        JTextField fImg = new JTextField(14);
        JButton add = new JButton("Add");
        add.addActionListener(e -> {
            try (Connection c = db.connect();
                 PreparedStatement ps = c.prepareStatement(
                         "INSERT INTO products(name,category,price,image) VALUES(?,?,?,?)")) {
                ps.setString(1, fName.getText().trim());
                ps.setString(2, fCat.getText().trim().toLowerCase());
                ps.setBigDecimal(3, new java.math.BigDecimal(fPrice.getText().trim()));
                ps.setString(4, fImg.getText().trim());
                ps.executeUpdate();
                reload.run();
            } catch (Exception ex) { popup(ex); }
        });
        JButton del = new JButton("Delete selected");
        del.addActionListener(e -> {
            int r = table.getSelectedRow();
            if (r < 0) return;
            try (Connection c = db.connect();
                 PreparedStatement ps = c.prepareStatement("DELETE FROM products WHERE id=?")) {
                ps.setInt(1, (int) model.getValueAt(r, 0));
                ps.executeUpdate();
                reload.run();
            } catch (Exception ex) { popup(ex); }
        });
        JPanel form = new JPanel(new FlowLayout(FlowLayout.LEFT));
        form.add(new JLabel("Name:")); form.add(fName);
        form.add(new JLabel("Cat:")); form.add(fCat);
        form.add(new JLabel("R:")); form.add(fPrice);
        form.add(new JLabel("Img:")); form.add(fImg);
        form.add(add); form.add(del);
        JPanel p = new JPanel(new BorderLayout());
        p.add(new JScrollPane(table), BorderLayout.CENTER);
        p.add(form, BorderLayout.SOUTH);
        return p;
    }

    private JPanel tablePanel(String sql, String[] cols) {
        DefaultTableModel model = new DefaultTableModel(cols, 0) {
            public boolean isCellEditable(int r, int c) { return false; }
        };
        JTable table = new JTable(model);
        try (Connection c = db.connect();
             Statement s = c.createStatement();
             ResultSet rs = s.executeQuery(sql)) {
            while (rs.next()) {
                Object[] row = new Object[cols.length];
                for (int i = 0; i < cols.length; i++) row[i] = rs.getObject(i + 1);
                model.addRow(row);
            }
        } catch (Exception e) { popup(e); }
        JPanel p = new JPanel(new BorderLayout());
        p.add(new JScrollPane(table), BorderLayout.CENTER);
        return p;
    }

    private JPanel ordersPanel() {
        String[] cols = {"ID", "User", "Total", "Status", "Created"};
        DefaultTableModel model = new DefaultTableModel(cols, 0) {
            public boolean isCellEditable(int r, int c) { return false; }
        };
        JTable table = new JTable(model);
        Runnable reload = () -> {
            model.setRowCount(0);
            try (Connection c = db.connect();
                 Statement s = c.createStatement();
                 ResultSet rs = s.executeQuery(
                         "SELECT o.id,u.email,o.total,o.status,o.created_at FROM orders o JOIN users u ON u.id=o.user_id ORDER BY o.id DESC")) {
                while (rs.next()) model.addRow(new Object[]{
                        rs.getInt(1), rs.getString(2), rs.getBigDecimal(3),
                        rs.getString(4), rs.getTimestamp(5)});
            } catch (Exception e) { popup(e); }
        };
        reload.run();
        JComboBox<String> status = new JComboBox<>(new String[]{"pending", "paid", "shipped", "cancelled"});
        JButton upd = new JButton("Set status");
        upd.addActionListener(e -> {
            int r = table.getSelectedRow();
            if (r < 0) return;
            try (Connection c = db.connect();
                 PreparedStatement ps = c.prepareStatement("UPDATE orders SET status=? WHERE id=?")) {
                ps.setString(1, (String) status.getSelectedItem());
                ps.setInt(2, (int) model.getValueAt(r, 0));
                ps.executeUpdate();
                reload.run();
            } catch (Exception ex) { popup(ex); }
        });
        JPanel south = new JPanel(new FlowLayout(FlowLayout.LEFT));
        south.add(new JLabel("Status:")); south.add(status); south.add(upd);
        JPanel p = new JPanel(new BorderLayout());
        p.add(new JScrollPane(table), BorderLayout.CENTER);
        p.add(south, BorderLayout.SOUTH);
        return p;
    }

    private void popup(Exception e) {
        JOptionPane.showMessageDialog(this, e.getMessage(), "Database error", JOptionPane.ERROR_MESSAGE);
    }
}
