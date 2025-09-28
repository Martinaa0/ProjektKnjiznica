const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.json({
        message: 'Korisnici endpoint',
        users: []
    })
})

module.exports = router
