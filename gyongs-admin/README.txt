# GYONGS Admin (Java Swing) — separate desktop app, same PostgreSQL DB.

## What it is
- NOT the website. The website stays HTML/CSS/JS + Node/Express.
- This app connects directly: Swing -> PostgreSQL (same gyongs_db).
- Tabs: Products (view/add/delete), Customers (view), Orders (view + status).

## Run
1. Install Java 17+.
2. Download postgresql-42.7.4.jar from https://jdbc.postgresql.org/download/
3. Put the jar inside gyongs-admin/
4. Compile + run from the project root folder:

javac -cp ".;gyongs-admin/postgresql-42.7.4.jar" gyongs-admin/Db.java gyongs-admin/MainFrame.java gyongs-admin/GyongsAdmin.java
java -cp ".;gyongs-admin;gyongs-admin/postgresql-42.7.4.jar" GyongsAdmin
