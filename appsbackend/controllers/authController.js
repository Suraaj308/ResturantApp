const jwt = require('jsonwebtoken');

const login = (req, res) => {
    const { username, password } = req.body;

    const validUsername = 'admin123';
    const validePassword = 'admin123';

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    if (username !== validUsername || password !== validePassword) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ message: 'Login successful', token });
};

module.exports = { login };