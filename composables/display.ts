
export function needShow(size: string | undefined, display: any): boolean {
  if (!size) return false
  const { xs, smAndDown, smAndUp, mdAndUp, lgAndUp, xlAndUp } = display
  // console.log("need_show", size)
  // console.log("lgAndUp", lgAndUp.value)
  if (size === 'never') return false
  if (size === 'always') return true
  if (size === 'xs') return xs.value
  if (size === 'smAndDown') return smAndDown.value
  if (size === 'smAndUp') return smAndUp.value
  if (size === 'mdAndUp') return mdAndUp.value
  if (size === 'lgAndUp') return lgAndUp.value
  if (size === 'xlAndUp') return xlAndUp.value
  return false
}