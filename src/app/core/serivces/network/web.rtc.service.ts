import {Injectable} from '@angular/core';
import {DeviceService} from '../device/device.service';
import {NETWORK} from '../commons/constants/NETWORK';
import {ObsererService} from '../commons/utils/obserer.service';
import {Message} from '../../models/Message';

const CONNECTION_TIMEOUT = 6000;
declare var Peer: any;

@Injectable({
    providedIn: 'root'
})
export class WebRtcService {

    myPeer;
    connections: Map<string, any>;
    observerService: ObsererService;
    constructor(private deviceService: DeviceService) {
        this.initPeer();
        this.connections = new Map<string, any>();
        this.observerService = ObsererService.getInstance();

    }


    public getMyPeerConnection() {
        return this.myPeer;
    }

    public initPeer() {
        this.deviceService.getDeviceId()
            .then(deviceId => {
                this.myPeer = new Peer(deviceId);
                this.startNetworkListening();
            })
            .catch(error => {

            });


    }

    public getPeerId() {
        return this.myPeer? this.myPeer.id : '';
    }

    private connectTo(peerId: string) {
        const conn = this.myPeer.connect(peerId);
        this.connections.set(peerId, conn);
    }

    public getConnectionTo(peerId: string) {

            this.connectTo(peerId);
            return this.connections.get(peerId);

    }

    public openConnectionWith(peerId: string): Promise<any> {

        const conn = this.getConnectionTo(peerId);
        return new Promise<any>((resolve, reject) => {

            const timeoutCallback = setTimeout(() => {
                reject(new Error(`Connection timeout to peer :${peerId}`));
            }, NETWORK.CONN_TIMEOUT);

            conn.on('open', function () {
                conn.send(`I want to chat with you!`)
                 resolve(conn.id);
                 clearTimeout(timeoutCallback);
            });


        })
    }

    startNetworkListening() {
        const _this = this;
        this.myPeer.on('connection', function (conn) {

            conn.on('data', function (data) {

                const message = new Message();
                message.peerId = conn.peer;
                message.content = data;
                message.owner = false;

                _this.observerService.pushMessage(message);
                console.log(`New message: ${data}`);
            });
        });
    }
}