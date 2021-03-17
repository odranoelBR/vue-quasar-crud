import { mountQuasar } from '../index'
import Crud from '@/components/Crud.vue'
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