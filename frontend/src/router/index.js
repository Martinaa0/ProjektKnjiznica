import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/HomeView.vue'),
      meta: {
        title: 'Pocetna - Knjiznica'
      }
    },
    {
      path: '/books',
      name: 'Books',
      component: () => import('../views/Books.vue'),
      meta: {
        title: 'Pretrazivanje - Knjiznica'
      }
    },
    {
      path: '/books/:workId',
      name: 'BookDetails',
      component: () => import('../views/BookDetails.vue'),
      meta: {
        title: 'Detalji knjige - Knjiznica'
      },
      props: true
    },
    {
      path: '/my-library',
      name: 'MyLibrary',
      component: () => import('../views/MyLibrary.vue'),
      meta: {
        title: 'Moja biblioteka'
      }
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('../views/About.vue'),
      meta: {
        title: 'O aplikaciji - Knjiznica'
      }
    },
    {
      path: '/404',
      name: 'NotFound',
      component: () => import('../views/NotFound.vue'),
      meta: {
        title: '404 - Stranica nije pronadena'
      }
    },
    {
      path: '/search',
      redirect: to => {
        return { name: 'Books', query: to.query }
      }
    },
    {
      path: '/genre/:genre',
      redirect: to => {
        return {
          name: 'Books',
          query: { subject: to.params.genre }
        }
      }
    },
    {
      path: '/author/:author',
      redirect: to => {
        return {
          name: 'Books',
          query: { author: to.params.author }
        }
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404'
    }
  ],

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = 'Knjiznica'
  }

  next()
})

export default router
