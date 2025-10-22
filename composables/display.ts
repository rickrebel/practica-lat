
export function needShow(size: string | undefined, display: any): boolean {
  if (!size) return false
  // const { xs, smAndDown, smAndUp, mdAndUp, lgAndUp, xlAndUp } = display
  console.log("display", display)
  console.log("size", size)
  console.log("mdAndUp 0", display.mdAndUp.value)
  // console.log("mdAndUp 1", mdAndUp.value)
  return display[size]?.value ?? false
  // const xs = computed(() => display.xs.value)
  // const smAndDown = computed(() => display.smAndDown.value)
  // const smAndUp = computed(() => display.smAndUp.value)
  // const mdAndUp = computed(() => display.mdAndUp.value)
  // const lgAndUp = computed(() => display.lgAndUp.value)
  // const xlAndUp = computed(() => display.xlAndUp.value)
  // if (size === 'never') return false
  // if (size === 'always') return true
  // if (size === 'xs') return xs.value
  // if (size === 'smAndDown') return smAndDown.value
  // if (size === 'smAndUp') return smAndUp.value
  // if (size === 'mdAndUp') return mdAndUp.value
  // if (size === 'lgAndUp') return lgAndUp.value
  // if (size === 'xlAndUp') return xlAndUp.value
  // return false
}