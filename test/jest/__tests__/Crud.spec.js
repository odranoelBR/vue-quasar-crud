import { mountQuasar } from '../index'
import axios from 'axios'
import Crud from '@components/Crud.vue'
import columns from './columns.js'
import response from './response.json'

jest.mock('axios');

beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => { });
  jest.spyOn(console, 'error').mockImplementation(() => { });
});

const defaultPropsData = () => ({
  http: axios,
  api: '',
  columns: JSON.parse(JSON.stringify(columns)),
  listIndex: value => value,
  rowKey: ''
})

let returnData = [
  { id: 1, first_name: 'Brominator', email: 'bro@gmail.com' },
  { id: 2, first_name: 'Foo f', email: 'foo@gmail.com' }
]

test('all columns enabled to create', () => {
  axios.get.mockResolvedValueOnce([]);

  const wrapper = mountQuasar(Crud, {
    propsData: defaultPropsData()
  })

  expect(wrapper.vm.columnsToRender).toHaveLength(2)
})

test('at least one row was selected', () => {
  axios.get.mockResolvedValueOnce(returnData);

  const wrapper = mountQuasar(Crud, {
    propsData: defaultPropsData()
  })
  wrapper.setData({ selected: [returnData[0]] })

  expect(wrapper.vm.someSelected).toBeTruthy()
})

test('using customSelected slot', () => {
  axios.get.mockResolvedValueOnce([]);

  const wrapper = mountQuasar(Crud, {
    propsData: defaultPropsData(),
    slots: {
      customSelected: '<div />'
    }
  })

  expect(wrapper.vm.hasCustomSelectedSlot).toBeTruthy()
})

test('get fields with validation', () => {
  axios.get.mockResolvedValueOnce([]);

  const props = defaultPropsData()

  const wrapper = mountQuasar(Crud, {
    propsData: props
  })

  expect(wrapper.vm.fieldsWithValidation).toHaveLength(1)
  expect(wrapper.vm.fieldsWithValidation).toStrictEqual([props.columns[0]])
})

test('custom message delete with function after user select', () => {
  axios.get.mockResolvedValueOnce(returnData);

  const props = defaultPropsData()
  props.msgDelete = row => `Deleted ${row.first_name} ?`

  const wrapper = mountQuasar(Crud, {
    propsData: props
  })

  wrapper.setData({ selected: [returnData[0]] })

  expect(wrapper.vm.messageDeleteForShow).toBe('Deleted Brominator ?')
})

test('custom title delete with function after user select', () => {

  axios.get.mockResolvedValueOnce(returnData);

  const props = defaultPropsData()
  props.titleDelete = row => `Do you want delete ${row.first_name} ?`

  const wrapper = mountQuasar(Crud, {
    propsData: props
  })

  wrapper.setData({ selected: [returnData[1]] })

  expect(wrapper.vm.titleDeleteForShow).toBe('Do you want delete Foo f ?')
})


test('get fields with validation', () => {

  axios.get.mockResolvedValueOnce();

  const props = defaultPropsData()

  const wrapper = mountQuasar(Crud, {
    propsData: props
  })

  expect(wrapper.vm.fieldsWithValidation).toHaveLength(1)
  expect(wrapper.vm.fieldsWithValidation).toStrictEqual([props.columns[0]])
})


test('mount component without make requests', () => {

  const props = defaultPropsData()
  props.getOnStart = false

  const wrapper = mountQuasar(Crud, {
    propsData: props
  })

  const spyOnGet = jest.spyOn(wrapper.vm, 'get')

  expect(spyOnGet).not.toBeCalled()
})

test('make a get request ONLY when param change', async () => {

  const props = defaultPropsData()

  props.getOnStart = false
  props.getOnParamChange = true

  const wrapper = mountQuasar(Crud, {
    propsData: props
  })

  const spyOnGet = jest.spyOn(wrapper.vm, 'get')

  expect(spyOnGet).not.toBeCalled()

  await wrapper.setProps({ params: 'id=5' })
  expect(spyOnGet).toBeCalled()
})

