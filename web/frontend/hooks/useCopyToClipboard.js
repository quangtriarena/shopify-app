export const useCopyToClipboard = (text) => {
  let textArea = document.createElement('textarea')

  try {
    // Place in the top-left corner of screen regardless of scroll position.
    textArea.style.position = 'fixed'
    textArea.style.top = 0
    textArea.style.left = 0
    textArea.style.opacity = 0
    textArea.style.width = 0
    textArea.style.height = 0

    textArea.value = text

    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    return document.execCommand('copy')
  } catch (error) {
    return false
  } finally {
    document.body.removeChild(textArea)
  }
}
