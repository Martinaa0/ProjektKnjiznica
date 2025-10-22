<template>
  <div>
    <!-- Hero sekcija -->
    <div class="hero-sekcija">
      <h1>Knjiznica</h1>
      <p>Pretrazite knjige i dodajte ih u svoju biblioteku.</p>

      <div class="hero-pretraga">
        <input
          type="text"
          v-model="heroSearchQuery"
          placeholder="Pretrazi knjige..."
          @keyup.enter="searchFromHero"
        />
        <button
          @click="searchFromHero"
          class="btn btn-primary"
          :disabled="!heroSearchQuery || !heroSearchQuery.trim()"
        >
          Pretrazi
        </button>
      </div>
    </div>

    <!-- Popularne knjige -->
    <div class="container" style="padding: 30px 20px;">
      <h2 style="margin-bottom: 16px;">Popularne knjige</h2>

      <div v-if="loadingTrending" style="text-align: center; padding: 40px;">
        <p>Ucitavam...</p>
      </div>

      <div v-else class="knjige-grid">
        <BookCard
          v-for="book in trendingBooks"
          :key="book.id"
          :book="book"
          @click="goToBookDetails(book)"
        />
      </div>
    </div>

    <!-- Zanrovi -->
    <div class="container" style="padding: 20px;">
      <h2 style="margin-bottom: 16px;">Zanrovi</h2>

      <div class="zanrovi-grid">
        <div
          v-for="zanr in popularniZanrovi"
          :key="zanr"
          class="zanr-link"
          @click="searchByGenre(zanr)"
        >
          {{ zanr }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BookCard from '@/components/common/BookCard.vue'
import { dohvatiPopularne } from '@/services/bookService'

export default {
  name: 'HomeView',
  components: {
    BookCard
  },
  data() {
    return {
      heroSearchQuery: '',
      trendingBooks: [],
      loadingTrending: false,

      popularniZanrovi: [
        'fiction', 'romance', 'mystery', 'science fiction',
        'fantasy', 'biography', 'history', 'thriller'
      ]
    }
  },

  async mounted() {
    await this.loadTrendingBooks()
  },

  methods: {
    async loadTrendingBooks() {
      this.loadingTrending = true
      try {
        const response = await dohvatiPopularne(12)
        if (response.success && response.data.books) {
          this.trendingBooks = response.data.books
        }
      } catch (error) {
        console.error('Greska ucitavanje popularnih knjiga:', error)
        this.trendingBooks = [
          {
            id: '/works/OL82563W',
            title: 'Harry Potter and the Philosopher\'s Stone',
            authors: ['J. K. Rowling'],
            publishYear: 1997,
            coverUrl: 'https://covers.openlibrary.org/b/id/8739161-M.jpg'
          },
          {
            id: '/works/OL27448W',
            title: 'The Lord of the Rings',
            authors: ['J. R. R. Tolkien'],
            publishYear: 1954,
            coverUrl: 'https://covers.openlibrary.org/b/id/258027-M.jpg'
          }
        ]
      } finally {
        this.loadingTrending = false
      }
    },

    searchFromHero() {
      if (this.heroSearchQuery && this.heroSearchQuery.trim()) {
        this.$router.push({
          name: 'Books',
          query: { q: this.heroSearchQuery.trim() }
        })
      }
    },

    searchByGenre(genre) {
      this.$router.push({
        name: 'Books',
        query: { subject: genre }
      })
    },

    goToBookDetails(book) {
      const workId = book.id.split('/').pop()
      this.$router.push(`/books/${workId}`)
    }
  }
}
</script>

<style scoped>
.hero-sekcija {
  background-color: #1976D2;
  color: white;
  text-align: center;
  padding: 50px 20px;
}

.hero-sekcija h1 {
  font-size: 2rem;
  margin-bottom: 8px;
}

.hero-sekcija p {
  margin-bottom: 20px;
  opacity: 0.9;
}

.hero-pretraga {
  display: flex;
  max-width: 450px;
  margin: 0 auto;
  gap: 8px;
}

.hero-pretraga input {
  flex: 1;
  padding: 10px 14px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
}

.zanrovi-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.zanr-link {
  padding: 6px 14px;
  background-color: #e3f2fd;
  border: 1px solid #90caf9;
  border-radius: 16px;
  font-size: 13px;
  color: #1976D2;
  cursor: pointer;
}

.zanr-link:hover {
  background-color: #bbdefb;
}

@media (max-width: 768px) {
  .hero-pretraga {
    flex-direction: column;
  }
}
</style>
