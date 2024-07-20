export const errorHandler = (error, req, res, next) => {
    if (error.statusCode) {
      res.status(error.statusCode);
    } else {
      res.status(500);
    }
    res.json({ error: error.message });
  };