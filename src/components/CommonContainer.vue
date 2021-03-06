<template>
  <q-card bordered class="my-card">
    <q-card-section>
      <div class="text-h6 text-primary">{{ $t('Step') }} 1</div>
    </q-card-section>
    <q-separator inset></q-separator>
    <q-card-section>
      <q-select
        v-model="ticketData.project"
        v-validate="'required'"
        name="project"
        :options="formData.projectOptions"
        @input="projectChange"
        :label="$t('Select project')">
      </q-select>
      <span class="text-red-5 text-caption">{{ errors.first('project') }}</span>
    </q-card-section>
    <q-card-section>
      <q-select
        v-model="ticketData.component"
        name="component"
        :options="formData.componentsOptions"
        :label="$t('Select component')">
      </q-select>
    </q-card-section>
    <q-card-section>
      <q-select
        v-model="ticketData.issueType"
        name="issueType"
        v-validate="'required'"
        :options="formData.issuesOptions"
        :label="$t('Select issue type')">
      </q-select>
      <span class="text-red-5 text-caption">{{ errors.first('issueType') }}</span>
    </q-card-section>
    <q-card-section>
      <q-select
        v-model="ticketData.user"
        name="user"
        :options="formData.usersOptions"
        :label="$t('Assign task to')">
      </q-select>
    </q-card-section>
    <q-card-section>
      <q-select
        v-model="ticketData.pattern"
        name="pattern"
        v-validate="'required'"
        :options="wizardPatterns"
        :label="$t('Select wizard pattern')">
      </q-select>
      <span class="text-red-5 text-caption">{{ errors.first('pattern') }}</span>
    </q-card-section>
    <q-card-actions>
      <q-btn type="button" class="glossy q-py-xs float-right" @click="next" rounded color="grey-5" :label="$t('Next')" size="sm"></q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import { ipcRenderer } from 'electron'
import { Api } from '@/api/queries'

export default {
  name: 'CommonContainer',
  data () {
    return {
      jiraData: {
        projects: [],
        components: [],
        issues: [],
        users: []
      },
      ticketData: {
        project: null,
        component: null,
        issueType: null,
        user: null,
        pattern: null
      },
      formData: {
        projectOptions: [],
        componentsOptions: [],
        issuesOptions: [],
        usersOptions: []
      },
      wizardPatterns: [
        {
          value: 'bug',
          label: this.$t('Bug')
        },
        {
          value: 'update',
          label: this.$t('Change old functionality')
        },
        {
          value: 'new',
          label: this.$t('New functionality')
        },
        {
          value: 'refactoring',
          label: this.$t('Refactoring')
        }
      ]
    }
  },
  created () {
    ipcRenderer.on('set-auth', (event, value) => {
      Api.setAuth(value)
      this.init()
    })
    this.$eventBus.$on('updateConfig', this.init)
    this.init()
  },
  methods: {
    init () {
      this.getJiraProjects()
    },
    getJiraProjects () {
      this.$store.dispatch('getProjects').then(response => {
        this.jiraData.projects = response
        this.formData.projectOptions = []
        response.forEach(project => {
          let option = {
            label: project['name'],
            value: project['id'],
            key: project['key']
          }
          this.formData.projectOptions.push(option)
        })
      }).catch(() => {
        this.$q.notify({
          message: 'Check jira config!',
          color: 'negative',
          icon: 'warning',
          position: 'top'
        })
      })
    },
    projectChange (value) {
      this.jiraData.components = []
      this.jiraData.issues = []
      this.jiraData.users = []
      this.ticketData.issueType = null
      this.ticketData.component = null
      this.ticketData.user = null
      this.getProjectDetails(value)
      this.getProjectUsers(value)
    },
    getProjectDetails (value) {
      this.formData.componentsOptions = []
      this.formData.issuesOptions = []
      this.$store.dispatch('getProjectByKey', value.key).then(() => {
        this.jiraData.components = this.$store.state.components
        this.jiraData.issues = this.$store.state.issueTypes
        this.jiraData.components.forEach(component => {
          let option = {
            label: component['name'],
            value: component['id']
          }
          this.formData.componentsOptions.push(option)
        })
        this.jiraData.issues.forEach(issues => {
          let option = {
            label: issues['name'],
            value: issues['id'],
            subtask: issues['subtask']
          }
          this.formData.issuesOptions.push(option)
        })
      })
    },
    getProjectUsers (value) {
      this.formData.usersOptions = []
      this.$store.dispatch('getUsersByProjectKey', value.key).then(() => {
        this.jiraData.users = this.$store.state.developers
        this.jiraData.users.forEach(user => {
          if (user['active']) {
            let option = {
              label: user['displayName'],
              value: user['key']
            }
            this.formData.usersOptions.push(option)
          }
        })
      })
    },
    next () {
      this.$validator.validate().then(valid => {
        if (valid) {
          this.$store.dispatch('setCommonContainer', this.ticketData).then(response => {
            this.$emit('next', response.pattern.value)
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