test('only email column are visible to create', () => {

  const props = defaultPropsData()

  props.columns[0].showCreate = false
  axios.get.mockResolvedValue([]);

  const wrapper = mountQuasar(Crud, {
    propsData: props
  })

  expect(wrapper.vm.columnsToRender).toHaveLength(1)
})

test('api url mounting default mouting', () => {

  const props = defaultPropsData()

  props.api = 'people'

  const wrapper = mountQuasar(Crud, {
    propsData: props
  })

  expect(wrapper.vm.apiUri).toBe('people?page=1&per_page=3&sort=,asc')
})

test('api url mounting no server side pagination', () => {

  const props = defaultPropsData()

  props.api = 'people'
  props.paginationServerSide = false

  const wrapper = mountQuasar(Crud, {
    propsData: props
  })

  expect(wrapper.vm.apiUri).toBe('people')
})

test('object to save mounting empty', () => {

  axios.get.mockResolvedValue([]);

  const props = defaultPropsData()

  props.columns[0].value = ''
  props.columns[1].value = ''

  const wrapper = mountQuasar(Crud, {
    propsData: props
  })

  expect(wrapper.vm.objectToSave).toStrictEqual({})
})

test('object to save mounting simple values', () => {

  const props = defaultPropsData()

  props.columns[0].value = 'Brother Lee'
  props.columns[1].value = 'brother@mail.com'

  const wrapper = mountQuasar(Crud, {
    propsData: props
  })

  expect(wrapper.vm.objectToSave).toStrictEqual({ "email": "brother@mail.com", "first_name": "Brother Lee" })
})


test('object to save mounting complex values', () => {

  const props = defaultPropsData()

  props.columns[0].value = {}
  props.columns[1].value = []

  const wrapper = mountQuasar(Crud, {
    propsData: props
  })

  expect(wrapper.vm.objectToSave).toStrictEqual({ "email": [], "first_name": {} })
})

test('object to save mounting with formating values', () => {

  const props = defaultPropsData()

  props.columns[0].value = { value: 'BROTHER', label: 'Brother' }
  props.columns[0].formatForPost = (value) => value.value

  props.columns[1].value = 'brother'
  props.columns[1].formatForPost = (value) => `${value}@mail.com`

  const wrapper = mountQuasar(Crud, {
    propsData: props
  })

  expect(wrapper.vm.objectToSave).toStrictEqual({ "email": 'brother@mail.com', "first_name": 'BROTHER' })
})

test('column prop valitador with string value on format', () => {

  const props = defaultPropsData()

  props.columns[0].value = { value: 'BROTHER', label: 'Brother' }
  props.columns[0].formatForPost = ''

  props.columns[1].value = 'brother'
  props.columns[1].formatForPost = {}

  const validator = Crud.props.columns.validator

  expect(validator(props.columns)).toBeFalsy()
  expect(console.warn).toHaveBeenCalled();
})

test('open modal without data', () => {

  axios.get.mockResolvedValue([]);

  const props = defaultPropsData()
  const wrapper = mountQuasar(Crud, {
    propsData: props
  })
  const spyOnResetColumnValuesMethod = jest.spyOn(wrapper.vm, 'resetColumnValues')

  expect(wrapper.vm.modalOpened).toBeFalsy()
  wrapper.vm.toggleModal()

  expect(wrapper.vm.modalOpened).toBeTruthy()
  expect(spyOnResetColumnValuesMethod).toHaveBeenCalled()
})
test('open modal with data after select a row ', () => {

  axios.get.mockResolvedValue(returnData);

  const props = defaultPropsData()
  const wrapper = mountQuasar(Crud, {
    propsData: props
  })

  wrapper.setData({ selected: [returnData[0]] })// select a row

  const spyOnPopulateColumnsWithSelectedRow = jest.spyOn(wrapper.vm, 'populateColumnsWithSelectedRow')

  expect(wrapper.vm.modalOpened).toBeFalsy()
  wrapper.vm.toggleModalWithData()

  expect(wrapper.vm.modalOpened).toBeTruthy()
  expect(spyOnPopulateColumnsWithSelectedRow).toHaveBeenCalled()
})

