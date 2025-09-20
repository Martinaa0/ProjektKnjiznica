# Knjiznica

Web aplikacija za pretrazivanje i upravljanje knjigama. Koristim Open Library API za pretrazivanje knjiga.

Ovo je projekt za faks.

## Tehnologije

- **Frontend:** Vue.js 3, Vue Router, Axios
- **Backend:** Node.js, Express.js
- **Baza podataka:** MySQL / MariaDB
- **API:** Open Library API

## Pokretanje

### Backend

```bash
cd backend
npm install
npm start
```

Server se pokrece na `http://localhost:3001`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend se pokrece na `http://localhost:5173`

### Baza podataka

Treba imati MySQL ili MariaDB instaliran. Kreirati bazu `knjiznica` i tablicu `custom_books`:

```sql
CREATE DATABASE knjiznica;
USE knjiznica;

CREATE TABLE custom_books (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  authors TEXT,
  publish_year INT,
  genre VARCHAR(100),
  description TEXT,
  status VARCHAR(50) DEFAULT 'want-to-read',
  created_date DATETIME,
  updated_date DATETIME
);
```

## Funkcionalnosti

- Pretrazivanje knjiga po naslovu, autoru i zanru
- Pregled detalja knjige
- Dodavanje knjiga u osobnu biblioteku
- CRUD operacije za vlastite knjige (sprema se u bazu)
- Filtriranje po statusu (zelim procitati, citam, procitano)
