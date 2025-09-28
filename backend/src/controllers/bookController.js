const openLibraryService = require('../services/openLibraryService')

// ovo sam napisala za pretrazivanje knjiga
const pretraziKnjige = async (req, res) => {
    try {
        const q = req.query.q
        const page = req.query.page || 1
        const limit = req.query.limit || 20
        const sort = req.query.sort || 'relevance'

        if (!q) {
            return res.status(400).json({
                success: false,
                error: 'Upit za pretrazivanje je obavezan'
            })
        }

        const result = await openLibraryService.pretraziKnjige(q, parseInt(page), parseInt(limit), sort)

        if (result.success) {
            result.data.books = openLibraryService.formatirajKnjige(result.data.books)
        }

        res.json(result)
    } catch (error) {
        console.error('Greska pri pretrazivanju:', error)
        res.status(500).json({
            success: false,
            error: 'Greska na serveru'
        })
    }
}

const pretraziPoNaslovu = async (req, res) => {
    try {
        const title = req.query.title
        const page = req.query.page || 1
        let limit = req.query.limit || 20

        if (!title) {
            return res.status(400).json({
                success: false,
                error: 'Naslov je obavezan'
            })
        }

        const result = await openLibraryService.pretraziPoNaslovu(title, parseInt(page), parseInt(limit))

        if (result.success) {
            result.data.books = openLibraryService.formatirajKnjige(result.data.books)
        }

        res.json(result)
    } catch (error) {
        console.error('Greska pretrazivanje po naslovu:', error)
        res.status(500).json({
            success: false,
            error: 'Greska na serveru'
        })
    }
}

const pretraziPoAutoru = async (req, res) => {
    try {
        const author = req.query.author
        const page = req.query.page || 1
        const limit = req.query.limit || 20

        if (!author) {
            return res.status(400).json({
                success: false,
                error: 'Autor je obavezan'
            })
        }

        const result = await openLibraryService.pretraziPoAutoru(author, parseInt(page), parseInt(limit))

        if (result.success) {
            result.data.books = openLibraryService.formatirajKnjige(result.data.books)
        }

        res.json(result)
    } catch (error) {
        console.error('Greska pretrazivanje po autoru:', error)
        res.status(500).json({
            success: false,
            error: 'Greska na serveru'
        })
    }
}

const pretraziPoZanru = async (req, res) => {
    try {
        const subject = req.query.subject
        const page = req.query.page || 1
        const limit = req.query.limit || 20

        if (!subject) {
            return res.status(400).json({
                success: false,
                error: 'Zanr je obavezan'
            })
        }

        const result = await openLibraryService.pretraziPoZanru(subject, parseInt(page), parseInt(limit))

        if (result.success) {
            result.data.books = openLibraryService.formatirajKnjige(result.data.books)
        }

        res.json(result)
    } catch (error) {
        console.error('Greska pretrazivanje po zanru:', error)
        res.status(500).json({
            success: false,
            error: 'Greska na serveru'
        })
    }
}

const dohvatiDetalje = async (req, res) => {
    try {
        const workId = req.params.workId

        const result = await openLibraryService.dohvatiDetalje(workId)

        res.json(result)
    } catch (error) {
        console.error('Greska dohvacanje detalja:', error)
        res.status(500).json({
            success: false,
            error: 'Greska na serveru'
        })
    }
}

const dohvatiPopularne = async (req, res) => {
    try {
        const limit = req.query.limit || 20

        const result = await openLibraryService.dohvatiPopularne(parseInt(limit))

        res.json(result)
    } catch (error) {
        console.error('Greska dohvacanje popularnih:', error)
        res.status(500).json({
            success: false,
            error: 'Greska na serveru'
        })
    }
}

module.exports = {
    pretraziKnjige,
    pretraziPoNaslovu,
    pretraziPoAutoru,
    pretraziPoZanru,
    dohvatiDetalje,
    dohvatiPopularne
}
