import Vue from 'vue'
import Vuex from 'vuex'
import { Api } from '@/api/queries'
import {
  SET_ERROR,
  SET_PROJECTS,
  SET_PROJECT,
  SET_DEVELOPERS,
  SET_COMPONENTS,
  SET_JIRA_ISSUE_TYPES,
  SET_WIZARD_COMMON_CONTAINER,
  SET_WIZARD_BUG_CONTAINER,
  SET_WIZARD_CHANGE_CONTAINER,
  SET_WIZARD_FORM_CONTAINER,
  SET_WIZARD_NEW_CONTAINER
} from './mutationsType'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    projects: [],
    components: [],
    issueTypes: [],
    developers: [],
    project: {
      id: String,
      name: String,
      key: String
    },
    commonContainer: {},
    bugContainer: {},
    changeContainer: {},
    formContainer: {},
    newContainer: {},
    errors: {}
  },
  mutations: {
    [SET_ERROR] (state, error) {
      state.errors = error
    },
    [SET_PROJECTS] (state, projects) {
      state.projects = projects
    },
    [SET_COMPONENTS] (state, components) {
      state.components = components
    },
    [SET_DEVELOPERS] (state, developers) {
      state.developers = developers
    },
    [SET_JIRA_ISSUE_TYPES] (state, issueTypes) {
      state.issueTypes = issueTypes
    },
    [SET_PROJECT] (state, project) {
      state.project.id = project.id
      state.project.name = project.name
      state.project.key = project.key
    },
    [SET_WIZARD_COMMON_CONTAINER] (state, data) {
      state.commonContainer = {}
      Object.assign(state.commonContainer, data)
    },
    [SET_WIZARD_BUG_CONTAINER] (state, data) {
      state.bugContainer = {}
      state.bugContainer = JSON.parse(JSON.stringify(data))
    },
    [SET_WIZARD_CHANGE_CONTAINER] (state, data) {
      state.changeContainer = {}
      state.changeContainer = JSON.parse(JSON.stringify(data))
    },
    [SET_WIZARD_FORM_CONTAINER] (state, data) {
      state.formContainer = {}
      state.formContainer = JSON.parse(JSON.stringify(data))
    },
    [SET_WIZARD_NEW_CONTAINER] (state, data) {
      state.newContainer = {}
      state.newContainer = JSON.parse(JSON.stringify(data))
    }
  },
  actions: {
    getProjects ({ commit }) {
      return new Promise((resolve, reject) => {
        Api.get('rest/api/2/project').then((response) => {
          commit(SET_PROJECTS, response.data)
          resolve(response.data)
        }).catch((error) => {
          commit(SET_ERROR, error)
          reject(error)
        })
      })
    },
    getProjectByKey ({ commit }, projectKey) {
      return new Promise((resolve, reject) => {
        Api.get('rest/api/2/project/' + projectKey).then((response) => {
          commit(SET_PROJECT, response.data)
          commit(SET_COMPONENTS, response.data.components)
          commit(SET_JIRA_ISSUE_TYPES, response.data.issueTypes)
          resolve(response.data)
        }).catch((error) => {
          commit(SET_ERROR, error)
          reject(error)
        })
      })
    },
    getUsersByProjectKey ({ commit }, projectKey) {
      return new Promise((resolve, reject) => {
        Api.query('rest/api/latest/user/assignable/multiProjectSearch', {
          params: {
            username: '',
            projectKeys: projectKey,
            maxResults: 500,
            startAt: 0
          }
        }).then((response) => {
          commit(SET_DEVELOPERS, response.data)
          resolve(response.data)
        }).catch((error) => {
          commit(SET_ERROR, error)
          reject(error)
        })
      })
    },
    setCommonContainer ({ commit }, data) {
      return new Promise((resolve, reject) => {
        try {
          commit(SET_WIZARD_COMMON_CONTAINER, data)
          resolve(data)
        } catch (error) {
          commit(SET_ERROR, error)
          reject(error)
        }
      })
    },
    setBugContainer ({ commit }, data) {
      return new Promise((resolve, reject) => {
        try {
          commit(SET_WIZARD_BUG_CONTAINER, data)
          resolve(data)
        } catch (error) {
          commit(SET_ERROR, error)
          reject(error)
        }
      })
    },
    setChangeContainer ({ commit }, data) {
      return new Promise((resolve, reject) => {
        try {
          commit(SET_WIZARD_CHANGE_CONTAINER, data)
          resolve(data)
        } catch (error) {
          commit(SET_ERROR, error)
          reject(error)
        }
      })
    },
    setNewContainer ({ commit }, data) {
      return new Promise((resolve, reject) => {
        try {
          commit(SET_WIZARD_NEW_CONTAINER, data)
          resolve(data)
        } catch (error) {
          commit(SET_ERROR, error)
          reject(error)
        }
      })
    },
    setFormContainer ({ commit }, data) {
      return new Promise((resolve, reject) => {
        try {
          commit(SET_WIZARD_FORM_CONTAINER, data)
          resolve(data)
        } catch (error) {
          commit(SET_ERROR, error)
          reject(error)
        }
      })
    }
  }
})
