const centralError = (err, req, res, next) => {
  if (!err.statusCode) {
    res.status(500).send({ message: 'Произошла ошибка' });
  } else {
    res.status(err.statusCode).send({ message: 'Произошла Ошибка' });
    next();
  }
};

module.exports = centralError;
