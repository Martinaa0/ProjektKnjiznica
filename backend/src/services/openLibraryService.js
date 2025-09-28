const axios = require('axios')

const OPEN_LIBRARY_BASE_URL = 'https://openlibrary.org'
const COVERS_BASE_URL = 'https://covers.openlibrary.org'

// TODO: dodati cache, nisam jos stigla to napraviti

const apiClient = axios.create({
    timeout: 10000,
    headers: {
        'User-Agent': 'BookLibraryApp/1.0 (student.project@example.com)',
        'Accept': 'application/json'
    }
})

const pretraziKnjige = async (query, page = 1, limit = 20, sort = 'relevance') => {
    try {
        console.log('pretrazujem:', query)
        const params = {
            q: query,
            page: page,
            limit: limit,
            fields: 'key,title,author_name,first_publish_year,cover_i,isbn,subject,language,edition_count,publisher'
        }

        if (sort !== 'relevance') {
            params.sort = sort
        }

        const response = await apiClient.get(`${OPEN_LIBRARY_BASE_URL}/search.json`, { params })

        return {
            success: true,
            data: {
                books: response.data.docs || [],
                totalFound: response.data.num_found || 0,
                start: response.data.start || 0,
                page: page,
                limit: limit,
                totalPages: Math.ceil((response.data.num_found || 0) / limit)
            }
        }
    } catch (error) {
        console.error('Greska pretrazivanje knjiga:', error.message)
        return {
            success: false,
            error: 'Nije uspjelo pretraziti knjige',
            details: error.message
        }
    }
}

const pretraziPoNaslovu = async (title, page = 1, limit = 20) => {
    try {
        const params = {
            title: title,
            page: page,
            limit: limit,
            fields: 'key,title,author_name,first_publish_year,cover_i,isbn,edition_count'
        }

        const response = await apiClient.get(`${OPEN_LIBRARY_BASE_URL}/search.json`, { params })

        return {
            success: true,
            data: {
                books: response.data.docs || [],
                totalFound: response.data.num_found || 0,
                start: response.data.start || 0,
                page: page,
                limit: limit,
                totalPages: Math.ceil((response.data.num_found || 0) / limit)
            }
        }
    } catch (error) {
        console.error('Greska pretrazivanje po naslovu:', error.message)
        return {
            success: false,
            error: 'Nije uspjelo pretraziti po naslovu'
        }
    }
}

const pretraziPoAutoru = async (author, page = 1, limit = 20) => {
    try {
        const params = {
            author: author,
            page: page,
            limit: limit,
            fields: 'key,title,author_name,first_publish_year,cover_i,isbn,edition_count'
        }

        const response = await apiClient.get(`${OPEN_LIBRARY_BASE_URL}/search.json`, { params })

        return {
            success: true,
            data: {
                books: response.data.docs || [],
                totalFound: response.data.num_found || 0,
                start: response.data.start || 0,
                page: page,
                limit: limit,
                totalPages: Math.ceil((response.data.num_found || 0) / limit)
            }
        }
    } catch (error) {
        console.error('Greska pretrazivanje po autoru:', error.message)
        return {
            success: false,
            error: 'Nije uspjelo pretraziti po autoru'
        }
    }
}

const pretraziPoZanru = async (subject, page = 1, limit = 20) => {
    try {
        const params = {
            subject: subject,
            page: page,
            limit: limit,
            fields: 'key,title,author_name,first_publish_year,cover_i,isbn,subject'
        }

        const response = await apiClient.get(`${OPEN_LIBRARY_BASE_URL}/search.json`, { params })

        return {
            success: true,
            data: {
                books: response.data.docs || [],
                totalFound: response.data.num_found || 0,
                start: response.data.start || 0,
                page: page,
                limit: limit,
                totalPages: Math.ceil((response.data.num_found || 0) / limit)
            }
        }
    } catch (error) {
        console.error('Greska pretrazivanje po zanru:', error.message)
        return {
            success: false,
            error: 'Nije uspjelo pretraziti po zanru'
        }
    }
}

const dohvatiDetalje = async (workId) => {
    try {
        const response = await apiClient.get(`${OPEN_LIBRARY_BASE_URL}/works/${workId}.json`)

        return {
            success: true,
            data: response.data
        }
    } catch (error) {
        console.error('Greska dohvacanje detalja:', error.message)
        return {
            success: false,
            error: 'Nije uspjelo dohvatiti detalje knjige'
        }
    }
}

const dohvatiEditions = async (workId, limit = 10) => {
    try {
        const params = { limit }
        const response = await apiClient.get(`${OPEN_LIBRARY_BASE_URL}/works/${workId}/editions.json`, { params })

        return {
            success: true,
            data: response.data
        }
    } catch (error) {
        console.error('Greska dohvacanje edicija:', error.message)
        return {
            success: false,
            error: 'Nije uspjelo dohvatiti edicije'
        }
    }
}

const dohvatiCoverUrl = (coverId, size = 'M') => {
    if (!coverId) return null
    return `${COVERS_BASE_URL}/b/id/${coverId}-${size}.jpg`
}

const dohvatiCoverPoISBN = (isbn, size = 'M') => {
    if (!isbn) return null
    return `${COVERS_BASE_URL}/b/isbn/${isbn}-${size}.jpg`
}

// ovo sam kopirao sa stackoverflowa
// ovo sam kopirala sa stackoverflowa
const formatirajKnjigu = (book) => {
    return {
        id: book.key,
        title: book.title,
        authors: book.author_name || [],
        publishYear: book.first_publish_year,
        coverUrl: book.cover_i ? dohvatiCoverUrl(book.cover_i) : null,
        coverUrlSmall: book.cover_i ? dohvatiCoverUrl(book.cover_i, 'S') : null,
        coverUrlLarge: book.cover_i ? dohvatiCoverUrl(book.cover_i, 'L') : null,
        isbn: book.isbn || [],
        subjects: book.subject || [],
        languages: book.language || [],
        editionCount: book.edition_count,
        publishers: book.publisher || []
    }
}

const formatirajKnjige = (books) => {
    return books.map(formatirajKnjigu)
}

const dohvatiPopularne = async (limit = 20) => {
    try {
        const zanrovi = ['fiction', 'romance', 'mystery', 'science fiction', 'fantasy']
        const randomZanr = zanrovi[Math.floor(Math.random() * zanrovi.length)]

        console.log('dohvacam popularne za zanr:', randomZanr)

        const result = await pretraziPoZanru(randomZanr, 1, limit)

        if (result.success) {
            return {
                success: true,
                data: {
                    books: formatirajKnjige(result.data.books),
                    subject: randomZanr
                }
            }
        }

        return result
    } catch (error) {
        console.error('Greska dohvacanje popularnih:', error.message)
        return {
            success: false,
            error: 'Nije uspjelo dohvatiti popularne knjige'
        }
    }
}

module.exports = {
    pretraziKnjige,
    pretraziPoNaslovu,
    pretraziPoAutoru,
    pretraziPoZanru,
    dohvatiDetalje,
    dohvatiEditions,
    dohvatiCoverUrl,
    dohvatiCoverPoISBN,
    formatirajKnjigu,
    formatirajKnjige,
    dohvatiPopularne
}
