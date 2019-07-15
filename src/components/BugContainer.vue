<template>
  <q-card bordered class="my-card">
    <q-card-section>
      <div class="text-h6 text-primary">Step 2</div>
    </q-card-section>
    <q-separator inset></q-separator>
    <q-card-section>
      <q-input
        v-model="bugContainer.path"
        name="path"
        type="text"
        v-validate="'required'"
        label="url/path to bug"
        :dense="true">
      </q-input>
      <span class="text-red-5 text-caption">{{ errors.first('path') }}</span>
    </q-card-section>
    <q-card-section>
      <div v-for="(key, value) in steps" :key="value + '-row'" class="row items-baseline">
        <div class="col">
          <q-select
            v-model="bugContainer.stepsToReproduce[value]"
            :key="value"
            v-validate="'required'"
            :name="'step-' + value"
            :options="stepsOptions"
            use-input
            new-value-mode="add"
            @new-value="createStep"
            label="Step">
          </q-select>
          <span class="text-red-5 text-caption" :key="value + '-error'">{{ errors.first('step-' + value) }}</span>
        </div>
        <div class="col-auto">
          <q-btn type="button" class="glossy q-pa-xs q-mx-xs" @click="addStep" rounded color="primary" size="xs">
            <q-icon name="add_circle_outline" :key="value + '-add-icon'" style="font-size: 1.5em;"></q-icon>
          </q-btn>
          <q-btn v-if="key > 1" type="button" class="glossy q-pa-xs q-mx-xs" @click="removeStep(key)" rounded color="negative" size="xs">
            <q-icon name="clear" :key="value + '-clear-icon'" style="font-size: 1.5em;"></q-icon>
          </q-btn>
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <q-input
        v-model="bugContainer.currentBehavior"
        filled
        v-validate="'required'"
        name="current"
        autogrow
        suffix="current behavior"
        type="textarea">
      </q-input>
      <span class="text-red-5 text-caption">{{ errors.first('current') }}</span>
    </q-card-section>
    <q-card-section>
      <q-input
        v-model="bugContainer.expectedBehavior"
        filled
        v-validate="'required'"
        name="expected"
        autogrow
        suffix="expected behavior"
        type="textarea">
      </q-input>
      <span class="text-red-5 text-caption">{{ errors.first('expected') }}</span>
    </q-card-section>
    <q-card-actions>
      <q-btn type="button" class="glossy q-py-xs float-right" @click="prev" rounded color="grey-5" label="Prev" size="sm"></q-btn>
      <q-btn type="button" class="glossy q-py-xs float-right" @click="next" rounded color="grey-5" label="Next" size="sm"></q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  name: 'BugContainer',
  data () {
    return {
      bugContainer: {
        path: '',
        stepsToReproduce: {
          1: null
        },
        currentBehavior: '',
        expectedBehavior: ''
      },
      steps: [1],
      stepCounter: 1,
      stepsOptions: []
    }
  },
  created () {
    this.setStepOptions()
  },
  methods: {
    setStepOptions () {
      this.stepsOptions = []
      if (this.$jsonStore.get('bugSteps')) {
        let stepsStore = this.$jsonStore.get('bugSteps')
        if (Object.keys(stepsStore).length > 0) {
          Object.keys(stepsStore).forEach(key => {
            this.stepsOptions.push(stepsStore[key])
          })
        }
      }
    },
    prev () {
      this.$emit('prev', 'commonData')
    },
    next () {
      this.$validator.validate().then(valid => {
        if (valid) {
          this.$store.dispatch('setBugContainer', this.bugContainer).then(() => {
            this.$emit('next', 'preview')
          })
        }
      })
    },
    addStep () {
      this.stepCounter++
      this.steps.push(this.stepCounter)
      this.bugContainer.stepsToReproduce[this.stepCounter] = null
      // console.log(this.steps)
    },
    removeStep (step) {
      this.steps.splice(this.steps.indexOf(step), 1)
      delete this.bugContainer.stepsToReproduce[step]
    },
    createStep (val, done) {
      this.stepsOptions.push({
        label: val,
        value: val
      })
      let stepsStore = {}
      this.stepsOptions.forEach(step => {
        stepsStore[step.value] = step
      })
      this.$jsonStore.set('bugSteps', stepsStore)
    }
  }
}
</script>

<style scoped>

</style>
