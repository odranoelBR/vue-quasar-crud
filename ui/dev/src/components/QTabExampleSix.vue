<template>
  <div>
    <q-tabs
      v-model="tab"
      align="justify"
      narrow-indicator
      class="bg-grey-2 text-teal"
    >
      <q-tab
        class="text-purple"
        name="example"
        label="Example"
      />
      <q-tab
        class="text-orange"
        name="template"
        label="Template"
      />
      <q-tab
        class="text-teal"
        name="script"
        label="Script"
      />
    </q-tabs>

    <q-tab-panels
      keep-alive
      v-model="tab"
      animated
      transition-prev="scale"
      transition-next="scale"
    >
      <q-tab-panel
        name="example"
        ref="panel"
      >
        <crud
          :columns.sync="columns"
          :http="axios"
          :list-index="list => list"
          :rows-per-page="5"
          @successOnPut="notifyUpdate"
          pagination-rows-per-page-index="limit"
          pagination-sort-index="sortBy"
          api="games"
          row-key="id"
        >
          <template
            v-slot:body-cell-img="props"
            :props="props"
          >
            <q-img :src="props.row.img" />
          </template>
        </crud>
      </q-tab-panel>

      <q-tab-panel name="template">
        <highlightjs
          language="htmlbars"
          :code="code"
        />
      </q-tab-panel>

      <q-tab-panel name="script">
        <highlightjs
          language="javascript"
          :code="columnsString"
        />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import Crud from '../../../src/components/Crud'
import axios from 'axios'
import { Notify } from 'quasar'

export default {
  components: {
    Crud
  },
  created () {
    this.axios = axios.create({ baseURL: 'https://6075f3480baf7c0017fa7551.mockapi.io/api/v1/' })
  },
  data: () => ({
    oauthCode: null,
    alive: true,
    completed: null,
    tab: 'example',
    axios: null,
    code: `<crud
 :columns.sync="columns"
 :http="axios"
 :list-index="list => list"
 :rows-per-page="3"
 @successOnPut="notifyUpdate"
 pagination-rows-per-page-index="limit"
 pagination-sort-index="sortBy"
 api="games"
 row-key="id"
/>`,
    columns: [
      {
        name: 'name',
        required: true,
        label: 'Name',
        align: 'left',
        field: 'name',
        sortable: true,
        qComponent: 'QInput',
        size: '6',
        value: '',
        showCreate: true
      },
      {
        name: 'birth',
        required: true,
        label: 'Birth',
        align: 'center',
        field: 'birth',
        sortable: true,
        qComponent: 'QInput',
        value: '',
        size: '4',
        showCreate: true
      },
      {
        name: 'img',
        required: true,
        label: 'Img',
        align: 'center',
        field: 'img',
        qComponent: 'QInput',
        value: '',
        size: '4',
        showCreate: true,
        customize: true
      }
    ]
  }),
  computed: {
    columnsString () {
      let columns = JSON.parse(JSON.stringify(this.columns))
      columns[0].rules = '[val => val && val.length > 0 || "Please type something"]'
      return 'columns: ' + JSON.stringify(columns, null, 2)
    }
  },
  methods: {
    notifyUpdate () {
      Notify.create({ type: 'positive', message: 'Update successful!' })
    }
  }
}
</script >

<style lang="sass" scoped>
.q-tab-panel
  padding: 0px
</style>