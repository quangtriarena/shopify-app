export const getFieldValue = (value) => {
  try {
    if (value === null || value === undefined) {
      return ''
    }

    return String(value)
  } catch (error) {
    return ''
  }
}
