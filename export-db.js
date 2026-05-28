const mysqldump = require('mysqldump');

console.log("Memulai proses backup database 'desa_kediren'...");

mysqldump({
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'admin',
        database: 'desa_kediren',
    },
    dumpToFile: './database_backup.sql',
}).then(() => {
    console.log("✅ Berhasil! Database telah disimpan di file 'database_backup.sql'");
}).catch((err) => {
    console.error("❌ Gagal melakukan backup:", err);
});
