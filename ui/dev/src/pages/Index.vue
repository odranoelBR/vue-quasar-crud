<template>
  <q-page
    padding
    class="row justify-center"
  >
    <crud
      :columns.sync="columns"
      :http="axios"
      :can-edit="true"
      :get-on-start="true"
      search=""
      :list-index="list => list"
      api="mockend-api/posts"
      row-key="id"
    />
  </q-page>
</template>

<script>
import Crud from '../../../src/components/Crud'
import axios from 'axios'
export default {
  components: { Crud },
  created () {
    this.axios = axios.create({ baseURL: 'https://mockend.com/odranoelBR/' })
  },
  data: () => ({
    axios: null,
    columns: [
      {
        name: 'title',
        required: true,
        label: 'Title',
        align: 'title',
        field: 'title',
        sortable: true,
        type: 'QInput',
        value: '',
        size: '6',
        rules: [val => val && val.length > 0 || 'Please type something'],
        showCreate: true
      },
      {
        name: 'views',
        required: true,
        label: 'Views',
        align: 'views',
        field: 'views',
        sortable: true,
        type: 'QInput',
        static: true,
        value: '',
        size: '6',
        showCreate: false
      },
      {
        name: 'published',
        required: true,
        label: 'Published',
        align: 'published',
        field: 'published',
        sortable: true,
        type: 'QSelect',
        value: '',
        formatForPost: val => val.value,
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ],
        size: '6',
        validate: 'required',
        showCreate: true
      }
    ]
  })
}
</script>

<style lang="sass" scoped>
</style>
