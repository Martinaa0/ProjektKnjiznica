<template>
  <div class="container" style="padding: 24px 20px;">
    <h1 style="margin-bottom: 8px;">Pretrazivanje knjiga</h1>
    <p style="color: #666; margin-bottom: 24px;">Pronadite svoju sljedecu omiljenu knjigu</p>

    <!-- Pretraga i sort -->
    <div class="pretraga-sekcija">
      <div class="search-bar">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Pretrazi knjige, autore, zanrove..."
          @keyup.enter="performSearch"
        />
        <button
          @click="performSearch"
          class="btn btn-primary"
          :disabled="!searchQuery || !searchQuery.trim()"
        >
          Pretrazi
        </button>
      </div>

      <div class="sort-wrapper">
        <label>Sortiraj:</label>
        <select v-model="sortBy" @change="applySort">
          <option value="relevance">Najrelevantnije</option>
          <option value="new">Najnovije</option>
          <option value="old">Najstarije</option>
        </select>
      </div>
    </div>

    <!-- Filteri -->
    <div class="kartica filter-row" style="padding: 12px; margin-bottom: 16px;">
      <div class="filter-inputs">
        <div>
          <label>Autor:</label>
          <input
            type="text"
            v-model="filters.author"
            placeholder="Ime autora..."
            @keyup.enter="applyFilters"
          />
        </div>
        <div>
          <label>Zanr:</label>
          <select v-model="filters.subject" @change="applyFilters">
            <option value="">-- Odaberi --</option>
            <option v-for="zanr in zanrovi" :key="zanr" :value="zanr">{{ zanr }}</option>
          </select>
        </div>
        <div>
          <button @click="applyFilters" class="btn btn-primary" style="margin-top: 20px;">
            Filtriraj
          </button>
        </div>
      </div>
    </div>

    <!-- Info o rezultatima -->
    <div v-if="searchPerformed && !loading" style="margin-bottom: 16px; color: #666;">
      <span v-if="books.length > 0">
        Prikazujem {{ books.length }} od {{ totalFound }} rezultata
        <span v-if="searchQuery"> za "<strong>{{ searchQuery }}</strong>"</span>
      </span>
      <span v-else>
        Nema rezultata
        <span v-if="searchQuery"> za "<strong>{{ searchQuery }}</strong>"</span>
      </span>
    </div>

    <!-- Ucitavanje -->
    <div v-if="loading" style="text-align: center; padding: 60px;">
      <p>{{ loadingMessage }}</p>
    </div>

    <!-- Grid knjiga -->
    <div v-else-if="books.length > 0" class="knjige-grid">
      <BookCard
        v-for="book in books"
        :key="book.id"
        :book="book"
        @click="goToBookDetails(book)"
      />
    </div>

    <!-- Prazno stanje -->
    <div v-else-if="searchPerformed" style="text-align: center; padding: 60px;">
      <h3>Nema rezultata</h3>
      <p style="color: #666; margin-top: 8px;">Pokusajte drugaciji upit za pretrazivanje.</p>
      <button @click="clearAllFilters" class="btn btn-outline" style="margin-top: 16px;">
        Ocisti filtere
      </button>
    </div>

    <!-- Dobrodoslica -->
    <div v-else-if="!searchPerformed && !loading" style="text-align: center; padding: 60px;">
      <h3>Pretrazite nasu knjiznicuu</h3>
      <p style="color: #666; margin-top: 8px;">Unesite pojam za pretrazivanje iznad</p>

      <div style="margin-top: 24px;">
        <p style="margin-bottom: 12px; font-weight: 500;">Popularne pretrage:</p>
        <div class="popular-tags">
          <span
            v-for="term in popularnePretrage"
            :key="term"
            class="badge"
            style="cursor: pointer; margin: 4px;"
            @click="quickSearch(term)"
          >
            {{ term }}
          </span>
        </div>
      </div>
    </div>

    <!-- Paginacija -->
    <div v-if="totalPages > 1" style="display: flex; justify-content: center; margin-top: 32px; gap: 16px; align-items: center;">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage <= 1" class="btn btn-outline">
        Prethodna
      </button>
      <span>Stranica {{ currentPage }} od {{ totalPages }}</span>
      <button @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages" class="btn btn-outline">
        Sljedeca
      </button>
    </div>
  </div>
</template>

<script>
import { pretraziKnjige, pretraziPoAutoru, pretraziPoZanru } from '@/services/bookService'
import { PORUKE_UCITAVANJE } from '@/utils/constants'
import BookCard from '@/components/common/BookCard.vue'

