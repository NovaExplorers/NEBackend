import express from "express";

import { getDb } from "@utils/database";
import UserModel from "@models/User.model";
import { ICollection, IMonkManager } from "monk";


let db : IMonkManager , devices : ICollection;

setTimeout(()=> {
  db = getDb();
  devices = db.get('devices');
}, 100);

const deviceRouter = express.Router();

deviceRouter.post('/api/v1/getDevices', async (req, res)=>{
    if(!req.user) return res.status(401).send({ success: false, code: 401, message: "Unauthorized", data: {}});

    const user = UserModel.cast(req.user);

    let userDevices = await devices.find({ userAccess: user._id });

    userDevices.map(dev => {
      return { name: dev.name, _id: dev._id }
    });

    res.send({
        success: true,
        code: 200,
        message: '',
        data: userDevices
    });

})

export { deviceRouter };