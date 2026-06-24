<template>
  <div style="text-align: center; padding: 80px 20px; min-height: 60vh; display: flex; align-items: center; justify-content: center;">
    <div>
      <h1 style="font-size: 5rem; color: #1976D2; margin-bottom: 8px;">404</h1>
      <h2 style="margin-bottom: 16px;">Stranica nije pronadena</h2>
      <p style="color: #666; margin-bottom: 24px;">
        Ups! Stranica koju trazite ne postoji.
      </p>
      <div style="display: flex; gap: 12px; justify-content: center;">
        <router-link to="/" class="btn btn-primary">Na pocetnu</router-link>
        <router-link to="/books" class="btn btn-outline">Pretrazi knjige</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  mounted() {
    console.log('404 stranica:', this.$route.fullPath)
  }
}
</script>
