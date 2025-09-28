const express = require('express')
const router = express.Router()

const knjigeRute = require('./books')
const korisniciRute = require('./users')
const mojeKnjigeRute = require('./customBooks')

router.use('/books', knjigeRute)
router.use('/users', korisniciRute)
router.use('/custom-books', mojeKnjigeRute)

router.get('/', (req, res) => {
    res.json({
        message: 'Knjiznica API',
        endpoints: {
            knjige: '/api/books',
            korisnici: '/api/users',
            mojeKnjige: '/api/custom-books'
        }
    })
})

module.exports = router
