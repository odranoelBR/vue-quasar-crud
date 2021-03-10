<template>
  <q-page
    padding
    class="row justify-center"
  >
    <crud
      :columns.sync="columns"
      :selectable-rule="() => {}"
      :http="axios"
      :get-on-start="true"
      search=""
      :list-index="list => list"
      api="mockend-api/posts"
      row-key=""
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
        label: 'title',
        align: 'title',
        field: 'title',
        sortable: true,
        type: 'QInput',
        value: '',
        size: '6',
        validate: 'required',
        showCreate: true
      },
      {
        name: 'views',
        required: true,
        label: 'views',
        align: 'views',
        field: 'views',
        sortable: true,
        type: 'QInput',
        static: true,
        value: '',
        size: '6',
        mask: 'AA',
        validate: 'required',
        showCreate: false
      },
      {
        name: 'published',
        required: true,
        label: 'published',
        align: 'published',
        field: 'published',
        sortable: true,
        type: 'QSelect',
        value: '',
        formatForPost: val => val.value,
        options: [
          { label: 'Militar', value: 'M' },
          { label: 'Dependente', value: 'D' },
          { label: 'Pensionista', value: 'P' }
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
.list
  width: 700px
  max-width: 100%
</style>