test('get $emit successOnGet event', async () => {

  const props = defaultPropsData()
  const wrapper = mountQuasar(Crud, {
    propsData: props
  })

  wrapper.vm.get()
  await wrapper.vm.$nextTick()

  expect(wrapper.emitted().successOnGet).toBeTruthy()

})

test('o succefull get set the total size from api', async () => {
  axios.get.mockResolvedValue({ data: response });

  const props = defaultPropsData()

  props.paginationTotalIndex = 'total'

  const wrapper = mountQuasar(Crud, {
    propsData: props
  })

  expect(wrapper.vm.pagination.rowsNumber).toBe(1)

  wrapper.vm.get()
  await wrapper.vm.$nextTick()

  expect(wrapper.vm.pagination.rowsNumber).toBe(12)
})

test('get $emit errorOnGet event', async () => {

  axios.get.mockRejectedValue('error msg')

  const props = defaultPropsData()

  const wrapper = mountQuasar(Crud, {
    propsData: props
  })

  await wrapper.vm.$nextTick()
  await wrapper.vm.$nextTick()

  expect(wrapper.emitted().errorOnGet).toBeTruthy()
})

test('delete $emit successOnDelete event', async () => {

  axios.delete.mockResolvedValue();

  const props = defaultPropsData()
  const wrapper = mountQuasar(Crud, {
    propsData: props
  })

  wrapper.setData({ selected: [returnData[0]] })

  wrapper.vm.delete()
  await wrapper.vm.$nextTick()

  expect(wrapper.emitted().successOnDelete).toBeTruthy()

})

test('delete $emit errorOnDelete event', async () => {

  axios.delete.mockRejectedValue('error msg')

  const props = defaultPropsData()

  const wrapper = mountQuasar(Crud, {
    propsData: props
  })

  wrapper.setData({ selected: [returnData[0]] })
  wrapper.vm.delete()

  await wrapper.vm.$nextTick()
  await wrapper.vm.$nextTick()

  expect(wrapper.emitted().errorOnDelete).toBeTruthy()
})

test('put $emit successOnPut event', async () => {

  axios.put.mockResolvedValue();

  const props = defaultPropsData()

  const wrapper = mountQuasar(Crud, {
    propsData: props
  })
  wrapper.setData({ selected: [returnData[0]] })
  wrapper.vm.save()

  await wrapper.vm.$nextTick()

  expect(wrapper.emitted().successOnPut).toBeTruthy()

})

test('put $emit errorOnPut event', async () => {

  axios.put.mockRejectedValue('error msg')

  const props = defaultPropsData()

  const wrapper = mountQuasar(Crud, {
    propsData: props
  })

  wrapper.setData({ selected: [returnData[0]] })
  wrapper.vm.save()

  await wrapper.vm.$nextTick()
  await wrapper.vm.$nextTick()

  expect(wrapper.emitted().errorOnPut).toBeTruthy()
})

test('post $emit successOnPost event', async () => {

  axios.post.mockResolvedValue();

  const props = defaultPropsData()

  const wrapper = mountQuasar(Crud, {
    propsData: props
  })

  wrapper.vm.save()
  await wrapper.vm.$nextTick()

  expect(wrapper.emitted().successOnPost).toBeTruthy()

})

test('post $emit errorOnPost event', async () => {

  axios.post.mockRejectedValue('error msg')

  const props = defaultPropsData()

  const wrapper = mountQuasar(Crud, {
    propsData: props
  })

  wrapper.vm.save()

  await wrapper.vm.$nextTick()
  await wrapper.vm.$nextTick()

  expect(wrapper.emitted().errorOnPost).toBeTruthy()
})

test('reset validation when saving with validation errors, dont make requests', () => {

  axios.get.mockResolvedValue(returnData);
  axios.post.mockResolvedValue([]);
  axios.put.mockResolvedValue([]);

  const props = defaultPropsData()
  const wrapper = mountQuasar(Crud, {
    propsData: props
  })

  wrapper.setData({ selected: [returnData[0]] })

  const spyOnResetValidation = jest.spyOn(wrapper.vm, 'resetValitation')
  const spyOnPost = jest.spyOn(wrapper.vm, 'post')
  const spyOnPut = jest.spyOn(wrapper.vm, 'put')

  jest.spyOn(wrapper.vm, 'hasValidationErrors').mockImplementation(() => true)

  expect(spyOnResetValidation).not.toBeCalled()

  wrapper.vm.save()

  expect(spyOnResetValidation).toHaveBeenCalled()
  expect(spyOnPost).not.toHaveBeenCalled()
  expect(spyOnPut).not.toHaveBeenCalled()
})


