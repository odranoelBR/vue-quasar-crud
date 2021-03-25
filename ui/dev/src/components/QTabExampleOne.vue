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
        name="mails"
        label="Example"
      />
      <q-tab
        class="text-orange"
        name="alarms"
        label="Template"
      />
      <q-tab
        class="text-teal"
        name="movies"
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
        name="mails"
        ref="panel"
      >
        <crud
          :columns.sync="columns"
          :http="axios"
          :can-edit="true"
          :can-create="true"
          :can-delete="true"
          :get-on-start="true"
          :list-index="list => list.data"
          :visible-columns="['email']"
          api="api/users"
          title="Emails"
          row-key="id"
        />
      </q-tab-panel>

      <q-tab-panel name="alarms">
        <highlightjs
          language="htmlbars"
          :code="code"
        />
      </q-tab-panel>

      <q-tab-panel name="movies">
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

export default {
  components: {
    Crud
  },
  created () {
    this.axios = axios.create({ baseURL: 'https://reqres.in/' })
  },
  data: () => ({
    tab: 'mails',
    axios: null,
    code: `<crud
 :columns.sync="columns"
 :http="axios"
 :can-edit="true"
 :can-create="true"
 :can-delete="true"
 :get-on-start="true"
 :list-index="list => list.data"
 :visible-columns="['email']"
 api="api/users"
 title="Emails"
 row-key="id"
/>`,
    columns: [
      {
        name: 'first_name',
        required: true,
        label: 'Name',
        align: 'left',
        field: 'first_name',
        sortable: true,
        type: 'QInput',
        value: '',
        size: '6',
        rules: [val => val && val.length > 0 || 'Please type something'],
        showCreate: true
      },
      {
        name: 'email',
        required: true,
        label: 'Email',
        align: 'center',
        field: 'email',
        sortable: true,
        type: 'QInput',
        static: true,
        value: '',
        size: '6',
        showCreate: true
      }
    ]
  }),
  computed: {
    columnsString () {
      return 'columns: ' + JSON.stringify(this.columns, null, 2)
    }
  }
}
</script >

<style lang="sass" scoped>
.q-tab-panel
    padding: 0px
</style>