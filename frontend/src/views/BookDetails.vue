<template>
  <div class="container" style="padding: 24px 20px;">
    <!-- Ucitavanje -->
    <div v-if="loading" style="text-align: center; padding: 80px;">
      <p>Ucitavam detalje knjige...</p>
    </div>

    <!-- Greska -->
    <div v-else-if="error" style="text-align: center; padding: 40px;">
      <h3 style="color: #f44336;">Greska pri ucitavanju</h3>
      <p>{{ error }}</p>
      <div style="margin-top: 16px;">
        <button @click="loadBookDetails" class="btn btn-primary" style="margin-right: 8px;">
          Pokusaj ponovo
        </button>
        <router-link to="/books" class="btn btn-outline">Natrag na knjige</router-link>
      </div>
    </div>

    <!-- Detalji knjige -->
    <div v-else-if="book" class="book-layout">
      <!-- Slika -->
      <div class="book-cover-col">
        <div class="kartica" style="overflow: hidden;">
          <img
            v-if="bookCoverUrl"
            :src="bookCoverUrl"
            :alt="book.title"
            class="detail-cover"
          />
          <div v-else class="cover-placeholder">
            Nema slike
          </div>
        </div>

        <!-- Dodaj u biblioteku -->
        <div style="margin-top: 16px;">
          <button
            @click="toggleLibrary"
            class="btn"
            :class="isInLibrary ? 'btn-primary' : 'btn-outline'"
            style="width: 100%; padding: 12px;"
          >
            {{ isInLibrary ? 'U biblioteci' : 'Dodaj u biblioteku' }}
          </button>

          <div v-if="isInLibrary" style="margin-top: 8px;">
            <label style="font-size: 13px; color: #666;">Status:</label>
            <select v-model="bookStatus" @change="updateBookStatus(bookStatus)" style="margin-top: 4px;">
              <option value="want-to-read">Zelim procitati</option>
              <option value="currently-reading">Trenutno citam</option>
              <option value="read">Procitano</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Info -->
      <div class="book-info-col">
        <h1>{{ book.title }}</h1>

        <div v-if="book.subtitle" style="font-size: 18px; color: #666; margin-top: 8px;">
          {{ book.subtitle }}
        </div>

        <div class="book-meta" style="margin-top: 16px;">
          <div v-if="formattedAuthors" style="font-size: 16px; margin-bottom: 8px;">
            Autor:
            <span v-for="(author, index) in book.authors" :key="index">
              <router-link :to="`/books?author=${author.name || author}`">
                {{ author.name || author }}
              </router-link>
              <span v-if="index < book.authors.length - 1">, </span>
            </span>
          </div>

          <div v-if="book.first_publish_date" style="margin-bottom: 4px; color: #666;">
            Prvo izdanje: {{ book.first_publish_date }}
          </div>
        </div>

        <!-- Opis -->
        <div v-if="book.description" style="margin-top: 24px;">
          <h2 style="margin-bottom: 8px;">Opis</h2>
          <div class="opis-tekst">
            <div v-if="showFullDescription || opisTekst.length < 500">
              {{ opisTekst }}
            </div>
            <div v-else>
              {{ opisTekst.substring(0, 500) }}...
              <button @click="showFullDescription = true" class="btn btn-outline" style="margin-left: 8px; padding: 2px 8px; font-size: 12px;">
                Prikazi vise
              </button>
            </div>
          </div>
        </div>

        <!-- Zanrovi -->
        <div v-if="book.subjects && book.subjects.length" style="margin-top: 24px;">
          <h3 style="margin-bottom: 8px;">Zanrovi i teme</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            <router-link
              v-for="subject in book.subjects.slice(0, 15)"
              :key="subject"
              :to="`/books?subject=${subject}`"
              class="badge"
            >
              {{ subject }}
            </router-link>
          </div>
        </div>

        <!-- Povezane knjige -->
        <div v-if="relatedBooks.length > 0" style="margin-top: 32px;">
          <h3 style="margin-bottom: 12px;">Mozda ce vam se svidjeti</h3>
          <div class="knjige-grid" style="grid-template-columns: repeat(4, 1fr);">
            <BookCard
              v-for="relatedBook in relatedBooks.slice(0, 4)"
              :key="relatedBook.id"
              :book="relatedBook"
              @click="goToBook(relatedBook)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { dohvatiDetaljeKnjige, pretraziPoAutoru, pretraziPoZanru } from '@/services/bookService'
import BookCard from '@/components/common/BookCard.vue'

