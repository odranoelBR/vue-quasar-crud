<template>
  <q-page
    padding
    class="row justify-center"
  >
    <crud
      :columns.sync="columns"
      :visible-columns="['nome', 'sigla', 'tipo']"
      :can-create="true"
      :can-delete="true"
      :can-edit="false"
      :selectable-rule="() => {}"
      :create-rule="true"
      :rows-per-page="25"
      :params="``"
      :http="axios"
      :get-on-start="true"
      :get-on-param-change="true"
      filter-column="nome"
      search="/search/findByCodigoAndNomeContaining"
      msg-delete="Deseja remover este posto ?"
      title-delete="Remover"
      icon-delete="delete"
      :item-name="`Posto de `"
      list-index="postoIdentificacaos"
      api="identificacao-api/postoIdentificacaos"
      row-key="nome"
    />
  </q-page>
</template>

<script>
import Crud from '../../../src/components/Crud'
import axios from 'axios'
export default {
  components: { Crud },
  data: () => ({
    axios,
    columns: [
      {
        name: 'nome',
        required: true,
        label: 'Nome',
        align: 'nome',
        field: 'nome',
        sortable: true,
        type: 'QInput',
        value: '',
        size: '6',
        validate: 'required',
        showCreate: true
      },
      {
        name: 'sigla',
        required: true,
        label: 'Sigla',
        align: 'sigla',
        field: 'sigla',
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
        name: 'tipo',
        required: true,
        label: 'Tipo',
        align: 'tipo',
        field: 'tipo',
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
      },
      {
        name: 'codigo',
        label: 'codigo',
        align: 'center',
        field: 'codigo',
        formatForPost: val => val.value,
        value: '',
        static: true
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
