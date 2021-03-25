<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          to="/"
          icon="fa fa-table"
        />

        <q-toolbar-title>
          Quasar Crud v{{ version }}
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
        <a
          target="_blank"
          href="https://github.com/odranoelBR/vue-quasar-crud"
          class="text-white q-pa-sm"
        >
          <q-icon
            class="cursor-pointer"
            name="fab fa-github"
            size="25px"
          />
        </a>
      </q-toolbar>
    </q-header>

    <drawer />

    <q-page-container>
      <transition
        appear
        :duration="{ enter: 300, leave: 300 }"
        mode="out-in"
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <router-view class="q-ma-md" />
      </transition>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { version } from 'ui' // "ui" is aliased in quasar.conf.js
import Drawer from './Drawer'
export default {
  name: 'MyLayout',
  components: {
    Drawer
  },
  data () {
    return {
      version
    }
  }
}
</script>
