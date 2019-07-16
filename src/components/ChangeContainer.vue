<template>
  <q-card bordered class="my-card">
    <q-card-section>
      <div class="text-h6 text-primary">Step 2</div>
    </q-card-section>
    <q-separator inset></q-separator>
    <q-card-actions>
      <q-btn type="button" class="glossy q-py-xs float-right" @click="prev" rounded color="grey-5" label="Prev" size="sm"></q-btn>
      <q-btn type="button" class="glossy q-py-xs float-right" @click="next" rounded color="grey-5" label="Next" size="sm"></q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  name: 'ChangeContainer',
  methods: {
    prev () {
      this.$emit('prev', 'commonData')
    },
    next () {
      this.$validator.validate().then(valid => {
        if (valid) {
          // this.$store.dispatch('setChangeContainer', this.bugContainer).then(() => {
          //   this.$emit('next', 'preview')
          // })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
