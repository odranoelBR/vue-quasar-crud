<template>
  <div>
    <q-table
      ref="table"
      :data="response"
      :selection="selectionMode"
      :pagination.sync="pagination"
      :selected.sync="selected"
      :loading="loading"
      v-bind="$props"
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
            <q-td
              v-if="column.customize"
              :key="column.name"
            >
              <slot
                :row="props.row"
                :name="`body-cell-${column.name}`"
              />
            </q-td>
            <q-td
              v-else
              :key="column.name"
            >
              {{ column.format ? column.format(props.row[column.name]) : props.row[column.name] }}
            </q-td>
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
              :color="iconDeleteColor"
              :icon="iconDelete"
              @click="toggleConfirmDelete()"
            />
          </div>
          <div
            v-if="createRule && canCreate && !someSelected"
            class="col"
          >
            <q-btn
              color="secondary"
              :icon="iconCreate"
              @click="toggleModal()"
            />
          </div>
          <div
            v-if="someSelected && canEdit"
            class="col"
          >
            <q-btn
              color="secondary"
              :icon="iconUpdate"
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
          {{ modalTextTitle }}
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row q-col-gutter-xs">
            <div
              v-for="(column, index) in columnsToRender"
              :key="index"
              :class="`col-${column.size}`"
            >
              <component
                v-model="column.value"
                :is="column.qComponent"
                :ref="column.name"
                v-bind="column"
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
/**
   * The only true CRUD Table.
   * @display API
   */
import {
  Dialog, Notify, QSelect, QInput, QOptionGroup, QToggle,
  QTable, QCardSection, QSeparator, QCard, QDialog, QBtn,
  QTd, QTr, QCheckbox
} from 'quasar'
import { formatForPostValidator } from './helper.js'
let qTableProps = JSON.parse(JSON.stringify(QTable.options.props))
delete qTableProps.data
delete qTableProps.pagination
delete qTableProps.selection
delete qTableProps.selected
delete qTableProps.loading
delete qTableProps.columns

