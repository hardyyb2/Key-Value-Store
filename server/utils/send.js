const send = (res, status, data) => {
  let success = status.toString().charAt(0) === "2" ? true : false;
  res.status(status).send({ success, data });
};

module.exports = send;
