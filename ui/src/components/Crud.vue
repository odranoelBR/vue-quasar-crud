<template>
  <div>
    <q-table
      :data="listaDados"
      :columns="columns"
      :row-key="rowKey"
      :pagination.sync="pagination"
      :selection="selectionMode"
      :visible-columns="visibleColumns"
      :selected.sync="selected"
      :loading="loading"
      :title="title"
      class="bg-white"
      @request="request"
    >
      <template
        slot="body"
        slot-scope="props"
      >
        <q-tr :props="props">
          <q-td auto-width>
            <q-checkbox
              v-if="selectableRule(props.row)"
              v-model="props.selected"
            />
          </q-td>

          <template v-for="column in columns">
            <template v-if="visibleColumns ? visibleColumns.includes(column.name) : true">
              <q-td
                v-if="column.customize"
                :key="column.name"
              >
                <slot
                  :row="props.row"
                  :name="column.name"
                />
              </q-td>
              <q-td
                v-else
                :key="column.name"
              >
                {{ column.format? column.format(props.row[column.name]) : props.row[column.name] }}
              </q-td>
            </template>
          </template>
        </q-tr>
      </template>

      <template v-slot:top-right>
        <div class="row q-pa-sm">
          <div
            v-if="someSelected && hasCustomSelectedSlot"
            class="col"
          >
            <slot
              :selected="selected[0]"
              name="customSelected"
            />
          </div>
          <div
            v-if="someSelected && canDelete"
            class="col"
          >
            <q-btn
              :color="typeof iconDeleteColor === 'function' ? iconDeleteColor(selected[0]) : iconDeleteColor"
              :icon="typeof iconDelete === 'function' ? iconDelete(selected[0]) : iconDelete"
              @click="toggleConfirmDelete()"
            />
          </div>
          <div
            v-if="createRule && canCreate && !someSelected"
            class="col"
          >
            <q-btn
              color="secondary"
              icon="add"
              @click="toggleModal()"
            />
          </div>
          <div
            v-if="someSelected && canEdit"
            class="col"
          >
            <q-btn
              color="secondary"
              icon="edit"
              @click="toggleModalWithData()"
            />
          </div>
        </div>
      </template>
    </q-table>
    <q-dialog
      v-model="modalOpened"
      full-width
    >
      <q-card>
        <q-card-section class="bg-primary text-white">
          {{ itemName }}
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row q-col-gutter-xs">
            <div
              v-for="(column, index) in filteredColumns"
              :key="index"
              :class="`col-${column.size}`"
            >
              <component
                :is="column.type"
                v-model="column.value"
                :mask="column.type == 'QInput' && column.mask ? column.mask : ''"
                v-validate="column.validate"
                :type="column.subType"
                :name="column.name"
                :float-label="column.label"
                :label="column.label"
                :options="column.options"
                :class="errors.has(column.name) ? 'text-negative' : 'text-positive'"
                :inline="column.inline"
                :disable="column.disabled"
                filter
                left-label
              />

              <span
                v-show="errors.has(column.name)"
                class="text-negative"
              >
                {{ errors.first(column.name) }}
              </span>
            </div>
          </div>
        </q-card-section>
        <q-card-section class="bg-neutral row">
          <div class="col">
            <q-btn
              color="secondary"
              icon="close"
              @click="toggleModal()"
            />
          </div>
          <q-btn
            :disabled="(hasValidationErrors && isFormDirty) || !isFormDirty"
            color="positive"
            class="text-right"
            icon="check"
            @click="save()"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { QSelect, QInput, QOptionGroup, QToggle } from 'quasar'

