import apiClient from './api'

const STORAGE_KEY = 'userLibrary';

export const dohvatiBiblioteku = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Greska ucitavanje biblioteke:', error);
    return [];
  }
};

export const spremiBiblioteku = (library) => {
  try {
    const obicneKnjige = library.filter(book => !book.isCustom);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obicneKnjige));
    return true;
  } catch (error) {
    console.error('Greska spremanje biblioteke:', error);
    return false;
  }
};

export const kreirajKnjigu = async (bookData) => {
  try {
    console.log('Kreiram knjigu:', bookData);

    const response = await apiClient.post('/custom-books', {
      title: bookData.title,
      authors: Array.isArray(bookData.authors) ? [...bookData.authors] : bookData.authors,
      publishYear: bookData.publishYear,
      genre: bookData.genre,
      description: bookData.description,
      status: bookData.status || 'want-to-read'
    });

    console.log('API odgovor:', response.data);

    if (response.data.success) {
      return { success: true, book: response.data.data.book };
    } else {
      throw new Error(response.data.error || 'Nije uspjelo kreirati knjigu');
    }
  } catch (error) {
    console.error('Greska kreiranje knjige:', error);

    if (error.response) {
      throw new Error(`Greska servera: ${error.response.data?.error || error.response.statusText}`);
    } else if (error.request) {
      throw new Error('Greska mreze - ne mogu se spojiti na server');
    } else {
      throw new Error(error.message || 'Nije uspjelo kreirati knjigu');
    }
  }
};

export const azurirajKnjigu = async (bookOrId, updates) => {
  try {
    const bookId = typeof bookOrId === 'object' && bookOrId !== null ? bookOrId.id : bookOrId;
    const customFlag = typeof bookOrId === 'object' && bookOrId !== null
      ? (bookOrId.isCustom === true || bookOrId.is_custom === true)
      : (typeof bookId === 'number' ? true : (typeof bookId === 'string' ? bookId.startsWith('custom_') : false));

    if (customFlag) {
      const response = await apiClient.put(`/custom-books/${bookId}`, updates);

      if (response.data.success) {
        return { success: true, book: response.data.data.book };
      } else {
        throw new Error(response.data.error || 'Nije uspjelo azurirati knjigu');
      }
    } else {
      const library = dohvatiBiblioteku();
      const bookIndex = library.findIndex(book => book.id === bookId);

      if (bookIndex === -1) {
        throw new Error('Knjiga nije pronadena');
      }

      library[bookIndex] = {
        ...library[bookIndex],
        ...updates,
        updatedDate: new Date().toISOString()
      };

      if (spremiBiblioteku(library)) {
        return { success: true, book: library[bookIndex] };
      } else {
        throw new Error('Nije uspjelo spremiti u localStorage');
      }
    }
  } catch (error) {
    console.error('Greska azuriranje knjige:', error);
    throw error;
  }
};

export const obrisiKnjigu = async (bookOrId) => {
  try {
    const bookId = typeof bookOrId === 'object' && bookOrId !== null ? bookOrId.id : bookOrId;
    const customFlag = typeof bookOrId === 'object' && bookOrId !== null
      ? (bookOrId.isCustom === true || bookOrId.is_custom === true)
      : (typeof bookId === 'number' ? true : (typeof bookId === 'string' ? bookId.startsWith('custom_') : false));

    if (customFlag) {
      const response = await apiClient.delete(`/custom-books/${bookId}`);

      if (response.data.success) {
        return { success: true };
      } else {
        throw new Error(response.data.error || 'Nije uspjelo obrisati knjigu');
      }
    } else {
      const library = dohvatiBiblioteku();
      const filtriranaLista = library.filter(book => book.id !== bookId);

      if (spremiBiblioteku(filtriranaLista)) {
        return { success: true };
      } else {
        throw new Error('Nije uspjelo spremiti u localStorage');
      }
    }
  } catch (error) {
    console.error('Greska brisanje knjige:', error);
    throw error;
  }
};

