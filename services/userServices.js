const User = require("../models/customerModal");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "NOTESAPI";

const signup = async (name, email, password) => {
    try {
        if (!password) {
            throw new Error("Password is required");
        }

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            throw new Error("User already exists");
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await User.create({ 
            email: email,
            password: hashedPassword,
            name: name
        });

        const token = jwt.sign({ email: result.email, id: result._id }, SECRET_KEY);
        return { user: result, token: token };
    } catch (error) {
        throw error;
    }
};

const signin = async (email, password) => {
    try {
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            throw new Error("User not found");
        }
        
        const matchPassword = await bcrypt.compare(password, existingUser.password);
        if (!matchPassword) {
            throw new Error("Invalid credentials");
        }
        
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, SECRET_KEY);
        return { user: existingUser, token: token };
    } catch (error) {
        throw error;
    }
};

const getUser = async () => {
    try {
        const users = await User.find();
        return users;
    } catch (error) {
        throw error;
    }
};

module.exports = { signup, signin, getUser };
