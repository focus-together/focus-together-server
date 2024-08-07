exports.registerUser = `
    INSERT INTO user (user_name, user_email, password)
    VALUES (?, ?, ?)
`;

exports.getUserByEmail = `
    SELECT * FROM user
    WHERE user_email = ?
`;
