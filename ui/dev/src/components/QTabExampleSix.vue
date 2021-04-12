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
          :list-index="list => list.jogos"
          :can-delete="false"
          :can-create="false"
          :selectable-rule="item => item.completed"
          :rows-per-page="3"
          :pagination-server-side="false"
          @successOnPut="notifyUpdate"
          api="jogos"
          title="Tasks"
          row-key="id"
        />
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
    this.axios = axios.create({ baseURL: 'https://www.ludopedia.com.br/api/v1/' })
  },
  data: () => ({
    alive: true,
    completed: null,
    tab: 'example',
    axios: null,
    code: `<crud
 :columns.sync="columns"
 :http="axios"
 :list-index="list => list"
 :can-delete="false"
 :can-create="false"
 :selectable-rule="item => item.completed"
 :rows-per-page="3"
 :pagination-server-side="false"
 @successOnPut="notifyUpdate"
 params="completed=true"
 api="todos"
 title="Tasks"
 row-key="id"
/>`,
    columns: [
      {
        name: 'title',
        required: true,
        label: 'Title',
        align: 'left',
        field: 'title',
        sortable: true,
        qComponent: 'QInput',
        type: 'textarea',
        size: '6',
        value: '',
        rules: [val => val && val.length > 0 || 'Please type something'],
        showCreate: true
      },
      {
        name: 'completed',
        required: true,
        label: 'Done ?',
        align: 'completed',
        field: 'title',
        sortable: true,
        qComponent: 'QSelect',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        value: '',
        size: '4',
        showCreate: true
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