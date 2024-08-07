const jwt = require("jsonwebtoken");

exports.authenticateToken = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) {
    return res
      .status(401)
      .json({ code: "ERR_NO_TOKEN", message: "토큰이 제공되지 않았습니다." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ code: "ERR_INVALID_TOKEN", message: "유효하지 않은 토큰" });
  }
};