let x = 0 // ovo sam zaboravila obrisat

export default {
  name: 'Books',
  components: {
    BookCard
  },
  data() {
    return {
      searchQuery: '',
      searchPerformed: false,
      filters: {
        author: '',
        subject: ''
      },
      books: [],
      totalFound: 0,
      currentPage: 1,
      totalPages: 0,
      loading: false,
      error: null,
      loadingMessage: 'Pretrazujem knjige...',
      sortBy: 'relevance',
      zanrovi: [
        'fiction', 'romance', 'mystery', 'science fiction', 'fantasy',
        'thriller', 'biography', 'history', 'poetry', 'drama'
      ],
      popularnePretrage: [
        'Harry Potter', 'Science Fiction', 'Romance', 'Mystery',
        'Fantasy', 'Biography', 'History'
      ]
    }
  },

  watch: {
    '$route.query': {
      handler() {
        this.handleRouteQuery()
      },
      immediate: true
    }
  },

  methods: {
    handleRouteQuery() {
      const { q, author, subject, page } = this.$route.query

      if (q) {
        this.searchQuery = q
        this.performSearch()
      } else if (author) {
        this.filters.author = author
        this.applyFilters()
      } else if (subject) {
        this.filters.subject = subject
        this.applyFilters()
      }

      if (page) {
        this.currentPage = parseInt(page) || 1
      }
    },

    async performSearch(page = 1) {
      if (!this.searchQuery.trim()) return

      this.loading = true
      this.error = null
      this.searchPerformed = true
      this.loadingMessage = PORUKE_UCITAVANJE
        ? PORUKE_UCITAVANJE[Math.floor(Math.random() * PORUKE_UCITAVANJE.length)]
        : 'Pretrazujem knjige...'

      try {
        const response = await pretraziKnjige(this.searchQuery, page, 20, this.sortBy)

        if (response.success) {
          this.books = response.data.books || []
          this.totalFound = response.data.totalFound || 0
          this.totalPages = response.data.totalPages || 0
          this.currentPage = page
        } else {
          throw new Error(response.error || 'Pretrazivanje neuspjesno')
        }
      } catch (error) {
        console.error('Greska pretrazivanja:', error)
        this.error = error.message
        this.books = []
      } finally {
        this.loading = false
      }
    },

    async applyFilters() {
      if (!this.filters.author && !this.filters.subject) return

      this.loading = true
      this.searchPerformed = true

      try {
        let response

        if (this.filters.author) {
          response = await pretraziPoAutoru(this.filters.author, 1, 20)
        } else if (this.filters.subject) {
          response = await pretraziPoZanru(this.filters.subject, 1, 20)
        }

        if (response && response.success) {
          this.books = response.data.books || []
          this.totalFound = response.data.totalFound || 0
          this.totalPages = response.data.totalPages || 0
        }
      } catch (error) {
        console.error('Greska filtriranja:', error)
        this.books = []
      } finally {
        this.loading = false
      }
    },

    clearSearch() {
      this.searchQuery = ''
      this.books = []
      this.searchPerformed = false
    },

    clearAllFilters() {
      this.searchQuery = ''
      this.filters.author = ''
      this.filters.subject = ''
      this.books = []
      this.searchPerformed = false
    },

    applySort() {
      if (this.searchQuery) {
        this.performSearch()
      }
    },

    changePage(page) {
      this.currentPage = page
      if (this.searchQuery) {
        this.performSearch(page)
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    quickSearch(term) {
      this.searchQuery = term
      this.performSearch()
    },

    goToBookDetails(book) {
      const workId = book.id.split('/').pop()
      this.$router.push(`/books/${workId}`)
    }
  }
}
</script>

<style scoped>
.pretraga-sekcija {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  align-items: flex-end;
}

.search-bar {
  flex: 1;
  display: flex;
  gap: 8px;
}

.search-bar input {
  flex: 1;
}

.sort-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sort-wrapper label {
  font-size: 13px;
  color: #666;
}

.sort-wrapper select {
  width: 180px;
}

.filter-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 12px;
  align-items: end;
}

.filter-inputs label {
  display: block;
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
}

.popular-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
}

@media (max-width: 768px) {
  .pretraga-sekcija {
    flex-direction: column;
  }

  .filter-inputs {
    grid-template-columns: 1fr;
  }

  .sort-wrapper select {
    width: 100%;
  }
}
</style>