test('saving start loading', () => {

  axios.post.mockResolvedValue([]);
  axios.put.mockResolvedValue([]);

  const props = defaultPropsData()
  const wrapper = mountQuasar(Crud, {
    propsData: props
  })

  wrapper.vm.save()

  expect(wrapper.vm.loading).toBeTruthy()
})

test('save start put request because at least one row are selected', () => {

  axios.put.mockResolvedValue([]);
  axios.get.mockResolvedValue(returnData);

  const props = defaultPropsData()
  const wrapper = mountQuasar(Crud, {
    propsData: props
  })

  wrapper.setData({ selected: [returnData[0]] })

  const spyOnPut = jest.spyOn(wrapper.vm, 'put')
  const spyOnPost = jest.spyOn(wrapper.vm, 'post')

  wrapper.vm.save()

  expect(spyOnPut).toBeCalled()
  expect(spyOnPost).not.toBeCalled()
})

test('request update pagination', () => {

  const props = defaultPropsData()
  const wrapper = mountQuasar(Crud, {
    propsData: props
  })

  wrapper.vm.request({ pagination: { page: 5, rowsPerPage: 10 } })

  expect(wrapper.vm.pagination).toStrictEqual({ page: 5, rowsPerPage: 10 })
})

// test('request fetch remote data', async () => {

//   const props = defaultPropsData()
//   const wrapper = await mountQuasar(Crud, {
//     propsData: props
//   })


//   const spyOnGet = jest.spyOn(wrapper.vm, 'get')

//   wrapper.vm.request({ pagination: { page: 5, rowsPerPage: 10 } })

//   await wrapper.vm.$nextTick()
//   expect(spyOnGet).toHaveBeenCalledTimes(2)
// })

test('reset column values with proper types (string and array)', async () => {

  returnData[1]['first_name'] = 'boy'
  returnData[1]['email'] = [{}, {}]
  axios.get.mockResolvedValue(returnData);

  const props = defaultPropsData()

  const wrapper = await mountQuasar(Crud, {
    propsData: props
  })

  wrapper.setData({ selected: [returnData[1]] })
  wrapper.vm.populateColumnsWithSelectedRow()
  wrapper.vm.resetColumnValues()

  expect(wrapper.vm.columns[0].value).toBe("")
  expect(wrapper.vm.columns[1].value).toStrictEqual([])
})
test('reset column values with proper types ( Boolean and Number)', async () => {

  returnData[1].first_name = 199
  returnData[1].email = true
  axios.get.mockResolvedValue(returnData);

  const props = defaultPropsData()

  const wrapper = await mountQuasar(Crud, {
    propsData: props
  })

  wrapper.setData({ selected: [returnData[1]] })
  wrapper.vm.populateColumnsWithSelectedRow()
  wrapper.vm.resetColumnValues()

  expect(wrapper.vm.columns[0].value).toBe(0)
  expect(wrapper.vm.columns[1].value).toBe("")
})

test('reset column values static config', async () => {

  returnData[1].first_name = 'Brother Lee'
  axios.get.mockResolvedValue(returnData);

  const props = defaultPropsData()
  props.columns[0].static = true

  const wrapper = await mountQuasar(Crud, {
    propsData: props
  })

  wrapper.setData({ selected: [returnData[1]] })

  expect(wrapper.vm.columns[0].value).toStrictEqual("")

  wrapper.vm.populateColumnsWithSelectedRow()
  expect(wrapper.vm.columns[0].value).toStrictEqual("Brother Lee")

  wrapper.vm.resetColumnValues()
  expect(wrapper.vm.columns[0].value).toStrictEqual("Brother Lee")

})
