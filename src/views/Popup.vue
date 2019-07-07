<template>
  <div class="row q-ma-sm">
    <div v-if="type === 'about'" class="col text-center">
      <div class="text-caption">{{ aboutMessage.about }}</div>
      <div class="text-caption">v. {{ aboutMessage.version }}</div>
      <div class="text-caption q-mb-sm">by {{ aboutMessage.author }}</div>
      <q-btn type="button" class="glossy q-py-xs" @click="close" rounded color="grey-5" label="Ok" size="sm"></q-btn>
    </div>
    <div v-if="type === 'storage_error'" class="col text-center">
      <div class="text-caption">{{ storageError }}</div>
      <q-btn type="button" class="glossy q-py-xs" @click="close" rounded color="grey-5" label="Ok" size="sm"></q-btn>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  name: 'Popup',
  data () {
    return {
      type: '',
      aboutMessage: {},
      storageError: ''
    }
  },
  created () {
    ipcRenderer.on('popup-data', (event, value) => {
      console.log(value)
      this.type = value.type
      if (value.type === 'about') this.aboutMessage = value.aboutMessage
      if (value.type === 'storage_error') this.storageError = value.storageError
    })
  },
  methods: {
    close () {
      ipcRenderer.send('close-popup')
    }
  }
}
</script>

<style scoped>

</style>
