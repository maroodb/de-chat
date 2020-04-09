import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {MessagingService} from '../../core/serivces/messaging/messaging.service';
import {ToastService} from '../../core/serivces/commons/layout/toast.service';
import {SpinnerService} from '../../core/serivces/commons/layout/spinner.service';
import {ObsererService} from '../../core/serivces/commons/utils/obserer.service';
import {Message} from '../../core/models/Message';
import { Base64 } from 'js-base64';
@Component({
    selector: 'app-tab1',
    templateUrl: 'chat.page.html',
    styleUrls: ['chat.page.scss']
})
export class ChatPage implements OnInit {

    @ViewChild('content', {static: true}) private content: any;

    messageToSend;
    myId;
    isConnected = false;
    receiverId;
    messages: Message [];
    observerService: ObsererService;
    constructor(private messagingService: MessagingService,
                private spinnerService: SpinnerService,
                private zone: NgZone,
                private toastService: ToastService) {
        this.observerService = ObsererService.getInstance();
    }

    ngOnInit(): void {

        this.myId = this.messagingService.getMyPeerId();
        this.listenForMessage();
        this.messages = [];

    }


    refreshId() {
        this.myId = this.messagingService.getMyPeerId();
    }

    cancel() {
        this.receiverId = '';
        this.isConnected = false;

    }

    connect() {
        this.spinnerService.spinnerOn();
        this.messagingService.openConnectionWith(this.receiverId)
            .then(connected => {
                this.isConnected = true;
                this.toastService.showSuccessMessage(`Your are successfully connected to ${this.receiverId}, Enjoy!`);
            })
            .catch(error => {
                this.isConnected = false;
                this.toastService.showErrorMessage(`${error.toString()}`);
            })
            .finally(() => {
                this.spinnerService.spinnerOff();
            });
    }

    isMyMessage(msg): boolean {
        return msg && msg.peerId === this.myId;
    }

    sendMessage() {
        if(!this.isValidMessage()) {
            return;
        }
        const message = new Message();
        message.peerId = this.myId;
        message.content = this.messageToSend;
        this.messages.push(message);
        this.content.scrollToBottom();

        this.messagingService.sendMessageTo(this.receiverId, this.messageToSend)
            .then(sent => {
                this.messageToSend = '';
            })
            .catch(error => {
                console.log(error.toString());
            })


    }

    listenForMessage() {
        this.observerService.subject.subscribe((message) => {

            this.zone.run(() => {
                console.log( Base64.decode(message.content));
                message.content = Base64.decode(message.content);
                this.messages.push(message);
                this.checkReceiver(message.peerId);
            })

        })
    }

    isValidMessage(): boolean {
        return this.messageToSend && this.messageToSend.length > 0;
    }

    checkReceiver(peerId) {
        if(!this.isConnected) {
            this.receiverId = peerId;
            this.isConnected = true;
        }

    }
}