export const dohvatiSveCustomKnjige = async () => {
  try {
    console.log('Dohvacam knjige iz API-ja...');

    const response = await apiClient.get('/custom-books');
    console.log('Custom knjige odgovor:', response.data);

    if (response.data.success) {
      return { success: true, books: response.data.data.books || [] };
    } else {
      throw new Error(response.data.error || 'Nije uspjelo dohvatiti knjige');
    }
  } catch (error) {
    console.error('Greska dohvacanje knjiga iz API-ja:', error);
    throw error;
  }
};

export const dohvatiSveKnjige = async () => {
  try {
    const customResult = await dohvatiSveCustomKnjige();
    const customBooks = customResult.success ? customResult.books : [];

    const localBooks = dohvatiBiblioteku();

    const sveKnjige = [...customBooks, ...localBooks];

    return { success: true, books: sveKnjige };
  } catch (error) {
    console.error('Greska dohvacanje svih knjiga:', error);

    const localBooks = dohvatiBiblioteku();
    return { success: true, books: localBooks };
  }
};

export const dohvatiPoStatusu = async (status) => {
  try {
    const result = await dohvatiSveKnjige();
    const sveKnjige = result.books || [];

    return sveKnjige.filter(book => book.status === status);
  } catch (error) {
    console.error('Greska filtriranje po statusu:', error);
    return [];
  }
};

export const getCustomBooks = async () => {
  try {
    const result = await dohvatiSveCustomKnjige();
    return result.books || [];
  } catch (error) {
    console.error('Greska dohvacanje custom knjiga:', error);
    return [];
  }
};

export const daLiJeUBiblioteci = async (bookId) => {
  try {
    const result = await dohvatiSveKnjige();
    const sveKnjige = result.books || [];

    return sveKnjige.some(book => book.id === bookId);
  } catch (error) {
    console.error('Greska provjera biblioteke:', error);
    return false;
  }
};

export const dodajKnjiguUBiblioteku = (bookData, status = 'want-to-read') => {
  try {
    const library = dohvatiBiblioteku();

    if (library.some(book => book.id === bookData.id)) {
      return { success: false, error: 'Knjiga vec postoji u biblioteci' };
    }

    const novaKnjiga = {
      id: bookData.id,
      title: bookData.title,
      authors: bookData.authors || ['Nepoznat autor'],
      publishYear: bookData.publishYear,
      coverUrl: bookData.coverUrl,
      status: status,
      addedDate: new Date().toISOString(),
      isCustom: false
    };

    library.push(novaKnjiga);

    if (spremiBiblioteku(library)) {
      return { success: true, book: novaKnjiga };
    } else {
      throw new Error('Nije uspjelo spremiti u localStorage');
    }
  } catch (error) {
    console.error('Greska dodavanje knjige:', error);
    return { success: false, error: error.message };
  }
};

export const dohvatiStatistiku = async () => {
  try {
    const result = await dohvatiSveKnjige();
    const library = result.books || [];

    return {
      total: library.length,
      wantToRead: library.filter(book => book.status === 'want-to-read').length,
      currentlyReading: library.filter(book => book.status === 'currently-reading').length,
      read: library.filter(book => book.status === 'read').length,
      custom: library.filter(book => book.isCustom === true).length
    };
  } catch (error) {
    console.error('Greska dohvacanje statistike:', error);
    return {
      total: 0,
      wantToRead: 0,
      currentlyReading: 0,
      read: 0,
      custom: 0
    };
  }
};

export const dohvatiJednuKnjigu = async (bookId) => {
  try {
    if (bookId.startsWith('custom_')) {
      const response = await apiClient.get(`/custom-books/${bookId}`);
      if (response.data.success) {
        return { success: true, book: response.data.data.book };
      }
    }
    return { success: false, error: 'Knjiga nije pronadena' };
  } catch (error) {
    console.error('Greska dohvacanje knjige:', error);
    return { success: false, error: error.message };
  }
};

export default {
  dohvatiBiblioteku,
  spremiBiblioteku,
  kreirajKnjigu,
  azurirajKnjigu,
  obrisiKnjigu,
  dohvatiSveCustomKnjige,
  dohvatiSveKnjige,
  dohvatiPoStatusu,
  getCustomBooks,
  daLiJeUBiblioteci,
  dodajKnjiguUBiblioteku,
  dohvatiStatistiku,
  dohvatiJednuKnjigu
};
