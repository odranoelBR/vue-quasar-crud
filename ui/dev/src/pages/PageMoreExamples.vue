<template>
  <q-page
    padding
    class="row justify-center"
  >
    <div class="col-8">
      <q-card class="q-mb-lg">
        <q-card-section class="bg-grey-9 text-white">
          <div class="text-h6">Can only delete. </div>
          <div class="text-subtitle2">Ex: The resource has soft delete</div>
        </q-card-section>
        <q-separator
          dark
          inset
        />
        <q-card-section class="no-padding">
          <q-tab-example-two />
        </q-card-section>
      </q-card>

      <q-card class="q-mb-lg">
        <q-card-section class="bg-grey-9 text-white">
          <div class="text-h6">Only fetch after user select. </div>
          <div class="text-subtitle2">Using form outside of table to filter requests</div>
        </q-card-section>
        <q-separator
          dark
          inset
        />
        <q-card-section class="no-padding">
          <q-tab-example-three />
        </q-card-section>
      </q-card>

      <q-card class="q-mb-lg">
        <q-card-section class="bg-grey-9 text-white">
          <div class="text-h6">Rule to edit only the completed tasks. </div>
          <div class="text-subtitle2"></div>
        </q-card-section>
        <q-separator
          dark
          inset
        />
        <q-card-section class="no-padding">
          <q-tab-example-four />
        </q-card-section>
      </q-card>

      <q-card class="q-mb-lg">
        <q-card-section class="bg-grey-9 text-white">
          <div class="text-h6">Changing types of form for edit / create </div>
          <div class="text-subtitle2">Notify on update</div>
        </q-card-section>
        <q-separator
          dark
          inset
        />
        <q-card-section class="no-padding">
          <q-tab-example-five />
        </q-card-section>
      </q-card>

      <q-card class="q-mb-lg">
        <q-card-section class="bg-grey-9 text-white">
          <div class="text-h6">Complete </div>
          <div class="text-subtitle2">Notify on update</div>
        </q-card-section>
        <q-separator
          dark
          inset
        />
        <q-card-section class="no-padding">
          <q-tab-example-six />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import QTabExampleTwo from '@components/QTabExampleTwo'
import QTabExampleThree from '@components/QTabExampleThree'
import QTabExampleFour from '@components/QTabExampleFour'
import QTabExampleFive from '@components/QTabExampleFive'
import QTabExampleSix from '@components/QTabExampleSix'

export default {
  components: {
    QTabExampleTwo, QTabExampleThree, QTabExampleFour, QTabExampleFive, QTabExampleSix
  }
}
</script>

<style lang="sass" scoped>
.q-tab-panel
  padding: 0px
</style>
