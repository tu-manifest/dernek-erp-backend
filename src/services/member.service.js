import express from 'express';

const app = express();

export const getUserById =  async (req, res, next) => {
    return res.status(200).json({success: true, data: {id: req.params.id, name: "John Doe"}});
}
