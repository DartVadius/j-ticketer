<template>
  <q-card bordered class="my-card">
    <q-card-section>
      <div class="text-h6 text-primary">{{ $t('Step') }} 2</div>
    </q-card-section>
    <q-separator inset></q-separator>
    <q-card-section>
      <q-input
        v-model="refactoringContainer.title"
        name="title"
        type="text"
        v-validate="'required'"
        :label="$t('Title')"
        :dense="true">
      </q-input>
      <span class="text-red-5 text-caption">{{ errors.first('title') }}</span>
    </q-card-section>
    <q-card-section>
      <q-input
        v-model="refactoringContainer.path"
        name="path"
        type="text"
        v-validate="'required'"
        :label="$t('url/path to view')"
        :dense="true">
      </q-input>
      <span class="text-red-5 text-caption">{{ errors.first('path') }}</span>
    </q-card-section>
    <q-card-section>
      <q-input
        v-model="refactoringContainer.description"
        filled
        v-validate="'required'"
        name="description"
        autogrow
        bg-color="blue-1"
        :suffix="$t('Description')"
        type="textarea">
      </q-input>
      <span class="text-red-5 text-caption">{{ errors.first('description') }}</span>
    </q-card-section>
    <q-card-section>
      <div class="text-body1">
        {{ $t('Tusk flow (subtasks)') }}
        <q-btn type="button" class="glossy q-pa-xs q-mx-xs" @click="addStep" rounded color="primary" size="xs">
          <q-icon name="add_circle_outline" :key="'add-icon'" style="font-size: 1.5em;"></q-icon>
        </q-btn>
      </div>
      <div v-for="(value, key) in steps" :key="key + '-row'" class="row items-baseline">
        <div class="col">
          <q-input
            v-model="refactoringContainer.issueSteps[value]"
            :name="'step-' + key"
            type="textarea"
            autogrow
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
      <q-btn type="button" class="glossy q-py-xs float-right" @click="prev" rounded color="grey-5" :label="$t('Prev')" size="sm"></q-btn>
      <q-btn type="button" class="glossy q-py-xs float-right" @click="next" rounded color="grey-5" :label="$t('Next')" size="sm"></q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  name: 'RefactoringContainer',
  data () {
    return {
      refactoringContainer: {
        title: '',
        path: '',
        issueSteps: {
          // 0: null
        },
        description: ''
      },
      steps: [],
      stepCounter: 0
    }
  },
  methods: {
    addStep () {
      this.steps.push(this.stepCounter)
      this.refactoringContainer.issueSteps[this.stepCounter] = null
      this.stepCounter++
    },
    removeStep (step) {
      this.steps.splice(this.steps.indexOf(step), 1)
      delete this.refactoringContainer.issueSteps[step]
    },
    prev () {
      this.$emit('prev', 'commonData')
    },
    next () {
      this.$validator.validate().then(valid => {
        if (valid) {
          this.$store.dispatch('setRefactoringContainer', this.refactoringContainer).then(() => {
            console.log(this.$store.state.refactoringContainer)
            this.$emit('next', 'preview')
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
