import {Injectable} from '@angular/core';
import {DeviceService} from '../device/device.service';
import {NETWORK} from '../commons/constants/NETWORK';
import {ObsererService} from '../commons/utils/obserer.service';
import {MessageDTO} from '../../dto/MessageDTO';

declare var Peer: any;

@Injectable({
    providedIn: 'root'
})
export class WebRtcService {

    myPeer;
    connections: Map<string, any>;
    calls: Map<string, any>;

    observerService: ObsererService;

    constructor(private deviceService: DeviceService) {
        this.initPeer();
        this.connections = new Map<string, any>();
        this.calls =  new Map<string, any>();
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
        return this.myPeer ? this.myPeer.id : '';
    }

    private connectTo(peerId: string) {
        const conn = this.myPeer.connect(peerId);
        this.connections.set(peerId, conn);
        return conn;
    }


    public call(peerId: string, stream: any) {

        return new Promise<any>((resolve, reject) => {

            const timeoutCallback = setTimeout(() => {
                reject(new Error(`Connection timeout to peer :${peerId}`));
            }, NETWORK.CALL_TIMEOUT);

            const call = this.myPeer.call(peerId, stream);
            console.log(call)
            call.on('stream', (remoteStream) => {
                clearTimeout(timeoutCallback);
                resolve(remoteStream);
            });
        });



    }

    public answerCall(peerId: string, stream: any): Promise<any> {

        const call = this.calls.get(peerId);

        return new Promise<any>((resolve, reject) => {

            const timeoutCallback = setTimeout(() => {
                reject(new Error(`Call timeout to peer :${peerId}`));
            }, NETWORK.CALL_TIMEOUT);

            if(call) {
                call.answer(stream);
                call.on('stream', (remoteStream) => {
                    console.log('new stream')
                    clearTimeout(timeoutCallback);
                    resolve(remoteStream);
                });
            }

        })
    }

    public getDataConnectionTo(peerId: string): Promise<any> {

        return new Promise((resolve, reject) => {
            if (this.connections.has(peerId)) {
                const conn = this.connections.get(peerId);
                if (conn && conn._open) {
                    console.log('connection is open');
                    resolve(conn);
                } else {
                    console.log('connection is close');
                    this.openDataConnectionWith(peerId)
                        .then(resolve)
                        .catch(reject);
                }
            } else {
                console.log('connection is new');
                this.openDataConnectionWith(peerId)
                    .then(resolve)
                    .catch(reject);
            }

        });


    }

    public openDataConnectionWith(peerId: string): Promise<any> {

        const conn = this.connectTo(peerId);

        return new Promise<any>((resolve, reject) => {

            const timeoutCallback = setTimeout(() => {
                reject(new Error(`Connection timeout to peer :${peerId}`));
            }, NETWORK.CONN_TIMEOUT);

            conn.on('open', function () {
                clearTimeout(timeoutCallback);
                resolve(conn);

            });


        });
    }

    startNetworkListening() {
        const _this = this;
        this.myPeer.on('connection', function (conn) {

            conn.on('data', function (data) {

                const message = new MessageDTO();
                message.peerId = conn.peer;
                message.content = data;


                _this.observerService.pushMessage(message);
                console.log(`New message: ${data} from: ${conn.peer}`);
            });
        });

        this.myPeer.on('call', function (call) {

            console.log(`Income call from ${call.peer}`);
            const peerId = call.peer;
            _this.calls.set(peerId, call);
            console.log(call);
            _this.observerService.incomeCall(peerId);
        })
    }
}