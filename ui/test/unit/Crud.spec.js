import { mount } from '@vue/test-utils'
import Crud from '@/components/Crud.vue'

test('displays message', () => {
    const wrapper = mount(Crud, {
        propsData: {
            msg: 'Hello world'
        }
    })

    expect(wrapper.text()).toContain('Hello world')
})