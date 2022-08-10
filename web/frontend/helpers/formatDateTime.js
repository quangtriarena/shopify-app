import moment from 'moment'

/**
 *
 * @param {String | Number} datetime
 * @param {String} type
 * @returns String
 */
const formatDateTime = (datetime, type = 'YYYY-MM-DD') => {
  let _datetime = new Date(datetime).getTime()

  const newDate = new Date(_datetime)
  const yyyy = newDate.getFullYear()
  const yyyyStr = `${yyyy}`
  const mm = newDate.getMonth() + 1
  const mmStr = `${mm < 10 ? `0` : ``}${mm}`
  const dd = newDate.getDate()
  const ddStr = `${dd < 10 ? `0` : ``}${dd}`

  switch (type) {
    case 'YYYY/MM/DD':
      // 2020/02/26
      return `${yyyyStr}/${mmStr}/${ddStr}`

    case 'YYYY-MM-DD':
      // 2020-02-26
      return `${yyyyStr}-${mmStr}-${ddStr}`

    case 'MM/DD/YYYY':
      // 02/26/2020
      return `${mmStr}/${ddStr}/${yyyyStr}`

    case 'Month DD, YYYY':
      // December 25, 2020
      return moment(_datetime).format('LL')

    case 'LL':
      // December 25, 2020
      return moment(_datetime).format(type)

    case 'LLL':
      // December 29, 2020 12:00 AM
      return moment(_datetime).format(type)

    default:
      // 2020-02-26
      return `${yyyyStr}-${mmStr}-${ddStr}`
  }
}

export default formatDateTime
