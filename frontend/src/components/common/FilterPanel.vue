<template>
  <div class="kartica filter-panel">
    <div class="filter-header">
      <h3>Filteri</h3>
      <button @click="clearAll" class="btn btn-outline" :disabled="!hasActiveFilters">
        Ocisti sve
      </button>
    </div>

    <div class="filter-row">
      <div class="filter-field">
        <label>Autor</label>
        <input
          type="text"
          :value="author"
          @input="$emit('update:author', $event.target.value)"
          placeholder="Ime autora..."
          @keyup.enter="$emit('apply')"
        />
      </div>

      <div class="filter-field">
        <label>Zanr</label>
        <select :value="subject" @change="$emit('update:subject', $event.target.value)">
          <option value="">-- Odaberi zanr --</option>
          <option v-for="zanr in zanrovi" :key="zanr" :value="zanr">{{ zanr }}</option>
        </select>
      </div>

      <div class="filter-field">
        <label>Godina od</label>
        <input
          type="number"
          :value="yearFrom"
          @input="$emit('update:yearFrom', $event.target.value ? parseInt($event.target.value) : null)"
          placeholder="1800"
          min="1800"
        />
      </div>

      <div class="filter-field">
        <label>Godina do</label>
        <input
          type="number"
          :value="yearTo"
          @input="$emit('update:yearTo', $event.target.value ? parseInt($event.target.value) : null)"
          placeholder="2024"
        />
      </div>
    </div>

    <div style="text-align: center; margin-top: 12px;">
      <button @click="$emit('apply')" class="btn btn-primary">
        Primijeni filtere
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterPanel',
  props: {
    author: {
      type: String,
      default: ''
    },
    subject: {
      type: String,
      default: ''
    },
    yearFrom: {
      type: Number,
      default: null
    },
    yearTo: {
      type: Number,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'update:author',
    'update:subject',
    'update:yearFrom',
    'update:yearTo',
    'apply',
    'clear'
  ],
  data() {
    return {
      zanrovi: [
        'fiction', 'romance', 'mystery', 'science fiction', 'fantasy',
        'thriller', 'biography', 'history', 'poetry', 'drama',
        'horror', 'adventure', 'comedy', 'philosophy'
      ]
    }
  },
  computed: {
    hasActiveFilters() {
      return !!(this.author || this.subject || this.yearFrom || this.yearTo)
    }
  },
  methods: {
    clearAll() {
      this.$emit('update:author', '')
      this.$emit('update:subject', '')
      this.$emit('update:yearFrom', null)
      this.$emit('update:yearTo', null)
      this.$emit('clear')
    }
  }
}
</script>

<style scoped>
.filter-panel {
  padding: 16px;
  margin-bottom: 16px;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.filter-field label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 4px;
  color: #555;
}
</style>
