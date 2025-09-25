// import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import { aliases, md } from 'vuetify/iconsets/md'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { VDateInput } from "vuetify/labs/VDateInput"
import { VBtn } from 'vuetify/components/VBtn'
// import colors from 'vuetify/lib/util/colors'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    components: {
      VDateInput
    },
    theme: {
      themes: {
        light: {
          dark: false,
          colors: {
            primary: "#3BF4FB",
            secondary: "#00FF99",
            accent: "#FFD91F",
            accentDark: "#a88b13",
            info: "#001249",
            warning: "#e0be79",
            // primaryDark: "#9B055D",
            pinked: "#f6b6bd",
            choco: "#3A0811",
            // otter: "#333",
          }
        },
        dashboard: {
          dark: false,
          colors: {
            primary: "#3a3a3a",
            secondary: "#EE8B44",
            accent: "#5F9398",
            info: "#001249",
            warning: "#e0be79",
          }
        }
      }
    },
    aliases: {
      VBtnPrimary: VBtn,
      VBtnText: VBtn,
      VBtnMenu: VBtn,
    },
    icons: {
      defaultSet: 'md',
      aliases,
      sets: {
        md,
      }
    },
    defaults: {
      VBtnPrimary: {
        class: ['v-btn--accent', 'text-none', 'rounded-xl', 'px-6', 'text-weight-bold'],
        // prependIcon: 'arrow_back',
        appendIcon: 'add',
      },
      VBtnText: {
        class: ['v-btn--text', 'rounded-xl', 'px-6'],
        // prependIcon: 'arrow_back',
        appendIcon: 'add',
      },
      VBtnMenu: {
        class: ['v-btn--menu', 'text-none'],
      },
    },
    display: {
      // mobileBreakpoint: 'sm',
      thresholds: {
        xs: 0,
        sm: 340,
        md: 600,
        lg: 1024,
        xl: 1440,
      },
    },
    date: {
      locale: {
        'es-MX': {
          firstDayOfWeek: 0,
          masks: {
              input: 'DD/MM/YYYY',
              date: 'DD/MM/YYYY',
              time: 'HH:mm',
              datetime: 'DD/MM/YYYY HH:mm',
          },
        },
      },
    }
  })
  app.vueApp.use(vuetify)
})