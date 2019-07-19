<template>
  <q-card bordered class="my-card">
    <q-card-section>
      <div class="text-h6 text-primary">Step 3</div>
    </q-card-section>
    <q-separator inset></q-separator>
    <q-card-section>
      <div class="row items-baseline">
        <div class="col">
          <q-toggle
            :label="'Enable forms description'"
            v-model="isFormEnable">
          </q-toggle>
        </div>
        <div v-if="isFormEnable" class="col-auto">
          <span class="text-caption">Add form group</span>
          <q-btn type="button" class="glossy q-pa-xs q-mx-xs" align="'right'" @click="addFormGroup" rounded color="primary" size="xs">
            <q-icon name="add_circle_outline" :key="'add-icon'" style="font-size: 1.5em;"></q-icon>
          </q-btn>
        </div>
      </div>
    </q-card-section>
    <q-card-section v-if="isFormEnable">
      <div v-for="(value, key) in formGroups" :key="key + '-row'" class="shadow-1">
        <div class="text-right q-pa-sm">
          <span class="text-caption">Remove form group</span>
          <q-btn type="button" class="glossy q-pa-xs q-mx-xs" @click="removeFormGroup(value)" rounded color="negative" size="xs">
            <q-icon name="clear" :key="key + '-clear-icon'" style="font-size: 1.5em;"></q-icon>
          </q-btn>
        </div>
        <div class="q-my-sm">
          <form-group-component :formGroup="key" @validationResult="updateValidator"></form-group-component>
        </div>
      </div>
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
  data () {
    return {
      formGroups: [],
      stepCounter: 0,
      formContainer: {},
      isFormEnable: false,
      formValidators: []
    }
  },
  watch: {
    formValidators () {
      if (this.formValidators.length === this.formGroups.length && !this.formValidators.includes(false)) {
        // console.log(1, this.formContainer)
        this.$store.dispatch('setFormContainer', this.formContainer).then(() => {
          console.log(this.$store.state.formContainer)
          this.$emit('next', 'preview')
        })
      }
    }
  },
  methods: {
    addFormGroup () {
      this.formContainer[this.stepCounter] = {}
      this.formGroups.push(this.stepCounter)
      this.stepCounter++
    },
    removeFormGroup (groupKey) {
      this.formGroups.splice(this.formGroups.indexOf(groupKey), 1)
      delete this.formContainer[groupKey]
    },
    prev () {
      this.$emit('prev', this.$store.state.commonContainer.pattern.value)
    },
    next () {
      this.formValidators = []
      this.$eventBus.$emit('validateNext')
    },
    updateValidator (value) {
      this.formContainer[value.index] = value.data
      this.formValidators.push(value.valid)
    }
  }
}
</script>

<style scoped>

</style>
