const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
require('dotenv').config()

console.log('app.js ucitan') // da vidim jel se ucitava

const app = express()

app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', require('./routes'))

app.get('/', (req, res) => {
    res.json({
        message: 'Knjiznica API radi!'
    })
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
        error: 'Nesto je poslo krivo!'
    })
})

app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta nije pronadena',
        path: req.path
    })
})

module.exports = app
