<template>
  <q-card bordered class="my-card">
    <q-card-section>
      <div class="text-h6 text-primary">Step 3</div>
    </q-card-section>
    <q-separator inset></q-separator>
    <q-card-section>
      <q-input
        v-model="taskModel.title"
        v-validate="'required'"
        name="title"
        :dense="true"
        label="Title"
        type="text">
      </q-input>
      <span class="text-red-5 text-caption">{{ errors.first('title') }}</span>
    </q-card-section>
    <q-card-actions>
      <vue-simplemde v-model="taskModel.body" ref="markdownEditor" />
    </q-card-actions>
    <q-card-actions>
      <q-btn type="button" class="glossy q-py-xs float-right" @click="prev" rounded color="grey-5" label="Prev" size="sm"></q-btn>
      <q-btn type="button" class="glossy q-py-xs float-right" @click="next" rounded color="grey-5" label="Next" size="sm"></q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import VueSimplemde from 'vue-simplemde'

export default {
  name: 'Preview',
  components: {
    VueSimplemde
  },
  data () {
    return {
      jiraState: {},
      taskState: {},
      formState: {},
      taskModel: {
        title: '',
        body: ''
      }
    }
  },
  created () {
    // console.log(this.$store.state)
    this.jiraState = this.$store.state.commonContainer
    if (this.$store.state.commonContainer.pattern.value === 'bug') {
      this.taskState = this.$store.state.bugContainer
    }
    if (this.$store.state.commonContainer.pattern.value === 'update') {
      this.taskState = this.$store.state.changeContainer
      this.formState = this.$store.state.formContainer
    }
    if (this.$store.state.commonContainer.pattern.value === 'new') {
      this.taskState = this.$store.state.newContainer
      this.formState = this.$store.state.formContainer
    }
    if (this.$store.state.commonContainer.pattern.value === 'refactoring') {
      this.taskState = this.$store.state.refactoringContainer
    }
    this.createPreview()
  },
  methods: {
    createPreview () {
      console.log(this.taskState)
      let body = []
      this.taskModel.title = this.taskState.title
      let url = '**Path/Url:** ' + this.taskState.path
      body.push(url)
      if (this.jiraState.pattern.value === 'bug') {
        let steps = []
        Object.keys(this.taskState.stepsToReproduce).forEach((key, index) => {
          steps.push(index + 1 + '. ' + this.taskState.stepsToReproduce[key].value)
        })
        body.push('**Steps to reproduce:**<br>' + steps.join('<br>'))
      }
      if (this.jiraState.pattern.value === 'bug' || this.jiraState.pattern.value === 'update') {
        body.push('**Current behavior**<br>' + this.taskState.currentBehavior)
        body.push('**Expected behavior**<br>' + this.taskState.expectedBehavior)
      }
      if (this.jiraState.pattern.value === 'new' || this.jiraState.pattern.value === 'refactoring') {
        body.push('**Description**<br>' + this.taskState.description)
      }
      if (this.jiraState.pattern.value === 'new') {
        let scenarios = []
        Object.keys(this.taskState.expectedBehaviors).forEach(key => {
          scenarios.push('**' + key + ':** ' + this.taskState.expectedBehaviors[key])
        })
        body.push('**Scenarios**<br>' + scenarios.join('<br>'))
      }
      if (this.jiraState.pattern.value !== 'bug') {
        let subtasks = []
        Object.keys(this.taskState.issueSteps).forEach((key, index) => {
          subtasks.push(index + 1 + '. ' + this.taskState.issueSteps[key])
        })
        body.push('**Subtasks:**<br>' + subtasks.join('<br>'))
      }
      if (this.jiraState.pattern.value === 'new' || this.jiraState.pattern.value === 'update') {
        body.push(this.createFormPreview())
      }
      this.taskModel.body = body.join('<br>')
    },
    createFormPreview () {
      console.log(this.formState)
      let form = []
      Object.keys(this.formState).forEach(key => {
        form.push('**Form group ' + this.formState[key].title + '**')
        this.formState[key].data.forEach(value => {
          form.push('**Field type:** ' + value.type + ', **Field label:** ' + value.label + ', **Required validation:** ' + value.requireValidation)
          if (value.requireValidation) {
            // todo
          }
        })
      })
      return form.join('<br>')
    },
    prev () {
      this.$emit('prev', this.$store.state.commonContainer.pattern.value)
    },
    next () {
      this.$validator.validate().then(valid => {
        if (valid) {
          // this.$store.dispatch('setBugContainer', this.bugContainer).then(() => {
          //   this.$emit('next', this.$store.state.wizardCommonData.parent)
          // })
        }
      })
    }
  }
}
</script>

<style scoped>
  @import '~simplemde/dist/simplemde.min.css';
</style>
