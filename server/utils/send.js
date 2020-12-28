const send = (res, status, data) => {
  let success = status.toString().charAt(0) === "2" ? true : false;
  let resObj = success ? { success, data } : { success, error: data };
  res.status(status).send(resObj);
};

module.exports = send;
