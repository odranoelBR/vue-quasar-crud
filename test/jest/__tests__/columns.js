export default [
  {
    name: 'first_name',
    required: true,
    label: 'Name',
    align: 'left',
    field: 'first_name',
    sortable: true,
    qComponent: 'QInput',
    value: '',
    size: '6',
    rules: [val => val && val.length > 0 || 'Please type something'],
    showCreate: true,
    showUpdate: true
  },
  {
    name: 'email',
    required: true,
    label: 'Email',
    align: 'center',
    field: 'email',
    sortable: true,
    qComponent: 'QInput',
    value: '',
    size: '6',
    showCreate: true,
    showUpdate: true
  }
]