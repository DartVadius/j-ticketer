import Vue from 'vue'

import './styles/quasar.styl'
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'
import {
  Quasar,
  QAvatar,
  QLayout,
  QHeader,
  QDrawer,
  QPageContainer,
  QPage,
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QInput,
  Notify,
  QCard,
  QCardSection,
  QCardActions,
  QSeparator,
  QSelect,
  QToggle,
  QCheckbox
} from 'quasar'

Vue.use(Quasar, {
  config: {},
  components: {
    QAvatar,
    QLayout,
    QHeader,
    QDrawer,
    QPageContainer,
    QPage,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QItem,
    QItemSection,
    QItemLabel,
    QInput,
    QCard,
    QCardSection,
    QCardActions,
    QSeparator,
    QSelect,
    QToggle,
    QCheckbox
  },
  directives: {
  },
  plugins: {
    Notify
  },
  extras: [
    'material-icons',
    'material-icons-outlined',
    'material-icons-round',
    'material-icons-sharp'
  ]
})
