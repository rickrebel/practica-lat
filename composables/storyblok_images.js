
function toInt(val) {
  const intVal = parseInt(val)
  return isNaN(intVal) ? 0 : intVal
}


export function resizeImg(img, size1 = 0, size2 = 0) {
  if (!size1 && !size2)
    size1 = 400

  if (typeof img === 'string') {
    console.error("img needs to be the storyblok image object, not a string")
    return null
  }

  if (typeof img !== 'undefined') {
    if (img.filename){
      if (img.filename.endsWith('.svg'))
        return img.filename
      size1 = toInt(size1)
      size2 = toInt(size2)
      return `//img2.storyblok.com/${size1}x${size2}${img.filename.replace('https://a.storyblok.com', '')}`
    }
  }
  return null
}

export function transformImage(image, size1 = 0, size2 = 0) {
  if (!size1 && !size2)
    size1 = 400
  if (!image) return ''
  const focus_point = image.focus
  size1 = toInt(size1)
  size2 = toInt(size2)
  let final_path = `${image.filename}/m/${size1}x${size2}`

  if (focus_point) {
    final_path += `/filters:focal(${focus_point})`
  }
  return final_path
}
