const ResponseHandler = {
  success: (res, data) => {
    res.status(200).json({ success: true, data })
  },
  error: (res, error, status) => {
    res.status(status || 200).json({ success: false, error: { ...error, message: error.message } })
  },
}

export default ResponseHandler
