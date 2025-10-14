// middleware/language-detector.global.js


export default defineNuxtRouteMiddleware((to, from, next) => {
  // console.log('process', process)
  const all_paths = to.path.split('/')
  console.log('All path segments:', all_paths)
  const last_path = all_paths[all_paths.length - 1]
  if (['test-rick', 'public'].includes(last_path)) {
    // console.log('Skipping language detection for asset path:', to.fullPath)
    return; // Skip language detection for these paths
  }
  const some_image_ext = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', 'favicon.ico']
  if (some_image_ext.some(ext => to.path.endsWith(ext))) {
    return; // Skip language detection for asset paths
  }

  if (process.server) {
    console.log('Language detector middleware running on server for path:', to.fullPath)

    // Helper function to perform redirection

    const redirect = (path) => {
      // console.log('Redirecting to:', path)
      return navigateTo(path)
    }

    // Your website's supported languages and default language
    const supportedLocales = ['es', 'en', 'pt', 'fr'];
    const defaultLocale = 'es';

    // Get the language code from the cookie if it exists
    // The cookie-universal-nuxt module injected by Nuxt makes this easy
    const cookieLang = useCookie('user_lang')
    // console.log('Cookie user_lang 1:', cookieLang.value)
    // const cookieLang = app.$cookies.get('user_lang');

    if (cookieLang.value && !to.path.startsWith(`/${cookieLang.value}`)) {
      // console.log('Redirecting based on cookie to:', `/${cookieLang.value}${to.fullPath}`)
      return redirect(`/${cookieLang.value}${to.fullPath}`);
    }

    // Don't run detection logic if the user is already on a localized path
    // or if there's a cookie
    const currentLang = to.path.split('/')[1];
    // console.log('Current lang from path:', currentLang)
    if (supportedLocales.includes(currentLang) || cookieLang.value) {
      // console.log('Already localized, no redirection needed.', to.path)
      return;
    }

    // Check the Accept-Language header from the browser
    const acceptLanguage = useRequestHeader('accept-language') || ''
    // console.log('Accept-Language header:', acceptLanguage)

    if (!acceptLanguage) {
      // console.log('No Accept-Language header, redirecting to default locale:', `/${defaultLocale}${to.fullPath}`)
      return redirect(`/${defaultLocale}${to.fullPath}`);
    }

    // Use a library or simple regex to parse the header
    // Example: 'es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7' -> ['es-MX', 'es', 'en-US', 'en']
    const browserLanguages = acceptLanguage.split(',')
      .map(lang => lang.split(';')[0]
        .toLowerCase().substring(0, 2));

    // console.log('Browser languages:', browserLanguages)

    // Find the first language in the user's preferences that your site supports
    const matchedLanguage = browserLanguages.find(
      lang => supportedLocales.includes(lang));
    // console.log('Matched language:', matchedLanguage)

    // Fallback to default if no match
    const finalLanguage = matchedLanguage || defaultLocale;
    // console.log('Final language to use:', finalLanguage)

    cookieLang.value = finalLanguage
    // console.log('Cookie user_lang 2:', cookieLang.value)

    // Redirect to the detected language path
    // Only redirect from the root path to avoid redirect loops on non-localized assets
    if (to.path === '/') {
      // console.log('Redirecting to detected language path:', `/${finalLanguage}${to.fullPath}`)
      return redirect(`/${finalLanguage}${to.fullPath}`);
    } else {
      // console.log('Not redirecting since not on root path:', to.path)
      return redirect(`/${finalLanguage}${to.fullPath}`);
    }
  }
});


// Helper function to parse Accept-Language header
function parseAcceptLanguage(acceptLanguage) {
  if (!acceptLanguage) return 'es'
  // Parse the Accept-Language header
  // Format: "en-US,en;q=0.9,es;q=0.8,fr;q=0.7"
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [language, quality = 'q=1'] = lang.trim().split(';')
      const q = parseFloat(quality.replace('q=', ''))
      return { language: language.toLowerCase(), quality: q }
    })
    .sort((a, b) => b.quality - a.quality)

  // Return the highest priority language (first 2 characters)
  return languages[0]?.language.substring(0, 2) || 'en'
}
