<template>
  <q-card bordered class="my-card">
    <q-card-section>
      <div class="text-h6 text-primary">Step 2</div>
    </q-card-section>
    <q-separator inset></q-separator>
    <q-card-section>
      <q-input
        v-model="changeContainer.path"
        name="path"
        type="text"
        v-validate="'required'"
        label="url/path to bug"
        :dense="true">
      </q-input>
      <span class="text-red-5 text-caption">{{ errors.first('path') }}</span>
    </q-card-section>
    <q-card-section>
      <q-input
        v-model="changeContainer.currentBehavior"
        filled
        v-validate="'required'"
        name="current"
        autogrow
        bg-color="blue-1"
        suffix="current behavior"
        type="textarea">
      </q-input>
      <span class="text-red-5 text-caption">{{ errors.first('current') }}</span>
    </q-card-section>
    <q-card-section>
      <q-input
        v-model="changeContainer.expectedBehavior"
        filled
        v-validate="'required'"
        name="expected"
        bg-color="blue-1"
        autogrow
        suffix="expected behavior"
        type="textarea">
      </q-input>
      <span class="text-red-5 text-caption">{{ errors.first('expected') }}</span>
    </q-card-section>
    <q-card-section>
      <div class="text-body1">
        Tusk flow (subtasks)
        <q-btn type="button" class="glossy q-pa-xs q-mx-xs" @click="addStep" rounded color="primary" size="xs">
          <q-icon name="add_circle_outline" :key="'add-icon'" style="font-size: 1.5em;"></q-icon>
        </q-btn>
      </div>
      <div v-for="(value, key) in steps" :key="key + '-row'" class="row items-baseline">
        <div class="col">
          <q-input
            v-model="changeContainer.issueSteps[value]"
            name="path"
            type="text"
            v-validate="'required'"
            :prefix="'#' + (key + 1)"
            :placeholder="'Subtask ' + (key + 1)"
            :dense="true">
          </q-input>
          <span class="text-red-5 text-caption" :key="key + '-error'">{{ errors.first('step-' + key) }}</span>
        </div>
        <div class="col-auto">
          <q-btn type="button" class="glossy q-pa-xs q-mx-xs" @click="removeStep(value)" rounded color="negative" size="xs">
            <q-icon name="clear" :key="key + '-clear-icon'" style="font-size: 1.5em;"></q-icon>
          </q-btn>
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
export default {
  name: 'ChangeContainer',
  data () {
    return {
      changeContainer: {
        path: '',
        issueSteps: {
          // 0: null
        },
        currentBehavior: '',
        expectedBehavior: ''
      },
      steps: [],
      stepCounter: 0
    }
  },
  methods: {
    addStep () {
      this.stepCounter++
      this.steps.push(this.stepCounter)
      this.changeContainer.issueSteps[this.stepCounter] = null
    },
    removeStep (step) {
      this.steps.splice(this.steps.indexOf(step), 1)
      delete this.changeContainer.issueSteps[step]
    },
    prev () {
      this.$emit('prev', 'commonData')
    },
    next () {
      this.$validator.validate().then(valid => {
        if (valid) {
          this.$store.dispatch('setChangeContainer', this.changeContainer).then(() => {
            this.$emit('next', 'form')
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
