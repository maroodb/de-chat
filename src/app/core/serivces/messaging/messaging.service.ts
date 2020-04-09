import {Injectable} from '@angular/core';
import {WebRtcService} from '../network/web.rtc.service';
import {NETWORK} from '../commons/constants/NETWORK';

@Injectable({
    providedIn: 'root'
})
export class MessagingService {

    constructor(private webRtcService: WebRtcService) {

    }

    public sendMessageTo(peerId, message): Promise<any> {

        console.log(`send message to: ${peerId}`);
        const conn = this.webRtcService.getConnectionTo(peerId);

        console.log(conn)

        return new Promise<any>(((resolve, reject) => {

            const timeoutCallback = setTimeout(() => {
                reject(new Error(`Connection timeout to peer: ${peerId}`));
            }, NETWORK.CONN_TIMEOUT);

            conn.on('open', function () {
                console.log(conn);
                conn.send(message);
                resolve(conn.id);
                clearTimeout(timeoutCallback);
            });


        }))

    }

    public getMyPeerId(){
        return this.webRtcService.getPeerId();
    }

    public openConnectionWith(peerId: string) {
        return this.webRtcService.openConnectionWith(peerId);
    }
}