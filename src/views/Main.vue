<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="live_help" @click="left = !left" />

        <q-toolbar-title>
          <q-avatar>
            <img src="/img/giphy.gif">
          </q-avatar>
          J-Ticketer
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="left" side="left" behavior="desktop" elevated :width="250">
      <div class="row q-pa-sm">
        <div v-show="step==='commonData'" class="col">
          <p>
            Обязательные поля:
          </p>
          <ul>
            <li>Проект</li>
            <li>Тип задачи</li>
            <li>Паттерн для прохождения визарда</li>
          </ul>
          <p class="text-caption text-weight-light">Тип задачи - тип задачи в джире</p>
          <p class="text-negative text-caption text-weight-light">* Назначение задачи на исполнителя пока не работает</p>
        </div>
        <div v-show="step==='bug'" class="col">
          <ul>
            <li>Все поля обязательны</li>
            <li>Заголовок - заголовок задачи в джире</li>
            <li>url/path - ссылка на вьюху в проекте или урл api, где обнаружен баг</li>
            <li>Шаги вопспроизведения багов добавляются в список по `enter` </li>
          </ul>
        </div>
        <div v-show="step==='update'" class="col">
          <p>Изменение существующего функционала</p>
          <p>Все поля обязательны, кроме подзадач</p>
          <p>Подзадачи заполняются в случае, если задачу можно разделить на более мелкие логические этапы</p>
        </div>
        <div v-show="step==='new'" class="col">
          <p>Добавление нового функционала</p>
          <p>Все поля обязательны, кроме подзадач и сценариев</p>
          <p>Если выбран сценарий - описание сценария обязательно</p>
          <p>Сценарии - сценарии поведения приложения при различных улсовиях (например сценария для менеджера, сценарий для пользователя и тд)</p>
          <p>Новые типы сценариев добавляются в селект по `enter`</p>
          <p>Можно добавить несколько разных сценариев для задачи</p>
        </div>
        <div v-show="step==='refactoring'" class="col">
          <p>
            Рефакторинг
          </p>
        </div>
        <div v-show="step==='form'" class="col">
          <p>
            Описание форм <span class="text-caption text-weight-light">необязтельный шаг</span>
          </p>
          <ul>
            <li>Можно добавить описание нескольких форм</li>
            <li>Динамическое добавление полей формы</li>
            <li>Набор правил валидации поля меняются в зависимости от типа поля</li>
          </ul>
        </div>
        <div v-show="step==='preview'" class="col">
          <p>
            Предварительный просмотр: можно отредактировать текст и заголовок задачи перед отправкой
          </p>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <div class="q-pa-md">
        <div class="row q-col-gutter-sm">
          <div class="col"></div>
          <div class="col-10">
            <common-container
              v-show="step==='commonData'"
              @next="next">
            </common-container>
            <bug-container
              v-show="step==='bug'"
              @prev="prev"
              @next="next">
            </bug-container>
            <change-container
              v-show="step==='update'"
              @prev="prev"
              @next="next">
            </change-container>
            <new-container
              v-show="step==='new'"
              @prev="prev"
              @next="next">
            </new-container>
            <refactoring-container
              v-show="step==='refactoring'"
              @prev="prev"
              @next="next">
            </refactoring-container>
            <form-container
              v-show="step==='form'"
              @prev="prev"
              @next="next">
            </form-container>
            <preview
              v-if="step==='preview'"
              @clear="clear"
              @prev="prev">
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
import CommonContainer from '@/components/CommonContainer'
import BugContainer from '@/components/BugContainer'
import ChangeContainer from '@/components/ChangeContainer'
import NewContainer from '@/components/NewContainer'
import FormContainer from '@/components/FormContainer'
import RefactoringContainer from '@/components/RefactoringContainer'
import Preview from '@/components/Preview'

export default {
  name: 'Main',
  components: {
    CommonContainer: CommonContainer,
    BugContainer: BugContainer,
    ChangeContainer: ChangeContainer,
    NewContainer: NewContainer,
    FormContainer: FormContainer,
    RefactoringContainer: RefactoringContainer,
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
      // type: 'about',
      // aboutMessage: this.aboutMessage,
      type: 'storage_error',
      storageError: 'Здесь могла быть ваша реклама'
    })
    ipcRenderer.on('set-locale', (event, value) => {
      this.$i18n.locale = value.locale
    })
  },
  methods: {
    clear () {
      this.step = 'commonData'
    },
    prev (componentId) {
      this.step = componentId
    },
    next (componentId) {
      this.step = componentId
    }
  }
}
</script>

<style scoped>

</style>
