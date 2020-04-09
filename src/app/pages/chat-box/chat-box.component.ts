import {Component, NgZone, OnInit} from '@angular/core';
import {SharedMemory} from '../../core/serivces/commons/utils/shared.memory';
import {Contact} from '../../core/entities/Contact';
import {MessagingService} from '../../core/serivces/messaging/messaging.service';
import { Base64 } from 'js-base64';
import {Message} from '../../core/models/Message';
import {ObsererService} from '../../core/serivces/commons/utils/obserer.service';
import {MessageDao} from '../../core/dao/message.dao';

@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements OnInit {

    myPeerId;
    messages: Message [];
    showEmojiMenu = false;
    sharedMemory: SharedMemory;
    currentContact: Contact;
    messageToSend;

    observerService: ObsererService;
    constructor(private messagingService: MessagingService,
                private messageDao: MessageDao,
                private zone: NgZone) {
        this.sharedMemory = SharedMemory.getInstance();
        this.observerService = ObsererService.getInstance();
    }

    ngOnInit() {
        this.messages = [];
        this.currentContact = this.sharedMemory.getCurrentContact();
        this.messageToSend = '';
        this.listenForMessage();

        this.messageDao.findAll()
            .then(console.log)
    }

    ionViewWillEnter() {
        this.currentContact = this.sharedMemory.getCurrentContact();
    }

    sendMessage() {
        const message = new Message();
        message.owner = true;
        message.content = this.messageToSend;

        this.messageDao.addMessage(this.messageToSend).then(console.log).catch(console.log)
        const messageEncoded = Base64.encode(this.messageToSend);
        this.messagingService.sendMessageTo(this.currentContact.peerId, messageEncoded)
            .then(done => {
                this.messages.push(message);
                this.messageToSend = '';
                console.log("done");
            })
            .catch(error => {
                console.log(error.toString())
            })
    }

    addEmoji(event) {
        console.log(event);
        console.log(event.emoji.native);
        this.messageToSend += event.emoji.native;

    }

    listenForMessage() {
        this.observerService.subject.subscribe((message) => {

            this.zone.run(() => {
                console.log( Base64.decode(message.content));
                message.content = Base64.decode(message.content);
                this.messages.push(message);

            })

        })
    }

    toggleEmojiMenu() {
        this.showEmojiMenu = !this.showEmojiMenu;
    }

    hideEmojiMenu() {
        this.showEmojiMenu = false;
    }
}
