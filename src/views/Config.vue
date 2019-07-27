<template>
  <div class="q-pa-md q-gutter-y-md">
    <div class="column">
      <q-input
        v-model="url"
        :label="$t('Jira server domain name')"
        name="url"
        type="text"
        v-validate="'required|url'"
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
          :label="$t('Jira login')"
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
          :label="$t('Jira password')"
          :dense="true">
        </q-input>
        <span class="text-red-5 text-caption">{{ errors.first('password') }}</span>
      </div>
      <div class="col">
        <q-select
          v-model="locale"
          name="locale"
          :options="localeOptions"
          :dense="true"
          :label="$t('Locale')">
        </q-select>
        <span class="text-red-5 text-caption">{{ errors.first('locale') }}</span>
      </div>
    </div>
    <div class="row">
      <div class="col q-gutter-md">
        <q-btn type="button" class="glossy q-py-xs" @click="clearStorage" rounded color="grey-5" :label="$t('Clear saved data')" size="sm"></q-btn>
      </div>
      <div class="col">
        <div class="row q-gutter-md justify-end">
          <q-btn type="button" class="glossy q-py-xs" @click="close" rounded color="grey-5" :label="$t('Close')" size="sm"></q-btn>
          <q-btn type="button" class="glossy q-py-xs" @click="save" rounded color="grey-5" :label="$t('Save')" size="sm"></q-btn>
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
      pass: null,
      locale: {
        label: 'En',
        value: 'en'
      },
      localeOptions: [
        {
          label: 'Ru',
          value: 'ru'
        },
        {
          label: 'En',
          value: 'en'
        }
      ]
    }
  },
  created () {
    // console.log(123)
    ipcRenderer.on('config-data', (event, value) => {
      // console.log(value)
      this.login = value.login ? value.login : null
      this.pass = value.password ? value.password : null
      this.url = value.url ? value.url : null
      this.locale = value.locale ? {
        label: value.locale.charAt(0).toUpperCase() + value.locale.slice(1),
        value: value.locale
      } : {
        label: 'En',
        value: 'en'
      }
    })
  },
  methods: {
    save () {
      this.$validator.validate().then(valid => {
        if (valid) {
          ipcRenderer.send('save-config', {
            url: this.url,
            password: this.pass,
            login: this.login,
            locale: this.locale.value
          })
        }
      })
    },
    close () {
      // console.log(111)
      this.$validator.errors.clear()
      ipcRenderer.send('close-config')
    },
    clearStorage () {
      this.$validator.errors.clear()
      ipcRenderer.send('clear-jira-config')
    }
  }
}
</script>

<style scoped>

</style>
