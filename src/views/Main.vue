<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
          </q-avatar>
          J-Ticketer
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="left" side="left" behavior="desktop" elevated :width="250">
      <div class="row q-pa-sm">
        <div class="col">
          <span>some content</span>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <div class="text-h1 text-center">J-Ticketer</div>
    </q-page-container>

  </q-layout>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  name: 'Main',
  data () {
    return {
      left: true,
      aboutMessage: {
        about: 'Jira task creation wizard',
        author: 'DartVadius',
        version: '0.1'
      }
    }
  },
  created () {
    ipcRenderer.send('toggle-popup', {
      type: 'about',
      aboutMessage: this.aboutMessage
    })
  },
  methods: {}
}
</script>

<style scoped>

</style>
