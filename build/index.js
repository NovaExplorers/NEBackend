"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("@utils/database");
const Auth_routes_1 = require("@routes/Auth.routes");
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const express_session_1 = __importDefault(require("express-session"));
const Device_routes_1 = require("@routes/Device.routes");
const socketServer_1 = require("socket/socketServer");
const MongoDBStore = require('connect-mongodb-session')(express_session_1.default);
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    store: new MongoDBStore({
        uri: process.env.DB_URL,
        collection: 'sessions',
        connectionOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            ssl: true,
            sslValidate: false,
        }
    })
}));
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));
(0, database_1.initDb)();
(0, socketServer_1.initServer)();
app.use(Auth_routes_1.authRouter);
app.use(Device_routes_1.deviceRouter);
app.listen(8080, () => {
    console.log("Skylinker API - Listening on port 8080");
});
