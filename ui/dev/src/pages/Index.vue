<template>
  <q-page
    padding
    class="row justify-center"
  >
    <crud
      :columns.sync="columns"
      :http="axios"
      :can-edit="true"
      :can-create="true"
      :can-delete="true"
      :get-on-start="true"
      :list-index="list => list.data"
      api="api/users"
      title="Emails"
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
    this.axios = axios.create({ baseURL: 'https://reqres.in/' })
  },
  data: () => ({
    axios: null,
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
  })
}
</script>

<style lang="sass" scoped>
</style>
