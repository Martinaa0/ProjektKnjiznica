<template>
  <teleport to="body">
    <div class="toast-container">
      <div
        v-for="toast in visibleToasts"
        :key="toast.id"
        :class="['toast-item', 'toast-' + toast.type]"
      >
        <span>{{ toast.message }}</span>
        <button @click="removeToast(toast.id)" class="toast-close">&times;</button>
      </div>
    </div>
  </teleport>
</template>

<script>
export default {
  name: 'ToastContainer',
  props: {
    toasts: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    visibleToasts() {
      return this.toasts.filter(toast => toast.visible)
    }
  },
  methods: {
    removeToast(id) {
      const toast = this.toasts.find(t => t.id === id)
      if (toast) {
        toast.visible = false
      }
    }
  }
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 9999;
  max-width: 400px;
}

.toast-item {
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 4px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.toast-success { background-color: #4CAF50; }
.toast-error { background-color: #f44336; }
.toast-warning { background-color: #ff9800; }
.toast-info { background-color: #2196F3; }

.toast-close {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  margin-left: 12px;
}
</style>
