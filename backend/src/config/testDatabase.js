const mysql = require('mysql2/promise');

async function testConnection() {
    try {
        console.log('Testiram konekciju na bazu...');

        const connection = await mysql.createConnection({
            host: '127.0.0.1',
            port: 3306,
            user: 'root',
            password: '12345',
            database: 'knjiznica'
        });

        console.log('Konekcija uspjesna!');

        const [tables] = await connection.execute("SHOW TABLES LIKE 'custom_books'");

        if (tables.length > 0) {
            console.log('custom_books tablica postoji');

            const [columns] = await connection.execute("DESCRIBE custom_books");
            console.log('Struktura tablice:');
            columns.forEach(col => {
                console.log(`  - ${col.Field}: ${col.Type}`);
            });

            const [rows] = await connection.execute("SELECT * FROM custom_books");
            console.log('Broj redova u tablici: ' + rows.length);
            if (rows.length > 0) {
                console.log('Postojece knjige:');
                rows.forEach((book, index) => {
                    console.log(`  ${index + 1}. ${book.title} by ${book.authors}`);
                });
            }
        } else {
            console.log('custom_books tablica NE postoji');
            console.log('Trebas kreirati tablicu prvo');
        }

        await connection.end();

    } catch (error) {
        console.error('Konekcija neuspjesna:', error.message);
        console.error('Provjeri MariaDB postavke');
    }
}

testConnection();
