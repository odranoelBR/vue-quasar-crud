<template>
  <q-drawer
    v-model="leftDrawerOpen"
    bordered
    elevated
  >
    <q-list
      padding
      class="text-weight-light drawer"
      separator
    >

      <q-item
        v-for="(link, indexRoutes) in routes"
        :key="indexRoutes"
        exact
        :to="{ name: link.routeName }"
        link
        active-class="router-link-active"
      >
        <q-item-section avatar>
          <q-icon
            color="secondary"
            :name="link.faIcon"
            alt=""
          />
        </q-item-section>
        <q-item-section
          label
          class="light-paragraph"
        >
          {{ link.name }}
        </q-item-section>
      </q-item>

      <q-expansion-item label="External Links">
        <q-list no-border>
          <q-item
            v-for="(link, indexRoutes) in links"
            :key="indexRoutes"
            clickable
            v-ripple
            link
          >
            <q-item-section>

              <a
                :href="link.route"
                target="_blank"
              >{{link.name}}</a>
            </q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>
    </q-list>

  </q-drawer>
</template>
<script>
export default {
  components: {
  },
  data: () => ({
    leftDrawerOpen: true,
    routes: [
      { route: "/", faIcon: "fa fa-home", materialIcon: "started", name: "Getting started", routeName: "started" },
      { route: "/more-examples", faIcon: "fa fa-chalkboard-teacher", materialIcon: "data", name: "More examples", routeName: "more-examples" }
    ],
    links: [
      { route: "https://vuejs.org", faIcon: "fa fa-money-bill-alt", name: "Vue.js" },
      { route: "https://quasar.dev", faIcon: "fa fa-arrows-alt", name: "Quasar.js" },
      { route: "https://github.com/axios/axios", faIcon: "fa fa-arrows-alt", name: "Axios.js" }
    ]
  }),
  created () {
  },
  methods: {

  }
};
</script>
<style scoped>
.router-link-active {
  border-right: 3px solid #eb8330;
  color: #eb8330;
  background-color: #fafafa;
}
.drawer {
  font-size: 1.1em;
}
</style>
