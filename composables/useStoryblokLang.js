export const useStoryblokLang = () => {
  const { query, params } = useRoute()

  const duplicates_codes = {
    'fr': 'es',
    'pt': 'en',
  }

  let code_language = query._storyblok_lang || params.lang || 'es'
  const is_duplicate = Object.keys(duplicates_codes).includes(params.lang)

  if (is_duplicate)
    code_language = params.lang

  const final_code = is_duplicate
    ? duplicates_codes[code_language]
    : code_language

  return {
    final_code,
    code: code_language,
    prefix: is_duplicate ? `${code_language}/` : '',
  }
}