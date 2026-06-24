<template>
  <div class="container" style="padding: 24px 20px;">
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
      <div>
        <h1>Moja biblioteka</h1>
        <p style="color: #666;">Upravljajte svojom kolekcijom knjiga</p>
      </div>
      <button @click="openAddDialog()" class="btn btn-primary" style="padding: 10px 20px;">
        + Dodaj novu knjigu
      </button>
    </div>

    <!-- Statistike -->
    <div class="statistike-grid" style="margin-bottom: 24px;">
      <div v-for="stat in libraryStats" :key="stat.title" class="kartica stat-kartica">
        <h3>{{ stat.count }}</h3>
        <p>{{ stat.title }}</p>
      </div>
    </div>

    <!-- Tabovi -->
    <div class="tab-buttons">
      <button
        v-for="tab in tabovi"
        :key="tab.value"
        @click="activeTab = tab.value"
        :class="['tab-btn', activeTab === tab.value ? 'tab-active' : '']"
      >
        {{ tab.label }} ({{ tab.count }})
      </button>
    </div>

    <!-- Sadrzaj tabova -->
    <div class="tab-sadrzaj">
      <LibraryBooksList
        v-if="activeTab === 'all'"
        :books="allBooks"
        :loading="loading"
        @update-status="updateBookStatus"
        @remove-book="removeBook"
        @edit-book="editBook"
        title="Sve knjige"
      />

      <LibraryBooksList
        v-if="activeTab === 'want-to-read'"
        :books="wantToReadBooks"
        :loading="loading"
        @update-status="updateBookStatus"
        @remove-book="removeBook"
        @edit-book="editBook"
        title="Zelim procitati"
        empty-message="Nemate knjiga u ovoj listi."
      />

      <LibraryBooksList
        v-if="activeTab === 'currently-reading'"
        :books="currentlyReadingBooks"
        :loading="loading"
        @update-status="updateBookStatus"
        @remove-book="removeBook"
        @edit-book="editBook"
        title="Trenutno citam"
        empty-message="Ne citate trenutno nista."
      />

      <LibraryBooksList
        v-if="activeTab === 'read'"
        :books="readBooks"
        :loading="loading"
        @update-status="updateBookStatus"
        @remove-book="removeBook"
        @edit-book="editBook"
        title="Procitano"
        empty-message="Nemate procitanih knjiga."
      />

      <LibraryBooksList
        v-if="activeTab === 'custom'"
        :books="customBooks"
        :loading="loading"
        @update-status="updateBookStatus"
        @remove-book="removeBook"
        @edit-book="editBook"
        title="Moje knjige"
        empty-message="Nemate dodanih vlastitih knjiga."
        :show-edit="true"
      />
    </div>

    <!-- Modal za dodavanje/uredivanje -->
    <div v-if="showAddBookDialog" class="modal-overlay" @click.self="cancelBookForm">
      <div class="modal-content">
        <BookForm
          :book="editingBook"
          :loading="saving"
          @save="saveBook"
          @cancel="cancelBookForm"
        />
      </div>
    </div>

    <!-- Potvrda brisanja -->
    <div v-if="showConfirmDialog" class="modal-overlay" @click.self="showConfirmDialog = false">
      <div class="modal-content kartica" style="padding: 24px; max-width: 400px;">
        <h3>{{ confirmDialog.title }}</h3>
        <p style="margin: 12px 0; color: #666;">{{ confirmDialog.message }}</p>
        <div style="display: flex; justify-content: flex-end; gap: 8px;">
          <button @click="showConfirmDialog = false" class="btn btn-outline">Odustani</button>
          <button @click="executeConfirmAction" class="btn btn-danger">{{ confirmDialog.confirmText }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LibraryBooksList from '@/components/common/LibraryBooksList.vue'
import BookForm from '@/components/forms/BookForm.vue'
import {
  dohvatiSveKnjige,
  kreirajKnjigu,
  azurirajKnjigu,
  obrisiKnjigu,
  dohvatiStatistiku
} from '@/services/customBooksService'

export default {
  name: 'MyLibrary',
  components: {
    LibraryBooksList,
    BookForm
  },
  data() {
    return {
      activeTab: 'all',
      loading: false,
      saving: false,
      userLibrary: [],
      showAddBookDialog: false,
      showConfirmDialog: false,
      editingBook: null,

      stats: {
        total: 0,
        wantToRead: 0,
        currentlyReading: 0,
        read: 0,
        custom: 0
      },

      confirmDialog: {
        title: '',
        message: '',
        action: null,
        confirmText: 'Obrisi'
      }
    }
  },

  computed: {
    libraryStats() {
      return [
        { title: 'Ukupno', count: this.stats.total },
        { title: 'Zelim procitati', count: this.stats.wantToRead },
        { title: 'Citam', count: this.stats.currentlyReading },
        { title: 'Procitano', count: this.stats.read }
      ]
    },

    tabovi() {
      return [
        { value: 'all', label: 'Sve', count: this.allBooks.length },
        { value: 'want-to-read', label: 'Zelim procitati', count: this.wantToReadBooks.length },
        { value: 'currently-reading', label: 'Citam', count: this.currentlyReadingBooks.length },
        { value: 'read', label: 'Procitano', count: this.readBooks.length },
        { value: 'custom', label: 'Moje knjige', count: this.customBooks.length }
      ]
    },

    allBooks() {
      return this.userLibrary
    },
    wantToReadBooks() {
      return this.userLibrary.filter(book => book.status === 'want-to-read')
    },
    currentlyReadingBooks() {
      return this.userLibrary.filter(book => book.status === 'currently-reading')
    },
    readBooks() {
      return this.userLibrary.filter(book => book.status === 'read')
    },
    customBooks() {
      return this.userLibrary.filter(book => book.isCustom === true || book.is_custom === true)
    }
  },

  async mounted() {
    await this.loadUserLibrary()
    await this.loadLibraryStats()
  },

  methods: {
    async loadUserLibrary() {
      this.loading = true
      try {
        const result = await dohvatiSveKnjige()
        if (result.success) {
          this.userLibrary = result.books.map(book => ({
            ...book,
            status: book.status || 'want-to-read',
            addedDate: book.addedDate || book.created_date || new Date().toISOString(),
            isCustom: book.isCustom || book.is_custom || false
          }))
        } else {
          throw new Error('Nije uspjelo ucitati biblioteku')
        }
      } catch (error) {
        console.error('Greska ucitavanje biblioteke:', error)
        this.$toast.error('Greska pri ucitavanju biblioteke')
      } finally {
        this.loading = false
      }
    },

    async loadLibraryStats() {
      try {
        this.stats = await dohvatiStatistiku()
      } catch (error) {
        console.error('Greska ucitavanje statistike:', error)
      }
    },

    openAddDialog() {
      this.editingBook = null
      this.showAddBookDialog = true
    },

    async saveBook(bookData) {
      this.saving = true
      try {
        if (this.editingBook && this.editingBook.id) {
          const result = await azurirajKnjigu(this.editingBook, bookData)
          if (result.success) {
            await this.loadUserLibrary()
            await this.loadLibraryStats()
            this.$toast.success('Knjiga azurirana!')
          }
        } else {
          const result = await kreirajKnjigu(bookData)
          if (result.success) {
            await this.loadUserLibrary()
            await this.loadLibraryStats()
            this.$toast.success('Knjiga dodana!')
          }
        }

        this.showAddBookDialog = false
        this.editingBook = null
      } catch (error) {
        console.error('Greska spremanja:', error)
        this.$toast.error(error.message || 'Greska pri spremanju')
      } finally {
        this.saving = false
      }
    },

    cancelBookForm() {
      this.showAddBookDialog = false
      this.editingBook = null
    },

    editBook(book) {
      this.editingBook = { ...book }
      this.showAddBookDialog = true
    },

    async updateBookStatus(book, newStatus) {
      try {
        if (!book?.id) return
        const result = await azurirajKnjigu(book, { status: newStatus })
        if (result.success) {
          const idx = this.userLibrary.findIndex(b => b.id === book.id)
          if (idx !== -1) {
            this.userLibrary[idx] = { ...this.userLibrary[idx], status: newStatus }
          }
          await this.loadLibraryStats()
          this.$toast.success('Status azuriran')
        }
      } catch (error) {
        console.error('Greska azuriranja statusa:', error)
        this.$toast.error('Greska pri azuriranju statusa')
      }
    },

    removeBook(book) {
      if (!book?.id) return

      this.confirmDialog = {
        title: 'Ukloni knjigu',
        message: `Jeste li sigurni da zelite ukloniti "${book.title}"?`,
        confirmText: 'Ukloni',
        action: async () => {
          try {
            const res = await obrisiKnjigu(book)
            if (res.success) {
              await this.loadUserLibrary()
              await this.loadLibraryStats()
              this.$toast.success('Knjiga uklonjena')
            }
          } catch (error) {
            console.error('Greska brisanja:', error)
            this.$toast.error('Greska pri brisanju')
          } finally {
            this.showConfirmDialog = false
          }
        }
      }

      this.showConfirmDialog = true
    },

    async executeConfirmAction() {
      if (typeof this.confirmDialog.action === 'function') {
        await this.confirmDialog.action()
      } else {
        this.showConfirmDialog = false
      }
    }
  }
}
</script>

<style scoped>
.statistike-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.stat-kartica {
  text-align: center;
  padding: 16px;
}

.stat-kartica h3 {
  font-size: 1.5rem;
  color: #1976D2;
}

.stat-kartica p {
  font-size: 13px;
  color: #666;
}

.tab-buttons {
  display: flex;
  gap: 4px;
  margin-bottom: 0;
  flex-wrap: wrap;
  border-bottom: 2px solid #e0e0e0;
}

.tab-btn {
  padding: 10px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: color 0.2s;
}

.tab-btn:hover {
  color: #1976D2;
}

.tab-active {
  color: #1976D2;
  border-bottom-color: #1976D2;
  font-weight: 500;
}

.tab-sadrzaj {
  background: white;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .statistike-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .tab-btn {
    font-size: 12px;
    padding: 8px 10px;
  }
}
</style>
