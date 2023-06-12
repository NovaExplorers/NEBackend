import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';


import { IOTConnectionHandler } from './iot/iotConnectionHandler';
import { deviceUser } from 'interfaces/DeviceUser.interface';

import { ClientConnectionHandler } from './client/clientConnectionHandler';
import { startLinking } from './links/linkManager';

let deviceUsers : deviceUser = {};
let io: Server;

const initServer = () => {


    const socketApp = express();
    const httpServer = createServer(socketApp);
    io = new Server(httpServer, { cors: { origin: '*' } });


    io.on('connection', socket => {
        console.log('Device connected');


        socket.on('handshake', async obj => {
            if(obj.type == 1) await ClientConnectionHandler({ obj, socket });
            if(obj.type == 2){
                await IOTConnectionHandler({ obj, socket });
                
                startLinking({ socket, io, obj });
            }

            
        });
    });

    httpServer.listen(8070, function () {
        var port: any = httpServer.address();
        console.log('Socket address is ', port.port);
    });
}

const getSocketServer = (): Server => io;
const getDeviceUsers = () : deviceUser => deviceUsers;
const addDeviceUsers = (added : any)=> deviceUsers = { ...deviceUsers, ...added }


export { initServer, getSocketServer, getDeviceUsers, addDeviceUsers };