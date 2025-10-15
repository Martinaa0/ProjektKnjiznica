<template>
  <nav class="header">
    <div class="header-sadrzaj">
      <router-link to="/" class="logo">Knjiznica</router-link>
      <div class="nav-linkovi">
        <router-link to="/">Pocetna</router-link>
        <router-link to="/books">Knjige</router-link>
        <router-link to="/my-library">Moja biblioteka</router-link>
        <router-link to="/about">O aplikaciji</router-link>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AppHeader'
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #1976D2;
  color: white;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.header-sadrzaj {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.nav-linkovi {
  display: flex;
  gap: 20px;
}

.nav-linkovi a {
  color: rgba(255,255,255,0.85);
  text-decoration: none;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.nav-linkovi a:hover {
  background-color: rgba(255,255,255,0.1);
  color: white;
  text-decoration: none;
}

.nav-linkovi a.router-link-active {
  background-color: rgba(255,255,255,0.2);
  color: white;
}

@media (max-width: 600px) {
  .nav-linkovi {
    gap: 8px;
  }

  .nav-linkovi a {
    font-size: 12px;
    padding: 6px 8px;
  }
}
</style>
