const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../config/db");
const queries = require("../queries/authQueries");

exports.register = async (req, res) => {
  const { user_name, user_email, user_password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(user_password, 10);
    db.query(
      queries.registerUser,
      [user_name, user_email, hashedPassword],
      (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ code: "ERR_REGISTER_FAIL", message: "회원가입 실패" });
        }
        const token = jwt.sign(
          { id: results.insertId },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.json({ token });
      }
    );
  } catch (error) {
    res
      .status(500)
      .json({ code: "ERR_REGISTER_FAIL", message: "회원가입 실패" });
  }
};

exports.login = async (req, res) => {
  const { user_email, user_password } = req.body;
  try {
    db.query(queries.getUserByEmail, [user_email], async (err, results) => {
      if (err || results.length === 0) {
        return res.status(400).json({
          code: "ERR_INVALID_CREDENTIALS",
          message: "유효하지 않은 자격 증명",
        });
      }
      const user = results[0];
      const validPassword = await bcrypt.compare(
        user_password,
        user.user_password
      );
      if (!validPassword) {
        return res.status(400).json({
          code: "ERR_INVALID_CREDENTIALS",
          message: "유효하지 않은 자격 증명",
        });
      }
      const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.json({ token });
    });
  } catch (error) {
    res.status(500).json({ code: "ERR_LOGIN_FAIL", message: "로그인 실패" });
  }
};
