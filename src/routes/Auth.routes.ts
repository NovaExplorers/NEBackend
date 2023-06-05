import express from "express";
import { passport } from '@middleware/local.strategy'

const authRouter = express.Router();
authRouter.use(passport.initialize());
authRouter.use(passport.session());


authRouter.post('/api/v1/auth', passport.authenticate('local'), (req, res) => {
    const user = (<any> req.user);
    res.json({
        success: true,
        code: 200,
        message: 'Login successful',
        data: { loggedIn: true, user: req.user }
    })
})

authRouter.get('/api/v1/getUser', (req, res)=> {
    if(req.user) {
        res.json({ loggedIn: true, user: req.user })
    }
    else res.json({ loggedIn: false })
})

export { authRouter };