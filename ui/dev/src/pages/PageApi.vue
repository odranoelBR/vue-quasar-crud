<template>
  <q-page
    padding
    class="row justify-center"
  >
    <div class="col-8 ">
      <q-markdown
        :src="doc"
        toc
      />
    </div>

  </q-page>
</template>

<script>
import doc from '../../../src/components/Crud.md'
export default {
  data: () => ({
    doc
  })

}
</script>

<style lang="sass">
</style>
