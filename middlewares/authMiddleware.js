const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
};

const authenticateAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    res.sendStatus(403);
  }
};

module.exports = { authenticateToken, authenticateAdmin };
