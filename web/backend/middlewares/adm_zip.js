import fs from 'fs'
import path, { join } from 'path'
import AdmZip from 'adm-zip'

/**
 * https://www.digitalocean.com/community/tutorials/how-to-work-with-zip-files-in-node-js
 */

async function create(filepath) {
  try {
    const zip = new AdmZip()

    zip.writeZip(filepath)
  } catch (e) {
    throw e
  }
}

async function read(filepath) {
  try {
    const zip = new AdmZip(filepath)

    let files = zip.getEntries()

    files = files.map((file) => file.toJSON())

    return files
  } catch (e) {
    throw e
  }
}

async function update(filepath, files) {
  try {
    const zip = new AdmZip(filepath)

    files.forEach((file) => zip.addFile(file.filename, file.content))

    zip.writeZip(filepath)
  } catch (e) {
    throw e
  }
}

async function extract(filepath, suffix = 'extracted') {
  try {
    const zip = new AdmZip(filepath)

    const outputDir = path.parse(filepath).dir + '/' + `${path.parse(filepath).name}_${suffix}`

    zip.extractAllTo(outputDir)

    return outputDir
  } catch (e) {
    throw e
  }
}

const AdminZipMiddleware = {
  create,
  read,
  update,
  extract,
}

export default AdminZipMiddleware
