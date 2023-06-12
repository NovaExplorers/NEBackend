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
exports.getDeviceSet = exports.getSocketServer = exports.initServer = exports.deviceSet = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("@utils/database");
const SocketHandshake_model_1 = __importDefault(require("@models/SocketHandshake.model"));
const Device_model_1 = __importDefault(require("@models/Device.model"));
const deviceSet = {};
exports.deviceSet = deviceSet;
let io;
const initServer = () => {
    const socketApp = (0, express_1.default)();
    const httpServer = (0, http_1.createServer)(socketApp);
    io = new socket_io_1.Server(httpServer, { cors: { origin: '*' } });
    let db, devices;
    setTimeout(() => {
        db = (0, database_1.getDb)();
        devices = db.get('devices');
    }, 100);
    io.on('connection', socket => {
        let hasHandshaked = false;
        socket.on('handshake', (obj) => __awaiter(void 0, void 0, void 0, function* () {
            const invalid = () => {
                socket.emit('handshakeResponse', { success: false, message: 'Unauthorized.' });
                socket.disconnect();
            };
            const isValid = yield SocketHandshake_model_1.default.isValid(obj);
            if (!isValid)
                return invalid();
            const handshake = SocketHandshake_model_1.default.cast(obj);
            const dbDevice = yield devices.findOne({ _id: handshake.id });
            if (!dbDevice)
                return invalid();
            const device = Device_model_1.default.cast(dbDevice);
            const isMatch = yield bcrypt_1.default.compare(handshake.secret, device.secret);
            if (!isMatch)
                return invalid();
            socket.emit('handshakeResponse', {
                success: true,
                message: 'Welcome to Skylinker Device Network',
                data: dbDevice
            });
            deviceSet[device._id] = socket;
        }));
    });
    httpServer.listen(8070, function () {
        var _a;
        var port = (_a = httpServer.address()) === null || _a === void 0 ? void 0 : _a.toString();
        console.log('Socket address is ', port);
    });
};
exports.initServer = initServer;
const getSocketServer = () => io;
exports.getSocketServer = getSocketServer;
const getDeviceSet = () => deviceSet;
exports.getDeviceSet = getDeviceSet;
