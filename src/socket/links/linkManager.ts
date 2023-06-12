import { Server, Socket } from "socket.io";
import { getDeviceUsers } from "socket/socketServer";
import { v4 as uuidv4 } from 'uuid';

const seconds = (s : number) => s * 1000;

interface Info {
    cron: boolean;
    time: number;
    clientMethods: Array<any>
}

interface InfoObj {
    [key: string]: Info;
}

const infos : InfoObj = {
    getLTELink: {
        cron: false,
        time: seconds(5),
        clientMethods: [
            ['signalStrength', 'cellular.signal.percentage'],
            ['networkType', 'cellular.connectivity.generation']
        ]
    },
    getProfileInfo: {
        cron: true,
        time: seconds(60 * 3),
        clientMethods: [
            'cellular.dataPlan.carrier'
        ]
    },
    getDataUsage: {
        cron: false,
        time: seconds(10),
        clientMethods: [
            'cellular.dataPlan.used'
        ]
    },
    getWLANClients: {
        cron: true,
        time: seconds(60),
        clientMethods: [
            'internet.wifi.connectedClients'
        ]
    },
    getLANClients: {
        cron: true,
        time: seconds(60),
        clientMethods: [
            'internet.ethernet.connectedClients'
        ]
    }
}

const startLinking = async ({ socket, io, obj } : {socket: Socket, io: Server, obj: any }) => {


    console.log('here1');

    await Promise.all(
        Object.entries(infos).map(async ([k, v])=> {
            console.log('here12');
            const requestId = uuidv4();
            socket.emit('lte', {
                functionName: k,
                requestId
            })

            console.log('emitted');
            

            await new Promise((yes, no) => {
                socket.on('lteResponse', res => {
                    if(res.requestId != requestId) return;

                    v.clientMethods.forEach((el : any, index : number) => {
                       if(typeof el == 'string') {
                            socket.to(obj.id).emit('setInfo', {
                                key: el,
                                value: res.value
                            })
                       }
                       else {
                        
                            socket.to(obj.id).emit('setInfo', {
                                key: el[1],
                                value: res.value[el[0]]
                            })
                       }
                    })

                    yes('')
                    
                })
            })
        })
    )
}



export { startLinking };