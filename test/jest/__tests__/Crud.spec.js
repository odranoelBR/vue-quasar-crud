import { mountQuasar } from '../index'
import { Dialog } from 'quasar'
import axios from 'axios'
import Crud from '@components/Crud.vue'
import columns from './columns.js'
jest.mock('axios');

axios.get.mockResolvedValue([]);

beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => { });
  jest.spyOn(console, 'error').mockImplementation(() => { });
});

const defautPropsData = {
  http: axios,
  api: '',
  columns,
  listIndex: (value) => (value),
  rowKey: ''
}

let returnData = [
  { id: 1, first_name: 'Brominator', 'email': 'bro@gmail.com' },
  { id: 2, first_name: 'Foo f', 'email': 'foo@gmail.com' }
]

test('all columns enabled to create', () => {

  const wrapper = mountQuasar(Crud, {
    propsData: defautPropsData
  })

  expect(wrapper.vm.filteredColumns).toHaveLength(2)
})

test('at least one row was selected', () => {
  axios.get.mockResolvedValue(returnData);

  const wrapper = mountQuasar(Crud, {
    propsData: defautPropsData
  })
  wrapper.setData({ selected: [returnData[0]] })

  expect(wrapper.vm.someSelected).toBeTruthy()
})

test('using customSelected slot', () => {
  const wrapper = mountQuasar(Crud, {
    propsData: defautPropsData,
    slots: {
      customSelected: '<div />'
    }
  })

  expect(wrapper.vm.hasCustomSelectedSlot).toBeTruthy()
})

test('get fields with validation', () => {
  const wrapper = mountQuasar(Crud, {
    propsData: defautPropsData
  })

  expect(wrapper.vm.fieldsWithValidation).toHaveLength(1)
  expect(wrapper.vm.fieldsWithValidation).toStrictEqual([defautPropsData.columns[0]])
})

test('custom message delete with function after user select', () => {

  axios.get.mockResolvedValue(returnData);

  defautPropsData.msgDelete = row => `Deleted ${row.first_name} ?`

  const wrapper = mountQuasar(Crud, {
    propsData: defautPropsData
  })

  wrapper.setData({ selected: [returnData[0]] })

  expect(wrapper.vm.messageDeleteForShow).toBe('Deleted Brominator ?')
})

test('custom title delete with function after user select', () => {

  axios.get.mockResolvedValue(returnData);

  defautPropsData.msgDelete = row => `Do you want delete ${row.first_name} ?`

  const wrapper = mountQuasar(Crud, {
    propsData: defautPropsData
  })

  wrapper.setData({ selected: [returnData[1]] })

  expect(wrapper.vm.messageDeleteForShow).toBe('Do you want delete Foo f ?')
})


test('get fields with validation', () => {

  const wrapper = mountQuasar(Crud, {
    propsData: defautPropsData
  })

  expect(wrapper.vm.fieldsWithValidation).toHaveLength(1)
  expect(wrapper.vm.fieldsWithValidation).toStrictEqual([defautPropsData.columns[0]])
})


test('mount component without make requests', () => {

  defautPropsData.getOnStart = false

  const spyOnGet = jest.spyOn(Crud.methods, 'get')

  const wrapper = mountQuasar(Crud, {
    propsData: defautPropsData
  })

  expect(spyOnGet).not.toBeCalled()
})

test('make a get request ONLY when param change', async () => {

  defautPropsData.getOnStart = false
  defautPropsData.getOnParamChange = true

  const spyOnGet = jest.spyOn(Crud.methods, 'get')

  const wrapper = mountQuasar(Crud, {
    propsData: defautPropsData
  })

  expect(spyOnGet).not.toBeCalled()

  await wrapper.setProps({ params: 'id=5' })
  expect(spyOnGet).toBeCalled()
})

test('only email column are visible to create', () => {

  defautPropsData.columns[0].showCreate = false
  axios.get.mockResolvedValue([]);

  const wrapper = mountQuasar(Crud, {
    propsData: defautPropsData
  })

  expect(wrapper.vm.filteredColumns).toHaveLength(1)
})

