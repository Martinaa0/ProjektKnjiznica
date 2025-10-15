<template>
  <div class="library-books-list">
    <h3 class="lista-naslov">{{ title }}</h3>

    <div v-if="loading" class="ucitavanje">
      <p>Ucitavam knjige...</p>
    </div>

    <div v-else-if="books.length > 0" class="knjige-grid">
      <LibraryBookCard
        v-for="book in books"
        :key="book.id"
        :book="book"
        :show-edit="showEdit"
        @update-status="handleUpdateStatus(book, $event)"
        @remove-book="handleRemoveBook(book)"
        @edit-book="handleEditBook(book)"
      />
    </div>

    <div v-else class="prazno-stanje">
      <p>{{ emptyMessage }}</p>
      <router-link to="/books" class="btn btn-outline" style="margin-top: 12px; display: inline-block;">
        Pretrazi knjige
      </router-link>
    </div>
  </div>
</template>

<script>
import LibraryBookCard from './LibraryBookCard.vue'

export default {
  name: 'LibraryBooksList',
  components: {
    LibraryBookCard
  },
  props: {
    books: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Tvoje knjige'
    },
    emptyMessage: {
      type: String,
      default: 'Nema knjiga u ovoj listi.'
    },
    showEdit: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update-status', 'remove-book', 'edit-book'],
  methods: {
    handleUpdateStatus(book, newStatus) {
      this.$emit('update-status', book, newStatus)
    },

    handleRemoveBook(book) {
      console.log('tu sam, brisem knjigu:', book.title)
      this.$emit('remove-book', book)
    },

    handleEditBook(book) {
      this.$emit('edit-book', book)
    }
  }
}
</script>

<style scoped>
.library-books-list {
  padding: 16px;
  min-height: 200px;
}

.lista-naslov {
  font-size: 18px;
  margin-bottom: 16px;
}

.ucitavanje {
  text-align: center;
  padding: 40px;
  color: #666;
}

.prazno-stanje {
  text-align: center;
  padding: 40px;
  color: #999;
}
</style>
