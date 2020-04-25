import {Injectable} from '@angular/core';
import {WebRtcService} from '../network/web.rtc.service';
import { Base64 } from 'js-base64';

import {ChatService} from '../chat/chat.service';

@Injectable({
    providedIn: 'root'
})
export class MessagingService {

    constructor(private webRtcService: WebRtcService, private chatService: ChatService) {

    }


    public sendMessageTo(peerId, messageContent): Promise<any> {

        const messageEncoded = Base64.encode(messageContent);




        return new Promise<any>(((resolve, reject) => {
            this.webRtcService.getDataConnectionTo(peerId)
                .then(conn => {
                    conn.send(messageEncoded);
                    this.chatService.addMessageToPeer(messageEncoded, peerId)
                        .then(resolve)
                        .catch(reject);
                })
                .catch(error => {
                    console.log(`Send Error: ${error.toString()}`);
                    reject(error)
                })


        }))

    }

    public getMyPeerId(){
        return this.webRtcService.getPeerId();
    }

    public openConnectionWith(peerId: string) {
        return this.webRtcService.openDataConnectionWith(peerId);
    }
}