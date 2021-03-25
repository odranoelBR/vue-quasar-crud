import Vue from 'vue'
import VuePlugin from 'ui' // "ui" is aliased in quasar.conf.js
import hljs from 'highlight.js'
import htmlbars from 'highlight.js/lib/languages/htmlbars'
import javascript from 'highlight.js/lib/languages/javascript'
import 'highlight.js/styles/github.css';

hljs.registerLanguage('htmlbars', htmlbars);
hljs.registerLanguage('javascript', javascript);
Vue.use(VuePlugin)
Vue.use(hljs.vuePlugin);