export default {
  name: 'Crud',
  components: {
    QSelect, QInput, QOptionGroup, QToggle
  },
  props: {
    listIndex: { type: String, required: true },
    api: { type: String, required: true },
    columns: { type: Array, required: true },
    rowKey: { type: String, required: true },
    canCreate: { type: Boolean, default: false },
    canDelete: { type: Boolean, default: false },
    canEdit: { type: Boolean, default: false },
    title: { type: String, default: '' },
    itemName: { type: String, default: '' },
    projection: { type: String, default: '' },
    selectableRule: { type: Function, default: () => true },
    createRule: { type: Boolean, default: true },
    rowsPerPage: { type: Number, default: 5 },
    search: { type: String, default: '' },
    params: { type: String, default: '' },
    getOnStart: { type: Boolean, default: true },
    getOnParamChange: { type: Boolean, default: false },
    visibleColumns: { type: Array, default: () => ([]) },
    iconDelete: { type: [String, Function], default: 'delete' },
    iconDeleteColor: { type: [String, Function], default: 'negative' },
    msgDelete: { type: [String, Function], default: 'Prosseguir com a deleção deste item ?' },
    titleDelete: { type: [String, Function], default: 'Deletar' },
    msgDeleteSucess: { type: [String, Function], default: 'Deletado com sucesso!' },
    http: { type: Function, required: true }
  },
  data: () => ({
    group: [],
    loading: false,
    modalOpened: false,
    selected: [],
    response: {
      _embedded: []
    },
    pagination: {
      page: 0,
      rowsPerPage: 10,
      rowsNumber: 10,
      descending: false,
      sortBy: 'status'
    }
  }),
  computed: {
    filteredColumns () {
      return this.columns.filter(column => column.showCreate)
    },
    listaDados () {
      return this.response._embedded[this.listIndex]
    },
    apiUri () {
      return `${this.api}?page=${this.pagination.page}&size=${this.pagination.rowsPerPage}&sort=${this.pagination.sortBy},${this.sortDirection}`
    },
    sortDirection () {
      return this.pagination.descending ? 'desc' : 'asc'
    },
    objectToSave () {
      let list = this.columns
        .filter(column => column.value !== null && column.value !== '')
        .map(column => ({
          [column.name]: column.formatForPost ? column.formatForPost(column.value) : column.value
        }))
      return Object.assign({}, ...list)
    },
    selectionMode () {
      return (this.canCreate || this.canEdit) ? 'single' : 'none'
    },
    projectionForQuery () {
      return this.projection ? `projection=${this.projection}` : ''
    },
    someSelected () {
      return this.selected.length > 0
    },
    hasValidationErrors () {
      return Object.keys(this.fields).some(key => this.fields[key].invalid)
    },
    isFormDirty () {
      return Object.keys(this.fields).some(key => this.fields[key].dirty)
    },
    hasCustomSelectedSlot () {
      return !!this.$slots['customSelected'] || !!this.$scopedSlots['customSelected']
    }
  },
  watch: {
    params () {
      if (this.getOnParamChange) {
        this.get()
      }
    }
  },
  created () {
    this.pagination.rowsPerPage = this.rowsPerPage
  },
  mounted () {
    if (this.getOnStart) {
      this.get()
    }
  },
  methods: {
    toggleModal () {
      this.resetColumnsValues()
      this.modalOpened = !this.modalOpened
    },
    toggleModalWithData () {
      this.populateColumnsWithSelectedRow()
      this.$validator.reset()
      this.modalOpened = !this.modalOpened
    },
    toggleConfirmDelete () {
      this.$q.dialog({
        title: typeof this.titleDelete === 'function' ? this.titleDelete(this.selected[0]) : this.titleDelete,
        message: typeof this.msgDelete === 'function' ? this.msgDelete(this.selected[0]) : this.msgDelete,
        ok: 'Sim',
        cancel: 'Não'
      }).onOk(() => {
        this.delete()
      }).onCancel(() => {
        this.$q.notify('Ação cancelada...')
      })
    },
    get () {
      let page = Object.assign(this.pagination.page, '')
      let withSearch = this.search ? `${this.api}${this.search}?${this.params}&` : `${this.api}?`
      let url = withSearch +
        `page=${--page}&` +
        `size=${this.pagination.rowsPerPage}&` +
        `sort=${this.pagination.sortBy},${this.sortDirection}&` +
        this.projectionForQuery

      this.loading = true
      this.$http.get(url)
        .then(response => {
          this.response = response.data
          this.pagination.rowsNumber = response.data.page.totalElements
          this.pagination.rowsPerPage = response.data.page.size
          this.loading = false
        })
        .catch(error => {
          this.$bus.$emit('error', error)
          this.loading = false
        })
    },
    delete () {
      this.loading = true
      this.$http.delete(`${this.api}/${this.selected[0].id}`)
        .then(response => {
          this.$q.notify({ type: 'negative', message: typeof this.msgDeleteSucess === 'function' ? this.msgDeleteSucess(this.selected[0]) : this.msgDeleteSucess })
          this.get()
          this.selected = []
          this.loading = false
        })
        .catch(error => {
          this.$bus.$emit('error', error)
          this.loading = false
        })
    },
    save () {
      this.loading = true
      if (this.selected.length > 0) {
        this.put()
        return
      }

      this.post()
    },
    post () {
      this.$http.post(this.api, this.objectToSave)
        .then(response => {
          this.get()
          this.$q.notify({ type: 'positive', message: 'Criado com sucesso!' })
          this.loading = false
          this.$emit('created', response.data)
          this.toggleModal()
        })
        .catch(error => {
          this.$bus.$emit('error', error)
          this.loading = false
        })
    },
    put () {
      this.$http.put(`${this.api}/${this.selected[0].id}`, this.objectToSave)
        .then(response => {
          this.get()
          this.$q.notify({ type: 'positive', message: 'Atualizado com sucesso!' })
          this.loading = false
          this.$emit('updated', response.data)
          this.toggleModal()
        })
        .catch(error => {
          this.$q.notify(error.response.data.errors)
          this.loading = false
        })
    },
    request ({ pagination, filter }) {
      this.pagination.rowsPerPage = pagination.rowsPerPage
      this.pagination.sortBy = pagination.sortBy
      this.pagination.rowsNumber = pagination.rowsNumber
      this.pagination.page = pagination.page
      this.pagination.descending = pagination.descending

      if (pagination.rowsPerPage === 0) {
        this.pagination.rowsPerPage = 200
      }

      this.get()
    },
    populateColumnsWithSelectedRow () {
      this.columns.forEach(column => {
        if (column.type === 'QOptionGroup') {
          column.value = this.selected[0][column.name] ? this.selected[0][column.name].split('') : ['TODOS']
          return
        }
        column.value = this.selected[0][column.name]
      })
    },
    resetColumnsValues () {
      this.columns.forEach(column => {
        if (column.static) {
          return
        }
        if (column.value instanceof String ||
          column.value instanceof Boolean ||
          typeof (column.value) === 'string' ||
          typeof (column.value) === 'boolean') {
          column.value = ''
          return
        }
        if (column.value instanceof Number) {
          column.value = 0
          return
        }
        if (column.value instanceof Array) {
          column.value = []
        }
      }
      )
    },
    selectableRuleDefault (row) {
      return !!row
    }
  }
}
</script>
