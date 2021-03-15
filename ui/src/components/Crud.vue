<template>
  <div>
    <q-table
      :data="response"
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
          <q-td
            auto-width
            v-if="selectionMode !== 'none'"
          >
            <q-checkbox
              v-if="selectableRule(props.row)"
              v-model="props.selected"
            />
          </q-td>

          <template v-for="column in columns">
            <template v-if="showCustomVisibleColumns">
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
                {{ column.format ? column.format(props.row[column.name]) : props.row[column.name] }}
              </q-td>
            </template>
          </template>
        </q-tr>
      </template>

      <template v-slot:top-right>
        <div class="row q-col-gutter-sm q-pa-sm">
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
                v-model="column.value"
                :is="column.type"
                :mask="column.type == 'QInput' && column.mask ? column.mask : ''"
                :type="column.subType"
                :name="column.name"
                :float-label="column.label"
                :label="column.label"
                :options="column.options"
                :inline="column.inline"
                :disable="column.disabled"
                :rules="column.rules"
                :ref="column.name"
                filter
                left-label
              />
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
import { Dialog, Notify, QSelect, QInput, QOptionGroup, QToggle } from 'quasar'

export default {
  name: 'Crud',
  components: {
    QSelect, QInput, QOptionGroup, QToggle
  },
  props: {
    api: { type: String, required: true },
    columns: { type: Array, required: true },
    createRule: { type: Boolean, default: true },
    canCreate: { type: Boolean, default: false },
    canDelete: { type: Boolean, default: false },
    canEdit: { type: Boolean, default: false },
    http: { type: Function, required: true },
    iconDelete: { type: [String, Function], default: 'delete' },
    iconDeleteColor: { type: [String, Function], default: 'negative' },
    itemName: { type: String, default: '' },
    getOnStart: { type: Boolean, default: true },
    getOnParamChange: { type: Boolean, default: false },
    listIndex: { type: Function, required: true },
    msgDelete: { type: [String, Function], default: 'Delete item ?' },
    msgDeleteSucess: { type: [String, Function], default: 'Deleted with sucess!' },
    msgCreatedSucess: { type: [String, Function], default: 'Created!' },
    msgUpdatedSucess: { type: [String, Function], default: 'Updated!' },
    msgCanceledAction: { type: [String, Function], default: 'Canceled ...' },
    selectableRule: { type: Function, default: () => true },
    search: { type: String, default: '' },
    rowKey: { type: String, required: true },
    rowsPerPage: { type: Number, default: 3 },
    params: { type: String, default: '' },
    paginationPageIndex: { type: String, default: 'page' },
    paginationRowsPerPageIndex: { type: String, default: 'per_page' },
    paginationSortIndex: { type: String, default: 'sort' },
    paginationTotalIndex: { type: String, default: 'total' },
    title: { type: String, default: '' },
    visibleColumns: { type: Array, default: () => ([]) },
    titleDelete: { type: [String, Function], default: 'Delete' },
  },
  data: () => ({
    group: [],
    loading: false,
    modalOpened: false,
    selected: [],
    response: [],
    pagination: {
      page: 0,
      rowsPerPage: 1,
      rowsNumber: 1,
      descending: false,
      sortBy: ''
    }
  }),
  computed: {
    showCustomVisibleColumns () {
      return this.visibleColumns.lenght > 0 ? this.visibleColumns.includes(column.name) : true
    },
    filteredColumns () {
      return this.columns.filter(column => column.showCreate)
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
    someSelected () {
      return this.selected.length > 0
    },
    hasCustomSelectedSlot () {
      return !!this.$slots['customSelected'] || !!this.$scopedSlots['customSelected']
    },
    fieldsWithValidation () {
      return this.columns.filter(column => column.rules)
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
    hasValidationErrors () {
      return this.fieldsWithValidation.some(field => this.$refs[field.name][0].hasError)
    },
    toggleModal () {
      this.resetColumnsValues()
      this.modalOpened = !this.modalOpened
    },
    toggleModalWithData () {
      this.populateColumnsWithSelectedRow()
      this.modalOpened = !this.modalOpened
    },
    toggleConfirmDelete () {
      Dialog.create({
        title: typeof this.titleDelete === 'function' ? this.titleDelete(this.selected[0]) : this.titleDelete,
        message: typeof this.msgDelete === 'function' ? this.msgDelete(this.selected[0]) : this.msgDelete,
        ok: 'Sim',
        cancel: 'Não'
      }).onOk(() => {
        this.delete()
      }).onCancel(() => {
        Notify.create(this.msgCanceledAction)
      })
    },
    get () {
      let page = Object.assign(this.pagination.page, '')
      let withSearch = this.search ? `${this.api}${this.search}?${this.params}&` : `${this.api}?`
      let url = withSearch +
        `${this.paginationPageIndex}=${page}&` +
        `${this.paginationRowsPerPageIndex}=${this.pagination.rowsPerPage}&` +
        `${this.paginationSortIndex}=${this.pagination.sortBy},${this.sortDirection}&`

      this.loading = true
      this.http.get(url)
        .then(response => {
          this.response = this.listIndex(response.data)
          this.pagination.rowsNumber = response.data[this.paginationTotalIndex]
          this.pagination.rowsPerPage = response.data[this.paginationRowsPerPageIndex]
          this.loading = false
        })
        .catch(error => {
          this.$emit('error', error)
          this.loading = false
        })
    },
    delete () {
      this.loading = true
      this.http.delete(`${this.api}/${this.selected[0].id}`)
        .then(response => {
          Notify.create({ type: 'negative', message: typeof this.msgDeleteSucess === 'function' ? this.msgDeleteSucess(this.selected[0]) : this.msgDeleteSucess })
          this.get()
          this.selected = []
          this.loading = false
        })
        .catch(error => {
          this.$emit('error', error)
          this.loading = false
        })
    },
    save () {
      if (this.hasValidationErrors()) {
        this.resetValitation()
        return
      }
      this.loading = true
      if (this.selected.length > 0) {
        this.put()
        return
      }

      this.post()
    },
    post () {
      this.http.post(this.api, this.objectToSave)
        .then(response => {
          this.get()
          Notify.create({ type: 'positive', message: this.msgCreatedSucess })
          this.loading = false
          this.$emit('created', response)
          this.toggleModal()
        })
        .catch(error => {
          Notify.create('error', error)
          this.loading = false
        })
    },
    put () {
      this.http.put(`${this.api}/${this.selected[0].id}`, this.objectToSave)
        .then(response => {
          this.get()
          Notify.create({ type: 'positive', message: this.msgUpdatedSucess })
          this.loading = false
          this.$emit('updated', response)
          this.toggleModal()
        })
        .catch(error => {
          console.log(error)
          Notify.create(error)
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
    resetValitation () {
      this.fieldsWithValidation.forEach(field => this.$refs[field.name][0].validate())
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
