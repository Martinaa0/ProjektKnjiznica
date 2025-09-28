const express = require('express')
const router = express.Router()
const bookController = require('../controllers/bookController')

router.get('/search', bookController.pretraziKnjige)
router.get('/search/title', bookController.pretraziPoNaslovu)
router.get('/search/author', bookController.pretraziPoAutoru)
router.get('/search/subject', bookController.pretraziPoZanru)

router.get('/details/:workId', bookController.dohvatiDetalje)

router.get('/trending', bookController.dohvatiPopularne)

router.get('/', (req, res) => {
    res.json({
        message: 'Knjige API',
        endpoints: {
            pretraga: '/api/books/search?q=query&page=1&limit=20',
            poNaslovu: '/api/books/search/title?title=naslov',
            poAutoru: '/api/books/search/author?author=autor',
            poZanru: '/api/books/search/subject?subject=zanr',
            detalji: '/api/books/details/:workId',
            popularne: '/api/books/trending'
        }
    })
})

module.exports = router
