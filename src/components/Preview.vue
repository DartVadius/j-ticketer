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
    <q-card-section>
      <q-input
        v-model="taskModel.body"
        filled
        v-validate="'required'"
        name="body"
        autogrow
        type="textarea">
      </q-input>
      <span class="text-red-5 text-caption">{{ errors.first('body') }}</span>
    </q-card-section>
    <q-card-actions>
      <q-btn type="button" class="glossy q-py-xs float-right" @click="prev" rounded color="grey-5" label="Prev" size="sm"></q-btn>
      <q-btn type="button" class="glossy q-py-xs float-right" @click="next" rounded color="grey-5" label="Next" size="sm"></q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>

export default {
  name: 'Preview',
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
      let url = 'Path/Url: ' + this.taskState.path
      body.push(url)
      if (this.jiraState.pattern.value === 'bug') {
        let steps = []
        Object.keys(this.taskState.stepsToReproduce).forEach((key, index) => {
          steps.push(index + 1 + '. ' + this.taskState.stepsToReproduce[key].value)
        })
        body.push('Steps to reproduce:\n' + steps.join('\n'))
      }
      if (this.jiraState.pattern.value === 'bug' || this.jiraState.pattern.value === 'update') {
        body.push('Current behavior:\n' + this.taskState.currentBehavior)
        body.push('Expected behavior:\n' + this.taskState.expectedBehavior)
      }
      if (this.jiraState.pattern.value === 'new' || this.jiraState.pattern.value === 'refactoring') {
        body.push('Description\n' + this.taskState.description)
      }
      if (this.jiraState.pattern.value === 'new') {
        let scenarios = []
        Object.keys(this.taskState.expectedBehaviors).forEach(key => {
          scenarios.push(key + ': ' + this.taskState.expectedBehaviors[key])
        })
        body.push('Scenarios\n' + scenarios.join('\n'))
      }
      if (this.jiraState.pattern.value !== 'bug') {
        let subtasks = []
        Object.keys(this.taskState.issueSteps).forEach((key, index) => {
          subtasks.push(index + 1 + '. ' + this.taskState.issueSteps[key])
        })
        body.push('Subtasks:\n' + subtasks.join('\n'))
      }
      if (this.jiraState.pattern.value === 'new' || this.jiraState.pattern.value === 'update') {
        body.push(this.createFormPreview())
      }
      this.taskModel.body = body.join('\n\n')
    },
    createFormPreview () {
      console.log(this.formState)
      let form = []
      Object.keys(this.formState).forEach(key => {
        form.push('\nForm group ' + this.formState[key].title + '')
        this.formState[key].data.forEach(value => {
          form.push('\nField type: ' + value.type + '\nField label: ' + value.label + '\nRequired validation: ' + value.requireValidation)
          let validationRules = []
          if (value.requireValidation) {
            validationRules.push('Validation rules:')
            validationRules.push('* required: ' + value.validators.required)
            validationRules.push('* value type: ' + value.validators.valueType)
            if (value.validators.length) {
              validationRules.push('* field length: ' + value.validators.length)
            }
            if (value.validators.diapason.min) {
              validationRules.push('* min value: ' + value.validators.diapason.min)
            }
            if (value.validators.diapason.max) {
              validationRules.push('* max value: ' + value.validators.diapason.max)
            }
          }
          if (validationRules.length > 0) form.push(validationRules.join('\n'))
        })
      })
      return form.join('\n')
    },
    prev () {
      this.$emit('prev', this.$store.state.commonContainer.pattern.value)
    },
    next () {
      this.$validator.validate().then(valid => {
        if (valid) {
          console.log(this.$store.state.commonContainer)
          let issueTypeId = null
          if (this.$store.state.commonContainer.issueType) {
            issueTypeId = this.$store.state.commonContainer.issueType.value
          }
          let componentId = null
          if (this.$store.state.commonContainer.component) {
            componentId = this.$store.state.commonContainer.component.value
          }
          let issueData = {
            'fields': {
              'project':
                {
                  'key': this.$store.state.commonContainer.project.key
                },
              'summary': this.taskModel.title,
              'description': this.taskModel.body,
              'issuetype': {
                'id': issueTypeId
              },
              'components': [
                {
                  'id': componentId
                }
              ]
            }
          }
          this.$store.dispatch('saveTicket', issueData).then((response) => {
            console.log(response)
            // this.$store.dispatch('assignUser', [response.key, {'name': }])
          })
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
