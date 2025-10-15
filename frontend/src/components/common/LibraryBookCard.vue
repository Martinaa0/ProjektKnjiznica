<template>
  <div class="kartica library-card">
    <img
      v-if="book.coverUrl"
      :src="book.coverUrl"
      :alt="book.title"
      class="book-cover"
    />
    <div v-else class="book-cover-placeholder">
      Nema slike
    </div>

    <div class="book-info">
      <h4 class="book-naslov">{{ skraceniNaslov }}</h4>
      <p class="book-autori">{{ formatirajAutore(book.authors) }}</p>

      <div v-if="book.publishYear" class="book-meta">
        Godina: {{ book.publishYear }}
      </div>

      <div class="status-select">
        <select :value="book.status" @change="handleStatusUpdate($event.target.value)">
          <option value="want-to-read">Zelim procitati</option>
          <option value="currently-reading">Trenutno citam</option>
          <option value="read">Procitano</option>
        </select>
      </div>

      <div class="akcije">
        <button
          v-if="showEdit"
          @click="handleEditBook"
          class="btn btn-outline btn-sm"
        >
          Uredi
        </button>
        <button @click="handleRemoveBook" class="btn btn-danger btn-sm">
          Ukloni
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { formatirajAutore, skratiTekst } from '@/services/bookService'

export default {
  name: 'LibraryBookCard',
  props: {
    book: {
      type: Object,
      required: true
    },
    showEdit: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update-status', 'remove-book', 'edit-book'],

  computed: {
    skraceniNaslov() {
      return this.book.title ? skratiTekst(this.book.title, 50) : 'Bez naslova'
    }
  },

  methods: {
    handleRemoveBook() {
      console.log('Brisem knjigu:', this.book.title)
      this.$emit('remove-book')
    },

    handleEditBook() {
      this.$emit('edit-book')
    },

    handleStatusUpdate(newStatus) {
      console.log('Status update:', this.book.title, newStatus)
      this.$emit('update-status', newStatus)
    },

    formatirajAutore(authors) {
      return formatirajAutore(authors)
    }
  }
}
</script>

<style scoped>
.library-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.book-cover {
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
}

.book-cover-placeholder {
  width: 100%;
  aspect-ratio: 2/3;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 13px;
}

.book-info {
  padding: 10px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.book-naslov {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
  line-height: 1.3;
}

.book-autori {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.book-meta {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}

.status-select {
  margin-bottom: 8px;
}

.status-select select {
  width: 100%;
  padding: 6px;
  font-size: 12px;
}

.akcije {
  display: flex;
  gap: 6px;
  margin-top: auto;
}

.btn-sm {
  padding: 4px 10px;
  font-size: 12px;
}
</style>
