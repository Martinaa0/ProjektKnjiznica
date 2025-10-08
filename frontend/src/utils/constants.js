export const API_ENDPOINTS = {
  BOOKS: {
    SEARCH: '/books/search',
    SEARCH_BY_TITLE: '/books/search/title',
    SEARCH_BY_AUTHOR: '/books/search/author',
    SEARCH_BY_SUBJECT: '/books/search/subject',
    DETAILS: '/books/details',
    TRENDING: '/books/trending'
  }
}

export const PORUKE_UCITAVANJE = [
  'Pretrazujem knjige...',
  'Trazim knjige...',
  'Ucitavam podatke...'
]

export const SORTIRANJE = [
  { value: 'relevance', text: 'Najrelevantnije' },
  { value: 'new', text: 'Najnovije' },
  { value: 'old', text: 'Najstarije' },
  { value: 'rating', text: 'Najbolje ocijenjene' }
]

export const POPULARNI_ZANROVI = [
  'fiction',
  'romance',
  'mystery',
  'science fiction',
  'fantasy',
  'thriller',
  'biography',
  'history',
  'poetry',
  'drama',
  'horror',
  'adventure'
]
