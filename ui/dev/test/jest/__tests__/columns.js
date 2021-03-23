export default [
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