interface Button {
  to: {
    url?: string
    cached_url?: string
    linktype?: string
  }
  main_url?: string
  is_external?: boolean
  [key: string]: any
}

export function calcFinalUrl(button: Button, lang: string): Button {
  if (!button.to)
    return button
  const main_url = button.to.cached_url || button.to.url || ''
  button.main_url = main_url
  button.is_external = button.to?.linktype === 'url'
  if (button.is_external)
    return button
  if (button.to.cached_url || button.to.url){
    const all_paths = main_url.split('/')
    const some_is_current_lang = all_paths.some(
      path => path === lang)
    if (!some_is_current_lang) {
      const sep = main_url.startsWith('/') ? '' : '/'
      button.main_url = `/${lang}${sep}${main_url}`
    }
  }
  return button
}
