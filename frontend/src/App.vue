<template>
  <div id="aplikacija">
    <AppHeader />
    <main class="glavni-sadrzaj">
      <router-view />
    </main>
  </div>
</template>

<script>
import AppHeader from '@/components/layout/AppHeader.vue'

export default {
  name: 'App',
  components: {
    AppHeader
  }
}
</script>

<style>
/* globalni stilovi */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  background-color: #f5f5f5;
  line-height: 1.6;
}

a {
  color: #1976D2;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

button {
  cursor: pointer;
  font-family: inherit;
}

.glavni-sadrzaj {
  min-height: calc(100vh - 60px);
  padding-top: 60px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.knjige-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .knjige-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #1976D2;
  color: white;
}

.btn-primary:hover {
  background-color: #1565C0;
}

.btn-primary:disabled {
  background-color: #90CAF9;
  cursor: not-allowed;
}

.btn-danger {
  background-color: #f44336;
  color: white;
}

.btn-danger:hover {
  background-color: #d32f2f;
}

.btn-outline {
  background-color: transparent;
  border: 1px solid #1976D2;
  color: #1976D2;
}

.btn-outline:hover {
  background-color: #E3F2FD;
}

.kartica {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
}

input[type="text"],
input[type="number"],
select,
textarea {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  width: 100%;
}

input[type="text"]:focus,
input[type="number"]:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #1976D2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}

.badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  background-color: #E3F2FD;
  color: #1976D2;
  border: 1px solid #90CAF9;
}
</style>
