<template>
  <div class="search-bar">
    <input
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      placeholder="Pretrazi knjige, autore, zanrove..."
      @keyup.enter="handleSearch"
    />
    <button
      @click="handleSearch"
      class="btn btn-primary"
      :disabled="!modelValue || !modelValue.trim()"
    >
      Pretrazi
    </button>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'search', 'clear'],
  methods: {
    handleSearch() {
      this.$emit('search')
    }
  }
}
</script>

<style scoped>
.search-bar {
  display: flex;
  gap: 8px;
}

.search-bar input {
  flex: 1;
}
</style>
