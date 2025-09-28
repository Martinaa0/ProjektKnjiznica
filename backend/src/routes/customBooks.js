const express = require('express')
const router = express.Router()
const customBooksController = require('../controllers/customBooksController')

router.get('/', customBooksController.dohvatiMojeKnjige)

router.post('/', customBooksController.kreirajKnjigu)

router.get('/:id', customBooksController.dohvatiJednuKnjigu)

router.put('/:id', customBooksController.azurirajKnjigu)

router.delete('/:id', customBooksController.obrisiKnjigu)

module.exports = router
