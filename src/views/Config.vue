<template>
  <div class="q-pa-md q-gutter-y-md">
    <div class="column">
      <q-input
        v-model="url"
        label="Jira server domain name"
        name="url"
        type="text"
        v-validate="'required'"
        :dense="true">
      </q-input>
      <span class="text-red-5 text-caption">{{ errors.first('url') }}</span>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col">
        <q-input
          v-model="login"
          name="login"
          type="text"
          v-validate="'required'"
          label="Jira login"
          :dense="true">
        </q-input>
        <span class="text-red-5 text-caption">{{ errors.first('login') }}</span>
      </div>
      <div class="col">
        <q-input
          v-model="pass"
          name="password"
          type="password"
          v-validate="'required'"
          label="Jira password"
          :dense="true">
        </q-input>
        <span class="text-red-5 text-caption">{{ errors.first('password') }}</span>
      </div>
    </div>
    <div class="row">
      <div class="col q-gutter-md">
        <q-btn type="button" class="glossy q-py-xs" @click="clearStorage" rounded color="grey-5" label="Clear storage" size="sm"></q-btn>
      </div>
      <div class="col">
        <div class="row q-gutter-md justify-end">
          <q-btn type="button" class="glossy q-py-xs" @click="close" rounded color="grey-5" label="Close" size="sm"></q-btn>
          <q-btn type="button" class="glossy q-py-xs" @click="save" rounded color="grey-5" label="Save" size="sm"></q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  name: 'Config',
  data () {
    return {
      url: null,
      login: null,
      pass: null
    }
  },
  created () {
    // console.log(123)
    ipcRenderer.on('config-data', (event, value) => {
      console.log(value)
      this.login = value.login ? value.login : null
      this.password = value.password ? value.password : null
      this.url = value.url ? value.url : null
    })
  },
  methods: {
    save () {
      ipcRenderer.send('save-config', {
        url: this.url,
        password: this.password,
        login: this.login
      })
    },
    close () {
      ipcRenderer.send('close-config')
    },
    clearStorage () {
      ipcRenderer.send('clear-config')
    }
  }
}
</script>

<style scoped>

</style>
