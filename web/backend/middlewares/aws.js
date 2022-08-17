import AWS from 'aws-sdk'
import fs from 'fs'

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY_ID, AWS_BUCKET_NAME } = process.env

// Set the AWS Region.
const REGION = 'us-east-1' //e.g. "us-east-1"

const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY_ID,
  region: REGION,
})

/**
 *
 * @param {String} name
 * @returns Object
 */
const createBucket = async (name) => {
  try {
    return new Promise((resolve, reject) => {
      const params = { Bucket: name }

      s3.createBucket(params, function (err, data) {
        if (err) {
          reject(err)
        }

        resolve(data)
      })
    })
  } catch (error) {
    throw error
  }
}

/**
 *
 * @returns Array<Object>
 */
const listBuckets = async () => {
  try {
    return new Promise((resolve, reject) => {
      s3.listBuckets(function (err, data) {
        if (err) {
          reject(err)
        }

        resolve(data.Buckets)
      })
    })
  } catch (error) {
    throw error
  }
}

/**
 *
 * @returns Object
 */
const getPrimaryBucket = async () => {
  try {
    return new Promise((resolve, reject) => {
      s3.listBuckets(function (err, data) {
        if (err) {
          reject(err)
        }

        const bucket = data.Buckets.find((item) => item.Name === AWS_BUCKET_NAME)

        if (!bucket) {
          reject(new Error('Not found'))
        }

        resolve(bucket)
      })
    })
  } catch (error) {
    throw error
  }
}

/**
 *
 * @param {String} name
 * @returns Object
 */
const deleteBucket = async (name) => {
  try {
    return new Promise((resolve, reject) => {
      const params = { Bucket: name }

      s3.deleteBucket(params, function (err, data) {
        if (err) {
          reject(err)
        }

        resolve(data)
      })
    })
  } catch (error) {
    throw error
  }
}

/**
 *
 * @param {String} keyword
 * @returns Array<Object>
 */
const getFiles = async (keyword) => {
  try {
    return new Promise((resolve, reject) => {
      const params = { Bucket: AWS_BUCKET_NAME }

      s3.listObjects(params, function (err, data) {
        if (err) {
          reject(err)
        }

        resolve(
          keyword ? data.Contents.filter((item) => item.Key.includes(keyword)) : data.Contents,
        )
      })
    })
  } catch (error) {
    throw error
  }
}

/**
 *
 * @param {String} key
 * @returns Object
 */
const getFileByKey = async (key) => {
  try {
    return new Promise((resolve, reject) => {
      const params = { Bucket: AWS_BUCKET_NAME }

      s3.listObjects(params, function (err, data) {
        if (err) {
          reject(err)
        }

        let file = data.Contents.find((item) => item.Key === key)
        if (!file) {
          reject(new Error('Not found'))
        }

        resolve(file)
      })
    })
  } catch (error) {
    throw error
  }
}

/**
 *
 * @param {String} key
 * @param {String} content
 * @returns Object
 */
const uploadFile = async (key, content) => {
  try {
    return new Promise(async (resolve, reject) => {
      const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: key,
        Body: content,
        ACL: 'public-read',
      }

      s3.upload(params, function (err, data) {
        if (err) {
          reject(err)
        }

        resolve(data)
      })
    })
  } catch (error) {
    throw error
  }
}

/**
 *
 * @param {String} key
 * @returns Object
 */
const deleteFile = async (key) => {
  return new Promise(async (resolve, reject) => {
    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: key,
    }

    s3.deleteObject(params, function (err, data) {
      if (err) {
        if (err) {
          reject(err)
        }
      }

      resolve(data)
    })
  })
}

/**
 *
 * @param {String} key
 * @param {String} filepath
 * @param {Boolean} unlinked
 * @returns Object
 */
const upload = async (key, filepath, unlinked = true) => {
  try {
    return new Promise(async (resolve, reject) => {
      const fileContent = fs.readFileSync(filepath)

      const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: key,
        Body: fileContent,
        ACL: 'public-read',
      }

      s3.upload(params, function (err, data) {
        if (err) {
          reject(err)
        }

        if (unlinked) {
          /**
           * Delete file
           */
          fs.unlink(filepath, () => {})
        }

        resolve(data)
      })
    })
  } catch (error) {
    throw error
  }
}

const AwsMiddleware = {
  createBucket,
  listBuckets,
  getPrimaryBucket,
  deleteBucket,
  getFiles,
  getFileByKey,
  uploadFile,
  deleteFile,
  upload,
}

export default AwsMiddleware
