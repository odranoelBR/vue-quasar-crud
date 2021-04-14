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

<style lang="sass">
.q-markdown table
  border: none
.q-markdown table td:nth-child(1)
  color: $teal-9
.q-markdown table tr
  background: $teal-3
  border: none
.q-markdown table thead tr th
  border: none
.q-markdown table td
  border: none
.q-markdown table tr
  background: white
.q-markdown table tr:nth-child(odd)
  background: $teal-3
</style>
