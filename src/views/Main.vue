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
      <div class="q-pa-md">
        <div class="row q-col-gutter-sm">
          <div class="col"></div>
          <div class="col-8">
            <common-data
              v-show="step==='commonData'"
              @next="next">
            </common-data>
            <bug-container
              v-show="step==='bug'"
              @prev="prev"
              @next="next">
            </bug-container>
            <preview
              v-show="step==='preview'"
              @prev="prev"
              @next="next">
            </preview>
          </div>
          <div class="col"></div>
        </div>
      </div>
    </q-page-container>

  </q-layout>
</template>

<script>
import { ipcRenderer } from 'electron'
import CommonData from '@/components/CommonData'
import BugContainer from '@/components/BugContainer'
import Preview from '@/components/Preview'

export default {
  name: 'Main',
  components: {
    CommonData: CommonData,
    BugContainer: BugContainer,
    Preview: Preview
  },
  data () {
    return {
      left: true,
      aboutMessage: {
        about: 'Jira task creation wizard',
        author: 'DartVadius',
        version: '0.1'
      },
      step: 'commonData'
    }
  },
  created () {
    ipcRenderer.send('toggle-popup', {
      type: 'about',
      aboutMessage: this.aboutMessage
    })
  },
  methods: {
    prev (componentId) {
      this.step = componentId
    },
    next (componentId) {
      // console.log(componentId)
      this.step = componentId
    }
  }
}
</script>

<style scoped>

</style>
