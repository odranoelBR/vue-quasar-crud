import pages from './pages'

const children = pages.map(page => ({
  path: page.path,
  component: () => import('pages/' + page.file + '.vue')
}))

const routes = [
  {
    path: '/',
    component: () => import('layouts/Layout.vue'),
    children: [
      { path: '/', component: () => import('pages/PageIndex.vue'), name: 'started' },
      { path: '/more-examples', component: () => import('pages/PageMoreExamples.vue'), name: 'more-examples' }
    ].concat(children)
  }
]

export default routes