export default {
  name: 'Crud',
  components: {
    Dialog, Notify, QSelect, QInput, QOptionGroup, QToggle,
    QTable, QCardSection, QSeparator, QCard, QDialog, QBtn,
    QTd, QTr, QCheckbox
  },
  props: {
    ...qTableProps,
    /** The rest API endpoint */
    api: { type: String, required: true },
    /** The Quasar Columns config 
     * @link https://quasar.dev/vue-components/table#defining-the-columns
     */
    columns: {
      type: Array, default: () => ([]), validator: formatForPostValidator, required: true
    },
    createRule: { type: Boolean, default: true },
    /** Enable / Disable POST http creation of resource */
    canCreate: { type: Boolean, default: true },
    /** Enable / Disable DELETE http deletion of resource */
    canDelete: { type: Boolean, default: true },
    /** Enable / Disable PUT http edit of resource */
    canEdit: { type: Boolean, default: true },
    /** The Axios instance
     *  @example axios.create({ baseURL: 'https://reqres.in/' })
     */
    http: { type: Function, required: true },
    /** The icon of delete button  */
    iconDelete: { type: String, default: 'delete' },
    /** The icon of create button  */
    iconCreate: { type: String, default: 'add' },
    /** The color of edit button */
    iconUpdate: { type: String, default: 'edit' },
    /** The color of delete button */
    iconDeleteColor: { type: String, default: 'negative' },
    /** The text of title on modal create */
    modalTextTitleCreate: { type: String, default: 'Create new' },
    /** The text of title on modal update */
    modalTextTitleUpdate: { type: String, default: 'Update this' },
    /** The component will fetch remote data on mounted hook */
    getOnStart: { type: Boolean, default: true },
    /** The component will fetch remote data on params props change */
    getOnParamChange: { type: Boolean, default: false },
    /** The function that will filter the data from the axios response 
     * @example axios response from the server 
     * { data: { people: [..., ...]}, status: 200, headers: {} ... }
     * So a function can be list => list.people
     * @link https://github.com/axios/axios#response-schema
     */
    listIndex: { type: Function, required: true },
    /** The function to allow user select the row 
     * @example selectableRule (row) { return row.status === 'ACTIVE' }
     */
    selectableRule: { type: Function, default: () => true },
    /** The index of rows (id) */
    rowKey: { type: String, required: true },
    /** The quasar pagination system
     * @link https://quasar.dev/vue-components/table#pagination
     */
    rowsPerPage: { type: Number, default: 3 },
    /** Query params of the url
     * @link https://en.wikipedia.org/wiki/Query_string
     */
    params: { type: String, default: '' },
    /** The quasar pagination system
     * @link https://quasar.dev/vue-components/table#pagination
     */
    paginationPageIndex: { type: String, default: 'page' },
    /** The quasar pagination system
     * @link https://quasar.dev/vue-components/table#pagination
     */
    paginationRowsPerPageIndex: { type: String, default: 'per_page' },
    /** The quasar pagination system
     * @link https://quasar.dev/vue-components/table#pagination
     */
    paginationSortIndex: { type: String, default: 'sort' },
    /** The quasar pagination system
     * @link https://quasar.dev/vue-components/table#pagination
     */
    paginationTotalIndex: { type: String, default: 'total' },
    /** Define if pagination will be server side */
    paginationServerSide: { type: Boolean, default: true },
    /** The message on dialog to confirm deletation */
    msgDelete: { type: [String, Function], default: 'Delete item ?' },
    /** The title of modal delete */
    titleDelete: { type: [String, Function], default: 'Delete' },
  },
  data: () => ({
    group: [],
    loading: false,
    modalOpened: false,
    selected: [],
    response: [],
    pagination: {
      page: 1,
      rowsPerPage: 1,
      descending: false,
      sortBy: ''
    }
  }),
  computed: {
    modalTextTitle () {
      return this.someSelected ? this.modalTextTitleUpdate : this.modalTextTitleCreate
    },
    columnsToRender () {
      return this.someSelected ? this.filteredColumnsForUpdate : this.filteredColumnsForCreate
    },
    filteredColumnsForCreate () {
      return this.columns.filter(column => column.showCreate)
    },
    filteredColumnsForUpdate () {
      return this.columns.filter(column => column.showUpdate)
    },
    apiUri () {
      if (this.paginationServerSide) {
        return this.params ? `${this.api}?${this.params}&` : `${this.api}?` +
          `${this.paginationPageIndex}=${this.pagination.page}&` +
          `${this.paginationRowsPerPageIndex}=${this.pagination.rowsPerPage}&` +
          `${this.paginationSortIndex}=${this.pagination.sortBy},${this.sortDirection}`
      }
      return this.params ? `${this.api}?${this.params}&` : `${this.api}`
    },
    sortDirection () {
      return this.pagination.descending ? 'desc' : 'asc'
    },
    objectToSave () {
      let list = this.columns
        .filter(column => column.value !== null && column.value !== '')
        .map(column => ({
          [column.name]: column.hasOwnProperty('formatForPost') ? column.formatForPost(column.value) : column.value
        }))
      return Object.assign({}, ...list)
    },
    selectionMode () {
      return (this.canCreate || this.canEdit || this.canDelete) ? 'single' : 'none'
    },
    someSelected () {
      return this.selected.length > 0
    },
    hasCustomSelectedSlot () {
      return !!this.$slots['customSelected'] || !!this.$scopedSlots['customSelected']
    },
    fieldsWithValidation () {
      return this.columns.filter(column => column.rules)
    },
    titleDeleteForShow () {
      return typeof this.titleDelete === 'function' ? this.titleDelete(this.selected[0]) : this.titleDelete
    },
    messageDeleteForShow () {
      return typeof this.msgDelete === 'function' ? this.msgDelete(this.selected[0]) : this.msgDelete
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
    if (this.paginationServerSide) {
      this.pagination.rowsNumber = 1
    }
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
      this.resetColumnValues()
      this.modalOpened = !this.modalOpened
    },
    toggleModalWithData () {
      this.populateColumnsWithSelectedRow()
      this.modalOpened = !this.modalOpened
    },
    toggleConfirmDelete () {
      Dialog.create({ title: this.titleDeleteForShow, message: this.messageDeleteForShow, ok: 'Yes', cancel: 'No' })
        .onOk(() => {
          this.delete()
        }).onCancel(() => {
          Notify.create(this.msgCanceledAction)
        })
    },
    get () {
      this.loading = true
      this.http.get(this.apiUri)
        .then(response => {
          /**
          *  $emit('successOnGet', response) on sucefull get request.
          */
          this.$emit('successOnGet', response)
          this.response = this.listIndex(response.data)
          this.organizePagination(response)

        })
        .catch(error => {
          /**
           *  Emit the ERROR Object of axios catch.
           */
          this.$emit('errorOnGet', error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    delete () {
      this.loading = true
      this.http.delete(`${this.api}/${this.selected[0].id}`)
        .then(response => {
          this.get()
          /**
           *  $emit('successOnDelete', selected) on sucefull delete request.
           */
          this.$emit('successOnDelete', this.selected)
          this.selected = []
        })
        .catch(error => {
          /**
           *  $emit('errorOnDelete', error) Object of axios catch.
           */
          this.$emit('errorOnDelete', error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    post () {
      this.http.post(this.api, this.objectToSave)
        .then(response => {
          this.get()
          /**
           *  $emit('successOnPost', selected) on sucefull created request.
           */
          this.$emit('successOnPost', this.selected)
          this.toggleModal()
        })
        .catch(error => {
          /**
          *  $emit('errorOnDelete', error) Object of axios catch.
          */
          this.$emit('errorOnPost', error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    put () {
      this.http.put(`${this.api}/${this.selected[0].id}`, this.objectToSave)
        .then(response => {
          this.get()
          /**
           *  $emit('successOnPut', selected) on sucefull update request.
           */
          this.$emit('successOnPut', this.selected)
          this.toggleModal()
        })
        .catch(error => {
          /**
        *  $emit('errorOnPut', error) Object of axios catch.
        */
          this.$emit('errorOnPut', error)
        })
        .finally(() => {
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
    request ({ pagination }) {
      this.pagination = pagination

      this.get()
    },
    populateColumnsWithSelectedRow () {
      this.columns.forEach(column => {
        if (column.type === 'QOptionGroup') {
          column.value = this.selected[0][column.name] ? this.selected[0][column.name].split('') : ['ALL']
          return
        }
        column.value = this.selected[0][column.name]
      })
    },
    resetValitation () {
      this.fieldsWithValidation
        .filter(field => this.$refs[field.name].hasOwnProperty('rules'))
        .forEach(field => this.$refs[field.name][0].validate())
    },
    resetColumnValues () {
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

        if (typeof (column.value) === 'number') {
          column.value = 0
          return
        }

        if (column.value instanceof Array) {
          column.value = []
        }
      }
      )
    },
    organizePagination (response) {
      if (response.data[this.paginationTotalIndex]) {
        this.pagination.rowsNumber = response.data[this.paginationTotalIndex]
      }
    },
    selectableRuleDefault (row) {
      return !!row
    }
  }
}
</script>
