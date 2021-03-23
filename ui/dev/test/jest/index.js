import { createLocalVue, shallowMount } from '@vue/test-utils'
import * as All from 'quasar'
import Vue from 'vue'
const { Cookies, Quasar } = All

const components = Object.keys(All).reduce((object, key) => {
  const val = All[key]
  if (val && val.component && val.component.name != null) {
    object[key] = val
  }
  return object
}, {})

const localVue = createLocalVue()
localVue.use(Quasar, { components })

export const mountQuasar = (component, componentOptions, options = { plugins: [] }) => {
  const app = {}

  if (options) {
    const ssrContext = options.ssr ? mockSsrContext() : null

    if (options.cookies) {
      const cookieStorage = ssrContext ? Cookies.parseSSR(ssrContext) : Cookies
      const cookies = options.cookies
      Object.keys(cookies).forEach(key => {
        cookieStorage.set(key, cookies[key])
      })
    }

    if (options) {
      const plugins = options.plugins
      plugins.forEach(plugin => {
        plugin({ app, store, router, Vue: localVue, ssrContext })
      })
    }
  }

  // mock vue-i18n
  const $t = () => { }
  const $tc = () => { }
  const $n = () => { }
  const $d = () => { }

  return shallowMount(component, {
    localVue,
    ...componentOptions,
    mocks: { $t, $tc, $n, $d },
    // Injections for Components with a QPage root Element
    provide: {
      pageContainer: true,
      layout: {
        header: {},
        right: {},
        footer: {},
        left: {}
      }
    }
  })
}
