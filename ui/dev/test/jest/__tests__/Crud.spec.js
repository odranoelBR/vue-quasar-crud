import { mountQuasar } from '../index'
import Crud from '../../../../src/components/Crud'
import axios from 'axios'
import columns from './columns.js'
jest.mock('axios');

const defautPropsData = {
  http: axios,
  api: '',
  columns,
  listIndex: (value) => (value),
  rowKey: ''
}

test('all columns enabled to create', () => {
  axios.get.mockResolvedValue([]);

  const wrapper = mountQuasar(Crud, {
    propsData: defautPropsData
  })

  expect(wrapper.vm.filteredColumns).toHaveLength(2)
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
  axios.get.mockResolvedValue([]);
  defautPropsData.api = 'people'

  const wrapper = mountQuasar(Crud, {
    propsData: defautPropsData
  })

  expect(wrapper.vm.apiUri).toBe('people?page=0&size=3&sort=,asc')
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
  axios.get.mockResolvedValue([]);
  defautPropsData.columns[0].value = 'Brother Lee'
  defautPropsData.columns[1].value = 'brother@mail.com'

  const wrapper = mountQuasar(Crud, {
    propsData: defautPropsData
  })

  expect(wrapper.vm.objectToSave).toStrictEqual({ "email": "brother@mail.com", "first_name": "Brother Lee" })
})


test('object to save mounting complex values', () => {
  axios.get.mockResolvedValue([]);
  defautPropsData.columns[0].value = {}
  defautPropsData.columns[1].value = []

  const wrapper = mountQuasar(Crud, {
    propsData: defautPropsData
  })

  expect(wrapper.vm.objectToSave).toStrictEqual({ "email": [], "first_name": {} })
})

test('object to save mounting with formating values', () => {
  axios.get.mockResolvedValue([]);
  defautPropsData.columns[0].value = { value: 'BROTHER', label: 'Brother' }
  defautPropsData.columns[0].formatForPost = (value) => value.value

  defautPropsData.columns[1].value = 'brother'
  defautPropsData.columns[1].formatForPost = (value) => `${value}@mail.com`

  const wrapper = mountQuasar(Crud, {
    propsData: defautPropsData
  })

  expect(wrapper.vm.objectToSave).toStrictEqual({ "email": 'brother@mail.com', "first_name": 'BROTHER' })
})

// test('object to save mounting with formating values', () => {
//   axios.get.mockResolvedValue([]);
//   defautPropsData.columns[0].value = { value: 'BROTHER', label: 'Brother' }
//   defautPropsData.columns[0].formatForPost = ''

//   defautPropsData.columns[1].value = 'brother'
//   defautPropsData.columns[1].formatForPost = {}

//   expect(() => {
//     mountQuasar(Crud, { propsData: defautPropsData })
//   }).toThrowError('formatForPost must be function on column email');
// })