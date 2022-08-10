import json2csv from 'json2csv'
const { parse } = json2csv

export default (rows) => {
  try {
    let fields = Object.keys(rows[0])
    let opts = { fields, withBOM: true }
    let csv = parse(rows, opts)

    return csv
  } catch (error) {
    throw error
  }
}
