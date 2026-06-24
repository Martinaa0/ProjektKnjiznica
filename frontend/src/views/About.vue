<template>
  <div class="container" style="padding: 40px 20px;">
    <div style="text-align: center; margin-bottom: 40px;">
      <h1>O aplikaciji</h1>
      <p style="color: #666; margin-top: 8px;">Digitalna knjiznica za pretrazivanje i upravljanje knjigama</p>
    </div>

    <div class="kartica" style="padding: 24px; max-width: 800px; margin: 0 auto 32px;">
      <h2 style="margin-bottom: 12px;">Sto je ovo?</h2>
      <p style="margin-bottom: 12px;">
        Ovo je web aplikacija za pretrazivanje knjiga koristeci Open Library API.
        Mozete pretrazivati knjige po naslovu, autoru ili zanru, te dodavati knjige
        u svoju osobnu biblioteku.
      </p>
      <p>
        Aplikacija je napravljena kao projekt za fakultet. Frontend je napravljen u
        Vue.js-u, a backend u Express.js-u s MySQL bazom podataka.
      </p>
    </div>

    <div style="max-width: 800px; margin: 0 auto;">
      <h2 style="text-align: center; margin-bottom: 24px;">Tehnologije</h2>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div class="kartica" style="padding: 20px;">
          <h3 style="margin-bottom: 8px;">Frontend</h3>
          <ul style="padding-left: 20px; color: #555;">
            <li>Vue.js 3</li>
            <li>Vue Router</li>
            <li>Axios</li>
          </ul>
        </div>

        <div class="kartica" style="padding: 20px;">
          <h3 style="margin-bottom: 8px;">Backend</h3>
          <ul style="padding-left: 20px; color: #555;">
            <li>Node.js</li>
            <li>Express.js</li>
            <li>MySQL / MariaDB</li>
          </ul>
        </div>
      </div>

      <div class="kartica" style="padding: 20px; margin-top: 16px;">
        <h3 style="margin-bottom: 8px;">API</h3>
        <p style="color: #555;">Open Library API - besplatni pristup milijunima knjiga</p>
      </div>
    </div>

    <!-- TODO: popravit ovo, nisam stigla -->
    <div style="text-align: center; margin-top: 40px;">
      <div class="kartica" style="padding: 24px; max-width: 500px; margin: 0 auto; background-color: #f5f5f5;">
        <h3 style="margin-bottom: 12px;">Pocnite s pretrazivanjem</h3>
        <p style="color: #666; margin-bottom: 16px;">Istrazite nasu kolekciju knjiga</p>
        <div style="display: flex; gap: 12px; justify-content: center;">
          <router-link to="/books" class="btn btn-primary">Pretrazi knjige</router-link>
          <router-link to="/my-library" class="btn btn-outline">Moja biblioteka</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>
