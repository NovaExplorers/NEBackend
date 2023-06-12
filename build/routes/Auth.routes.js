"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const local_strategy_1 = require("@middleware/local.strategy");
const authRouter = express_1.default.Router();
exports.authRouter = authRouter;
authRouter.use(local_strategy_1.passport.initialize());
authRouter.use(local_strategy_1.passport.session());
authRouter.post('/api/v1/auth', local_strategy_1.passport.authenticate('local'), (req, res) => {
    const user = req.user;
    res.json({
        success: true,
        code: 200,
        message: 'Login successful',
        data: { loggedIn: true, user: req.user }
    });
});
authRouter.get('/api/v1/getUser', (req, res) => {
    if (req.user) {
        res.json({ loggedIn: true, user: req.user });
    }
    else
        res.json({ loggedIn: false });
});