test('api url mounting defalt mouting', () => {

  defautPropsData.api = 'people'

  const wrapper = mountQuasar(Crud, {
    propsData: defautPropsData
  })

  expect(wrapper.vm.apiUri).toBe('people?page=1&per_page=3&sort=,asc')
})

test('object to save mounting empty', () => {

  axios.get.mockResolvedValue([]);
  defautPropsData.columns[0].value = ''
  defautPropsData.columns[1].value = ''

  const wrapper = mountQuasar(Crud, {
    propsData: defautPropsData
  })

  expect(wrapper.vm.objectToSave).toStrictEqual({})
})

test('object to save mounting simple values', () => {

  defautPropsData.columns[0].value = 'Brother Lee'
  defautPropsData.columns[1].value = 'brother@mail.com'

  const wrapper = mountQuasar(Crud, {
    propsData: defautPropsData
  })

  expect(wrapper.vm.objectToSave).toStrictEqual({ "email": "brother@mail.com", "first_name": "Brother Lee" })
})


test('object to save mounting complex values', () => {

  defautPropsData.columns[0].value = {}
  defautPropsData.columns[1].value = []

  const wrapper = mountQuasar(Crud, {
    propsData: defautPropsData
  })

  expect(wrapper.vm.objectToSave).toStrictEqual({ "email": [], "first_name": {} })
})

test('object to save mounting with formating values', () => {

  defautPropsData.columns[0].value = { value: 'BROTHER', label: 'Brother' }
  defautPropsData.columns[0].formatForPost = (value) => value.value

  defautPropsData.columns[1].value = 'brother'
  defautPropsData.columns[1].formatForPost = (value) => `${value}@mail.com`

  const wrapper = mountQuasar(Crud, {
    propsData: defautPropsData
  })

  expect(wrapper.vm.objectToSave).toStrictEqual({ "email": 'brother@mail.com', "first_name": 'BROTHER' })
})

test('column prop valitador with string value on format', () => {

  defautPropsData.columns[0].value = { value: 'BROTHER', label: 'Brother' }
  defautPropsData.columns[0].formatForPost = ''

  defautPropsData.columns[1].value = 'brother'
  defautPropsData.columns[1].formatForPost = {}

  const validator = Crud.props.columns.validator

  expect(validator(defautPropsData.columns)).toBeFalsy()
  expect(console.warn).toHaveBeenCalled();
})

test('open modal without data', () => {

  axios.get.mockResolvedValue([]);

  const wrapper = mountQuasar(Crud, {
    propsData: defautPropsData
  })
  const spyOnResetColumnsValuesMethod = jest.spyOn(wrapper.vm, 'resetColumnsValues')

  expect(wrapper.vm.modalOpened).toBeFalsy()
  wrapper.vm.toggleModal()

  expect(wrapper.vm.modalOpened).toBeTruthy()
  expect(spyOnResetColumnsValuesMethod).toHaveBeenCalled()
})
test('open modal with data after select a row ', () => {

  axios.get.mockResolvedValue(returnData);

  const wrapper = mountQuasar(Crud, {
    propsData: defautPropsData
  })

  wrapper.setData({ selected: [returnData[0]] })// select a row

  const spyOnResetColumnsValuesMethod = jest.spyOn(wrapper.vm, 'populateColumnsWithSelectedRow')

  expect(wrapper.vm.modalOpened).toBeFalsy()
  wrapper.vm.toggleModalWithData()

  expect(wrapper.vm.modalOpened).toBeTruthy()
  expect(spyOnResetColumnsValuesMethod).toHaveBeenCalled()
})

test('Dialog start DELETE request after click yes ', () => {

  const wrapper = mountQuasar(Crud, {
    propsData: defautPropsData
  })
  const spyOnDialog = spyOn(Dialog.create(), 'onOk')

  wrapper.vm.toggleConfirmDelete()

  expect(spyOnDialog).toHaveBeenCalled()
})