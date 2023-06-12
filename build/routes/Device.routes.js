"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_1 = require("@utils/database");
const User_model_1 = __importDefault(require("@models/User.model"));
let db, devices;
setTimeout(() => {
    db = (0, database_1.getDb)();
    devices = db.get('devices');
}, 100);
const deviceRouter = express_1.default.Router();
exports.deviceRouter = deviceRouter;
deviceRouter.post('/api/v1/getDevices', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        return res.status(401).send({ success: false, code: 401, message: "Unauthorized", data: {} });
    const user = User_model_1.default.cast(req.user);
    let userDevices = yield devices.find({ userAccess: user._id });
    userDevices.map(dev => {
        return { name: dev.name, _id: dev._id };
    });
    res.send({
        success: true,
        code: 200,
        message: '',
        data: userDevices
    });
}));
