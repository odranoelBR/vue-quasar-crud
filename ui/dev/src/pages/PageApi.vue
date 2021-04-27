<template>
  <q-page
    padding
    class="row justify-center"
  >
    <div class="col-8 ">
      <q-markdown
        :src="columns"
        toc
      />
      <q-markdown
        :src="doc"
        toc
      />
    </div>

  </q-page>
</template>

<script>
import columns from 'assets/columns.md'
import doc from '../../../src/components/Crud.md'
export default {
  data: () => ({
    doc,
    columns
  })

}
</script>

<style lang="sass">
</style>
