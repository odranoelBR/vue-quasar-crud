<template>
  <q-page
    padding
    class="row justify-center"
  >
    <div>
      <q-markdown
        :src="markdown"
        toc
      />
      <q-tab-example-one />
    </div>

  </q-page>
</template>

<script>
import markdown from 'assets/getting_started.md'
import QTabExampleOne from '@components/QTabExampleOne'
export default {
  components: {
    QTabExampleOne
  },
  data: () => ({
    markdown

  })

}
</script>

<style lang="sass" scoped>
</style>
