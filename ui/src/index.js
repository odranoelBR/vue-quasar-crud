import { version } from '../package.json'

import Crud from './components/Crud.vue'


export {
  version,

  Crud

}

export default {
  version,

  Crud,


  install (Vue) {
    Vue.component(Crud.name, Crud)

  }
}
