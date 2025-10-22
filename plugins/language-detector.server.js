// plugins/language-detector.server.js
export default defineNuxtPlugin((nuxtApp) => {
  const event = useRequestEvent()
  const cookieLang = useCookie('user_lang')
  const route = useRoute()

  const supportedLocales = ['es', 'en', 'pt', 'fr']
  const defaultLocale = 'es'

  // Skip for assets
  const some_image_ext = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', 'favicon.ico']
  if (some_image_ext.some(ext => route.path.endsWith(ext))) {
    //console.log('Skipping language detection for image asset path:', route.fullPath)
    return
  }

  //console.log('Language detector plugin running on server for path:', route.fullPath)

  const currentLang = route.path.split('/')[1]
  //console.log('Current lang from path:', currentLang)

  // If valid language in URL, set cookie and continue
  if (supportedLocales.includes(currentLang)) {
    //console.log('Already localized, no redirection needed.', route.path)
    cookieLang.value = currentLang
    return
  }

  // If cookie exists but no language in URL, redirect
  if (cookieLang.value && !route.path.startsWith(`/${cookieLang.value}`)) {
    //console.log('Redirecting based on cookie to:', `/${cookieLang.value}${route.fullPath}`)
    return navigateTo(`/${cookieLang.value}${route.fullPath}`, { redirectCode: 301 })
  }

  // Detect from browser
  const acceptLanguage = useRequestHeader('accept-language') || ''
  //console.log('Accept-Language header:', acceptLanguage)
  const browserLanguages = acceptLanguage.split(',')
    .map(lang => lang.split(';')[0].toLowerCase().substring(0, 2))

  const matchedLanguage = browserLanguages.find(
    lang => supportedLocales.includes(lang))
  const finalLanguage = matchedLanguage || defaultLocale
  //console.log('Final language to use:', finalLanguage)

  cookieLang.value = finalLanguage
  return navigateTo(`/${finalLanguage}${route.fullPath}`, { redirectCode: 301 })
})