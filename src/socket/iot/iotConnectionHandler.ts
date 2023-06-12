import { ICollection, IMonkManager } from 'monk';
import bcrypt from 'bcrypt';

import { getDb } from '@utils/database';
import SocketHandshakeModel from '@models/SocketIOTHandshake.model';
import DeviceModel from '@models/Device.model';
import { Socket } from "socket.io";
import { addDeviceUsers } from 'socket/socketServer';

let db: IMonkManager, devices: ICollection;

setTimeout(() => {
    db = getDb();
    devices = db.get('devices');
}, 100);

export const IOTConnectionHandler = async ({ obj, socket }: { obj: any, socket: Socket }): Promise<any> => {


    const invalid = () => {
        socket.emit('handshakeResponse', { success: false, message: 'Unauthorized.' });
        socket.disconnect()
    }

    let hasHandshaked = false;

    setTimeout(() => {
        if (!hasHandshaked) invalid()
    }, 5000);

    const isValid = await SocketHandshakeModel.isValid(obj);
    if (!isValid) return invalid();

    const handshake = SocketHandshakeModel.cast(obj);

    const dbDevice = await devices.findOne({ _id: handshake.id });
    if (!dbDevice) return invalid();

    const device = DeviceModel.cast(dbDevice);

    const isMatch = await bcrypt.compare(handshake.secret, device.secret);
    if (!isMatch) return invalid();

    hasHandshaked = true;

    socket.emit('handshakeResponse', {
        success: true,
        message: 'Welcome to Skylinker Device Network',
        data: dbDevice
    });

    addDeviceUsers({
        [device._id]: 0
    });

    return {};
}