const pool = require('../config/database');

var test = 'test' // zaboravila obrisat

// ovo sam napisala za dohvacanje knjiga iz baze
const dohvatiMojeKnjige = async (req, res) => {
    try {
        const [knjige] = await pool.execute(
            'SELECT * FROM custom_books ORDER BY created_date DESC'
        );

        const formatiraneKnjige = knjige.map(knjiga => ({
            id: knjiga.id,
            title: knjiga.title,
            authors: knjiga.authors ? JSON.parse(knjiga.authors) : ['Nepoznat autor'],
            publishYear: knjiga.publish_year,
            genre: knjiga.genre,
            description: knjiga.description,
            status: knjiga.status,
            isCustom: true,
            createdDate: knjiga.created_date,
            updatedDate: knjiga.updated_date
        }));

        res.json({
            success: true,
            data: {
                books: formatiraneKnjige,
                count: formatiraneKnjige.length
            }
        });
    } catch (error) {
        console.error('Greska dohvacanje knjiga:', error);
        res.status(500).json({
            success: false,
            error: 'Nije uspjelo dohvatiti knjige'
        });
    }
};

// kreiraj novu knjigu
const kreirajKnjigu = async (req, res) => {
    try {
        const title = req.body.title
        const authors = req.body.authors
        const publishYear = req.body.publishYear
        const genre = req.body.genre
        const description = req.body.description
        const status = req.body.status || 'want-to-read'

        console.log('Kreiram knjigu:', req.body); // TODO: maknuti ovo kad zavrsim

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                error: 'Naslov je obavezan'
            });
        }

        const customId = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        let autoriArray = [];
        if (Array.isArray(authors)) {
            autoriArray = authors.filter(autor => autor && autor.trim());
        } else if (authors && typeof authors === 'string') {
            autoriArray = [authors.trim()];
        }

        if (autoriArray.length === 0) {
            autoriArray = ['Nepoznat autor'];
        }

        const [result] = await pool.execute(
            `INSERT INTO custom_books
             (id, title, authors, publish_year, genre, description, status, created_date, updated_date)
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
                customId,
                title.trim(),
                JSON.stringify(autoriArray),
                publishYear || null,
                genre || null,
                description || null,
                status
            ]
        );

        const [kreiranaKnjiga] = await pool.execute(
            'SELECT * FROM custom_books WHERE id = ?',
            [customId]
        );

        if (kreiranaKnjiga.length === 0) {
            throw new Error('Nije uspjelo dohvatiti kreiranu knjigu');
        }

        const knjiga = kreiranaKnjiga[0];
        const formatiranaKnjiga = {
            id: knjiga.id,
            title: knjiga.title,
            authors: JSON.parse(knjiga.authors),
            publishYear: knjiga.publish_year,
            genre: knjiga.genre,
            description: knjiga.description,
            status: knjiga.status,
            isCustom: true,
            createdDate: knjiga.created_date,
            updatedDate: knjiga.updated_date
        };

        console.log('Knjiga kreirana:', formatiranaKnjiga);

        res.status(201).json({
            success: true,
            data: {
                book: formatiranaKnjiga
            }
        });
    } catch (error) {
        console.error('Greska kreiranje knjige:', error);
        res.status(500).json({
            success: false,
            error: 'Nije uspjelo kreirati knjigu'
        });
    }
};

// azuriraj knjigu
const azurirajKnjigu = async (req, res) => {
    try {
        const { id } = req.params;
        const title = req.body.title
        const authors = req.body.authors
        const publishYear = req.body.publishYear
        const genre = req.body.genre
        const description = req.body.description
        const status = req.body.status

        console.log('Azuriram knjigu:', id);

        const [postojecaKnjiga] = await pool.execute(
            'SELECT * FROM custom_books WHERE id = ?',
            [id]
        );

        if (postojecaKnjiga.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Knjiga nije pronadena'
            });
        }

        const updates = {};
        if (title !== undefined) updates.title = title.trim();
        if (authors !== undefined) {
            let autoriArray = Array.isArray(authors) ? authors : [authors];
            autoriArray = autoriArray.filter(autor => autor && autor.trim());
            if (autoriArray.length === 0) autoriArray = ['Nepoznat autor'];
            updates.authors = JSON.stringify(autoriArray);
        }
        if (publishYear !== undefined) updates.publish_year = publishYear || null;
        if (genre !== undefined) updates.genre = genre || null;
        if (description !== undefined) updates.description = description || null;
        if (status !== undefined) updates.status = status;

        const updateFields = Object.keys(updates);
        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Nema polja za azuriranje'
            });
        }

        const setClause = updateFields.map(field => `${field} = ?`).join(', ');
        const values = updateFields.map(field => updates[field]);
        values.push(id);

        await pool.execute(
            `UPDATE custom_books SET ${setClause}, updated_date = NOW() WHERE id = ?`,
            values
        );

        const [azuriranaKnjiga] = await pool.execute(
            'SELECT * FROM custom_books WHERE id = ?',
            [id]
        );

        const knjiga = azuriranaKnjiga[0];
        const formatiranaKnjiga = {
            id: knjiga.id,
            title: knjiga.title,
            authors: JSON.parse(knjiga.authors),
            publishYear: knjiga.publish_year,
            genre: knjiga.genre,
            description: knjiga.description,
            status: knjiga.status,
            isCustom: true,
            createdDate: knjiga.created_date,
            updatedDate: knjiga.updated_date
        };

        res.json({
            success: true,
            data: {
                book: formatiranaKnjiga
            }
        });
    } catch (error) {
        console.error('Greska azuriranje knjige:', error);
        res.status(500).json({
            success: false,
            error: 'Nije uspjelo azurirati knjigu'
        });
    }
};

// obrisi knjigu
const obrisiKnjigu = async (req, res) => {
    try {
        const { id } = req.params;

        console.log('Brisem knjigu:', id);

        const [postojecaKnjiga] = await pool.execute(
            'SELECT * FROM custom_books WHERE id = ?',
            [id]
        );

        if (postojecaKnjiga.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Knjiga nije pronadena'
            });
        }

        await pool.execute(
            'DELETE FROM custom_books WHERE id = ?',
            [id]
        );

        const knjiga = postojecaKnjiga[0];
        const formatiranaKnjiga = {
            id: knjiga.id,
            title: knjiga.title,
            authors: JSON.parse(knjiga.authors),
            publishYear: knjiga.publish_year,
            genre: knjiga.genre,
            description: knjiga.description,
            status: knjiga.status,
            isCustom: true,
            createdDate: knjiga.created_date,
            updatedDate: knjiga.updated_date
        };

        res.json({
            success: true,
            data: {
                book: formatiranaKnjiga
            }
        });
    } catch (error) {
        console.error('Greska brisanje knjige:', error);
        res.status(500).json({
            success: false,
            error: 'Nije uspjelo obrisati knjigu'
        });
    }
};

// dohvati jednu knjigu po id-u
const dohvatiJednuKnjigu = async (req, res) => {
    try {
        const { id } = req.params;

        const [knjiga] = await pool.execute(
            'SELECT * FROM custom_books WHERE id = ?',
            [id]
        );

        if (knjiga.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Knjiga nije pronadena'
            });
        }

        const podaci = knjiga[0];
        const formatiranaKnjiga = {
            id: podaci.id,
            title: podaci.title,
            authors: JSON.parse(podaci.authors),
            publishYear: podaci.publish_year,
            genre: podaci.genre,
            description: podaci.description,
            status: podaci.status,
            isCustom: true,
            createdDate: podaci.created_date,
            updatedDate: podaci.updated_date
        };

        res.json({
            success: true,
            data: {
                book: formatiranaKnjiga
            }
        });
    } catch (error) {
        console.error('Greska dohvacanje knjige:', error);
        res.status(500).json({
            success: false,
            error: 'Nije uspjelo dohvatiti knjigu'
        });
    }
};

module.exports = {
    dohvatiMojeKnjige,
    kreirajKnjigu,
    azurirajKnjigu,
    obrisiKnjigu,
    dohvatiJednuKnjigu
};
