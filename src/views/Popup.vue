<template>
  <div>
    <h1>Pop up!</h1>
    <div>
      {{ text }}
    </div>
    <button @click="close">Close</button>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  name: 'Popup',
  data () {
    return {
      text: ''
    }
  },
  created () {
    ipcRenderer.on('popup-data', (event, value) => {
      this.text = value.text
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
