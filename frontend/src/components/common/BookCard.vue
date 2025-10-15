<template>
  <div class="kartica book-card" @click="viewDetails">
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
      <p class="book-autori">{{ formatiraniAutori }}</p>
      <span v-if="book.publishYear" class="book-godina">{{ book.publishYear }}</span>
    </div>
  </div>
</template>

<script>
import { formatirajAutore, skratiTekst } from '@/services/bookService'

export default {
  name: 'BookCard',
  props: {
    book: {
      type: Object,
      required: true
    }
  },
  emits: ['click', 'view-details'],
  computed: {
    skraceniNaslov() {
      return skratiTekst(this.book.title, 60)
    },
    formatiraniAutori() {
      return formatirajAutore(this.book.authors)
    }
  },
  methods: {
    viewDetails() {
      const workId = this.book.id.split('/').pop()
      this.$router.push({
        name: 'BookDetails',
        params: { workId }
      })
      this.$emit('view-details', this.book)
    }
  }
}
</script>

<style scoped>
.book-card {
  cursor: pointer;
  transition: transform 0.2s;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
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
}

.book-naslov {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-autori {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-godina {
  font-size: 12px;
  color: #999;
}
</style>
