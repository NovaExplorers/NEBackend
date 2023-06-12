import { ICollection, IMonkManager } from 'monk';
import bcrypt from 'bcrypt';

import { getDb } from '@utils/database';
import { Socket } from "socket.io";
import SocketClientHandshakeModel from '@models/SocketClientHandshake.model';
import UserModel from '@models/User.model';
import { addDeviceUsers } from 'socket/socketServer';

let db: IMonkManager, users: ICollection;

setTimeout(() => {
    db = getDb();
    users = db.get('users');
}, 100);

export const ClientConnectionHandler = async ({ obj, socket }: { obj: any, socket: Socket }): Promise<any> => {


    const invalid = () => {
        socket.emit('handshakeResponse', { success: false, message: 'Unauthorized.' });
        socket.disconnect()
    }

    let hasHandshaked = false;

    setTimeout(() => {
        if (!hasHandshaked) invalid()
    }, 5000);

    const isValid = await SocketClientHandshakeModel.isValid(obj);
    if (!isValid) return invalid();

    const handshake = SocketClientHandshakeModel.cast(obj);
    

    const dbUser = await users.findOne({ _id: handshake.id });
    if (!dbUser) return invalid();

    const user = UserModel.cast(dbUser);
    
    const isMatch = handshake.secret == dbUser.password;
    if (!isMatch) return invalid();

    hasHandshaked = true;

    socket.emit('handshakeResponse', {
        success: true,
        message: 'Welcome to Skylinker Device Network',
    });

    socket.join(handshake.deviceSelected);

    addDeviceUsers({
        [handshake.deviceSelected]: 1
    })

    return {};
}