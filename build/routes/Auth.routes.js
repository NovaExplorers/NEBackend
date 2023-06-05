import express from "express";
import { passport } from '@middleware/local.strategy';
const authRouter = express.Router();
authRouter.use(passport.initialize());
authRouter.post('/auth', passport.authenticate('local'), (req, res) => {
    res.json({
        success: true,
        code: 200,
        message: 'Login successful',
        data: {
            user: req.user
        }
    });
});
export { authRouter };
