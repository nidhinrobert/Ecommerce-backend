const authService = require('../services/userServices');
const User = require("../models/customerModal");

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
    const search = req.query.search || '';
    const currentPage = req.query.currentPage ? parseInt(req.query.currentPage) : 1;
    const itemsPerPage = req.query.itemsPerPage ? parseInt(req.query.itemsPerPage) : 10;

    try {
        const matchStage = {};

        if (search) {
            matchStage.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        const aggregationPipeline = [
            { $match: matchStage },
            { $sort: { createdAt: -1 } },
            {
                $facet: {
                    Users: [
                        { $project: { _id: 1, name: 1, email: 1 } },
                        { $skip: Math.max(0, (currentPage - 1) * itemsPerPage) }, 
                        { $limit: itemsPerPage },
                    ],
                    totalCount: [
                        { $count: 'count' }
                    ],
                }
            },
            {
                $project: {
                    Users: 1,
                    totalCount: { $ifNull: [{ $arrayElemAt: ['$totalCount.count', 0] }, 0] },
                }
            }
        ];

        const result = await User.aggregate(aggregationPipeline); 
        const { Users, totalCount } = result[0];
        res.status(200).json({ Users, totalCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Something went wrong" });
    }
};


module.exports = { signup, signin, getUser };
