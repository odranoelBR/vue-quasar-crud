

Columns
=
> Additional to Quasar QTable columns, Quasar Crud add some more to dinamically build forms, validations ...


| Column name | Description | Type | Required | Default         |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ------ | --------------- |
| qComponent | The Quasar form component to render (QInput, QSelect ...) | String |no | null
| showCreate | The field will show on create form | Boolean | no |true
| showUpdate | The field will show on update form | Boolean | no | true
| size       | The size of columns on form  | Boolean | yes if showCreate or showUpdate | null
| options    | The options Array of QSelect | Array | yes if field is QSelect | []
| customize  | If the column use slot | Boolean | no | null