<template>
  <q-page
    padding
    class="row justify-center"
  >
    <div class="col-8 ">
      <q-markdown src="> Can only delete. Ex: The resource has soft delete" />
      <q-tab-example-two />

      <q-markdown
        src="> Only fetch after user select. (using form outside of table to filter requests) "
        class="q-pt-xl"
      />
      <q-tab-example-three />

      <q-markdown
        src="> Only fetch after user select. (using form outside of table to filter requests) "
        class="q-pt-xl"
      />
      <q-tab-example-four />
    </div>
  </q-page>
</template>

<script>
import QTabExampleTwo from '@components/QTabExampleTwo'
import QTabExampleThree from '@components/QTabExampleThree'
import QTabExampleFour from '@components/QTabExampleFour'

export default {
  components: {
    QTabExampleTwo, QTabExampleThree, QTabExampleFour
  }
}
</script>

<style lang="sass" scoped>
.q-tab-panel
  padding: 0px
</style>
