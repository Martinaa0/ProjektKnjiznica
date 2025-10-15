<template>
  <div class="paginacija">
    <button
      @click="goToPrevious"
      :disabled="modelValue <= 1 || loading"
      class="btn btn-outline"
    >
      Prethodna
    </button>

    <span class="page-info">
      Stranica {{ modelValue }} od {{ totalPages }}
    </span>

    <button
      @click="goToNext"
      :disabled="modelValue >= totalPages || loading"
      class="btn btn-outline"
    >
      Sljedeca
    </button>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    modelValue: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  methods: {
    goToPrevious() {
      if (this.modelValue > 1) {
        this.$emit('update:modelValue', this.modelValue - 1)
      }
    },
    goToNext() {
      if (this.modelValue < this.totalPages) {
        this.$emit('update:modelValue', this.modelValue + 1)
      }
    }
  }
}
</script>

<style scoped>
.paginacija {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 16px 0;
}

.page-info {
  font-weight: 500;
  white-space: nowrap;
}
</style>
