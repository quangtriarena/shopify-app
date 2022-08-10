/**
 *
 * @param {String | Number} value
 * @returns String
 */
const numberWithCommas = (value) => {
  try {
    if (!value) {
      return '0'
    }

    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  } catch (error) {
    return ''
  }
}

export default numberWithCommas
