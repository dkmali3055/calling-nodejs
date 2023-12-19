exports.errorResponse = (req,res,statusCode = 500,err) => {
  return res.status(statusCode).json({
    error : err
  });
}

exports.successResponse = (req,res, statusCode = 200, message,data) => {
  return res.status(statusCode).json({
    message,data
  });
}