export default {
  name: 'BookDetails',
  components: {
    BookCard
  },
  props: {
    workId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      book: null,
      loading: false,
      error: null,
      showFullDescription: false,
      isInLibrary: false,
      bookStatus: 'want-to-read',
      relatedBooks: []
    }
  },
  computed: {
    bookCoverUrl() {
      if (this.book?.covers && this.book.covers.length > 0) {
        return `https://covers.openlibrary.org/b/id/${this.book.covers[0]}-L.jpg`
      }
      return null
    },

    formattedAuthors() {
      if (!this.book?.authors) return ''
      return this.book.authors.map(author => author.name || author).join(', ')
    },

    opisTekst() {
      if (!this.book?.description) return ''
      return typeof this.book.description === 'object' ? this.book.description.value : this.book.description
    }
  },
  async mounted() {
    await this.loadBookDetails()
    this.checkLibraryStatus()
  },
  watch: {
    workId() {
      this.loadBookDetails()
    }
  },
  methods: {
    async loadBookDetails() {
      this.loading = true
      this.error = null

      try {
        const response = await dohvatiDetaljeKnjige(this.workId)

        if (response.success) {
          this.book = response.data
          await this.loadRelatedBooks()
        } else {
          throw new Error(response.error || 'Nije uspjelo ucitati detalje')
        }
      } catch (error) {
        console.error('Greska ucitavanje detalja:', error)
        this.error = error.message || 'Nije uspjelo ucitati detalje knjige'
      } finally {
        this.loading = false
      }
    },

    async loadRelatedBooks() {
      if (!this.book) return

      try {
        var relatedResponse = null // nisam sigurna dal ovo treba bit var

        if (this.book.authors && this.book.authors.length > 0) {
          const authorName = this.book.authors[0].name || this.book.authors[0]
          relatedResponse = await pretraziPoAutoru(authorName, 1, 8)
        }

        if (!relatedResponse || !relatedResponse.success || relatedResponse.data.books.length < 2) {
          if (this.book.subjects && this.book.subjects.length > 0) {
            relatedResponse = await pretraziPoZanru(this.book.subjects[0], 1, 8)
          }
        }

        if (relatedResponse && relatedResponse.success) {
          this.relatedBooks = relatedResponse.data.books
            .filter(book => book.id !== `/works/${this.workId}`)
            .slice(0, 4)
        }
      } catch (error) {
        console.error('Greska ucitavanje povezanih knjiga:', error)
      }
    },

    toggleLibrary() {
      this.isInLibrary = !this.isInLibrary
      this.saveLibraryStatus()

      const message = this.isInLibrary
        ? `"${this.book.title}" dodano u biblioteku!`
        : `"${this.book.title}" uklonjeno iz biblioteke`

      if (this.isInLibrary) {
        this.$toast.success(message)
      } else {
        this.$toast.info(message)
      }
    },

    updateBookStatus(newStatus) {
      this.bookStatus = newStatus
      this.saveLibraryStatus()
      this.$toast.success('Status azuriran')
    },

    checkLibraryStatus() {
      try {
        const library = JSON.parse(localStorage.getItem('userLibrary') || '[]')
        const bookInLibrary = library.find(book => book.id === `/works/${this.workId}`)

        if (bookInLibrary) {
          this.isInLibrary = true
          this.bookStatus = bookInLibrary.status || 'want-to-read'
        }
      } catch (error) {
        console.error('Greska provjera biblioteke:', error)
      }
    },

    saveLibraryStatus() {
      try {
        let library = JSON.parse(localStorage.getItem('userLibrary') || '[]')
        const bookId = `/works/${this.workId}`

        if (this.isInLibrary) {
          const existingIndex = library.findIndex(book => book.id === bookId)

          const bookData = {
            id: bookId,
            title: this.book.title,
            authors: this.book.authors?.map(a => a.name || a) || ['Nepoznato'],
            publishYear: this.book.first_publish_year,
            coverUrl: this.bookCoverUrl,
            status: this.bookStatus,
            addedDate: new Date().toISOString()
          }

          if (existingIndex > -1) {
            library[existingIndex] = { ...library[existingIndex], ...bookData }
          } else {
            library.push(bookData)
          }
        } else {
          library = library.filter(book => book.id !== bookId)
        }

        localStorage.setItem('userLibrary', JSON.stringify(library))
      } catch (error) {
        console.error('Greska spremanje u biblioteku:', error)
      }
    },

    goToBook(book) {
      const workId = book.id.split('/').pop()
      this.$router.push(`/books/${workId}`)
    }
  }
}
</script>

<style scoped>
.book-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 32px;
}

.detail-cover {
  width: 100%;
  display: block;
}

.cover-placeholder {
  width: 100%;
  aspect-ratio: 2/3;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.opis-tekst {
  line-height: 1.7;
  white-space: pre-line;
  color: #444;
}

@media (max-width: 768px) {
  .book-layout {
    grid-template-columns: 1fr;
  }

  .book-cover-col {
    max-width: 200px;
    margin: 0 auto;
  }
}
</style>
