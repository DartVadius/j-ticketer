<template>
  <q-card bordered class="my-card">
    <q-card-section>
      <div class="text-h6 text-primary">Step 3</div>
    </q-card-section>
    <q-separator inset></q-separator>
    <q-card-section>
      <form-group-component></form-group-component>
    </q-card-section>
    <q-card-actions>
      <q-btn type="button" class="glossy q-py-xs float-right" @click="prev" rounded color="grey-5" label="Prev" size="sm"></q-btn>
      <q-btn type="button" class="glossy q-py-xs float-right" @click="next" rounded color="grey-5" label="Next" size="sm"></q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import FormGroupComponent from '@/components/subcomponents/FormGroupComponent'

export default {
  name: 'FormContainer',
  components: {
    FormGroupComponent: FormGroupComponent
  },
  methods: {
    prev () {
      // console.log(this.$store.state.commonContainer)
      this.$emit('prev', this.$store.state.commonContainer.pattern.value)
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
