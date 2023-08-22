import { Router } from 'express'
import { UserModel } from '../db.js'
import jwt from 'jsonwebtoken'

const router = Router()

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await UserModel.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const accessToken = jwt.sign({ userId: user._id, isAdmin: user.isAdmin, name: user.name }, process.env.ACCESS_TOKEN_SECRET);

        res.json({ user, accessToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while processing your request' });
    }
});

export default router