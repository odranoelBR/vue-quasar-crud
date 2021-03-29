<template>
  <q-page
    padding
    class="row justify-center"
  >
    <div class="col-8 ">
      <q-markdown
        :src="markdown"
        toc
      />
      <q-tab-example-one />
      <q-markdown
        :src="doc"
        toc
      />
    </div>

  </q-page>
</template>

<script>
import markdown from 'assets/getting_started.md'
import doc from '../../../src/components/Crud.md'
import QTabExampleOne from '@components/QTabExampleOne'
export default {
  components: {
    QTabExampleOne
  },
  data: () => ({
    markdown,
    doc
  })

}
</script>

<style lang="sass" scoped>
.q-markdown--table thead
  background: blue
</style>
