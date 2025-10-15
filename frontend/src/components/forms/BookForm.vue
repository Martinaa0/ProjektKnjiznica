<template>
  <div class="kartica book-form">
    <h3 class="form-naslov">{{ book ? 'Uredi knjigu' : 'Dodaj novu knjigu' }}</h3>

    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label>Naslov knjige</label>
        <input type="text" v-model="formData.title" required />
      </div>

      <div class="form-group">
        <label>Autori (odvojeni zarezom)</label>
        <input type="text" v-model="authorsText" />
      </div>

      <div class="form-group">
        <label>Godina izdanja</label>
        <input type="number" v-model.number="formData.publishYear" />
      </div>

      <div class="form-group">
        <label>Zanr</label>
        <input type="text" v-model="formData.genre" />
      </div>

      <div class="form-group">
        <label>Opis</label>
        <textarea v-model="formData.description" rows="3"></textarea>
      </div>

      <div class="form-group">
        <label>Status</label>
        <select v-model="formData.status">
          <option value="want-to-read">Zelim procitati</option>
          <option value="currently-reading">Trenutno citam</option>
          <option value="read">Procitano</option>
        </select>
      </div>

      <div class="form-actions">
        <button type="button" @click="$emit('cancel')" class="btn btn-outline">
          Odustani
        </button>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ book ? 'Spremi promjene' : 'Dodaj knjigu' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'BookForm',
  props: {
    book: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['save', 'cancel'],
  data() {
    return {
      formData: {
        title: '',
        authors: [],
        publishYear: null,
        genre: '',
        description: '',
        status: 'want-to-read'
      }
    }
  },
  computed: {
    authorsText: {
      get() {
        return this.formData.authors.join(', ')
      },
      set(value) {
        this.formData.authors = value ? value.split(',').map(autor => autor.trim()) : []
      }
    }
  },
  watch: {
    book: {
      handler(newBook) {
        if (newBook) {
          this.formData = {
            title: newBook.title || '',
            authors: newBook.authors || [],
            publishYear: newBook.publishYear || null,
            genre: newBook.genre || '',
            description: newBook.description || '',
            status: newBook.status || 'want-to-read'
          }
        } else {
          this.formData = {
            title: '',
            authors: [],
            publishYear: null,
            genre: '',
            description: '',
            status: 'want-to-read'
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    submitForm() {
      console.log('radi!!') // ostavila sam ovo za debug
      const bookData = {
        ...this.formData,
        authors: this.formData.authors.length > 0 ? this.formData.authors : ['Nepoznat autor']
      }
      this.$emit('save', bookData)
    }
  }
}
</script>

<style scoped>
.book-form {
  padding: 20px;
}

.form-naslov {
  font-size: 18px;
  margin-bottom: 16px;
}

.form-group {
  margin-bottom: 12px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 4px;
  color: #555;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}
</style>
