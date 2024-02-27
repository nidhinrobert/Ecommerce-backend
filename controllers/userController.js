const authService = require('../services/userServices');

const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const result = await authService.signup(name, email, password);
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Something went wrong" });
    }
};

const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await authService.signin(email, password);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Something went wrong" });
    }
};

const getUser = async (req, res) => {
    try {
        const users = await authService.getUser();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Something went wrong" });
    }
};

module.exports = { signup, signin, getUser };
