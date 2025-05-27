const asyncHandler = (fun) => {
  return async (req, res, next) => {
    try {
      await fun(req, res, next);
    } catch (err) {
      res.status(err.code || 500).json({
        success: false,
        message: err.message,
      });
    }
  };
};

export { asyncHandler };
