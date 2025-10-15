import {computed} from "vue";

export const locales = [
  { code: 'es', name: 'Español', flag: 'mx', is_default: true },
  { code: 'en', name: 'English', flag: 'za' },
  { code: 'pt', name: 'Português', flag: 'br' },
  { code: 'fr', name: 'Français', flag: 'ht' },
]

export const defaultLocale = 'es'

export const currentLocale = computed(() => {
  const { query, params } = useRoute()
  const accepted_languages = ['es', 'en', 'pt', 'fr']
  let lang = query._storyblok_lang || params.lang
  if (lang && accepted_languages.includes(lang))
    return lang
  return null
})

