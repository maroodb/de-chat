import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {SharedMemory} from '../../core/serivces/commons/utils/shared.memory';
import {Contact} from '../../core/entities/Contact';
import {MessagingService} from '../../core/serivces/messaging/messaging.service';
import {ObsererService} from '../../core/serivces/commons/utils/obserer.service';
import {MessageDao} from '../../core/dao/message.dao';
import {ChatService} from '../../core/serivces/chat/chat.service';
import {Message} from '../../core/entities/Message';
import {ChatBubble} from '../../core/dto/ChatBubble';
import {IonContent} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements OnInit {

    chatBubbles: any[];
    myPeerId;
    messages: Message [];
    showEmojiMenu = false;
    sharedMemory: SharedMemory;
    currentContact: Contact;
    messageToSend;
    test: any;
    observerService: ObsererService;

    @ViewChild('content', {static: true}) private content: IonContent;
    constructor(private messagingService: MessagingService,
                private messageDao: MessageDao,
                private chatService: ChatService,
                private router: Router,
                private zone: NgZone) {
        this.sharedMemory = SharedMemory.getInstance();
        this.observerService = ObsererService.getInstance();
    }

    ngOnInit() {
        this.chatBubbles = [];
        this.messages = [];
        this.currentContact = this.sharedMemory.getCurrentContact();
        this.messageToSend = '';
        this.listenForMessage();



    }

    ionViewWillEnter() {
        this.currentContact = this.sharedMemory.getCurrentContact();
        this.findAllContactMessages(this.currentContact.id);
    }

    sendMessage() {



        this.messagingService.sendMessageTo(this.currentContact.peerId, this.messageToSend)
            .then(message => {
                this.messages.push(message);
                this.messageToSend = '';
                this.updateChatBubbles(message);
                this.scrollToBottom();
                console.log('done');
            })
            .catch(error => {
                console.log(error.toString());
            });
    }



    listenForMessage() {


        this.chatService.newMessagesObserver().subscribe(message => {

            this.zone.run(() => {
                this.messages.push(message);
                this.updateChatBubbles(message);
                this.scrollToBottom();
            });
        });


    }



    findAllContactMessages(contactId: number) {

        this.chatService.findAllMessagesWithContact(contactId)
            .then(messages => {
                this.messages = messages;
                this.initChatBubbles();
                this.scrollToBottom();
            })
    }

    initChatBubbles() {

        const _chatBubbles = this.messages.map(message => {
            const chatBubble = new ChatBubble();
            chatBubble.content = message.content;
            chatBubble.order = '';
            chatBubble.owner = message.sent ? 'sender': 'recipient';
            chatBubble.timestamp = message.createdAt;
            return chatBubble;
        }).sort((a, b) => {return Number(a.timestamp.getTime()) - Number(b.timestamp.getTime())} );
        for(let i = 0; i < _chatBubbles.length; i++) {

            if(i+1 < _chatBubbles.length && _chatBubbles[i].owner !== _chatBubbles[i+1].owner) {
                _chatBubbles[i].order = (i > 0 && _chatBubbles[i-1].owner === _chatBubbles[i].owner) ? 'last': '';
            } else {
                if(i+1 === _chatBubbles.length ) {
                    _chatBubbles[i].order = i > 0 && _chatBubbles[i-1].owner === _chatBubbles[i].owner ? 'last': '';
                } else {
                    _chatBubbles[i].order = (i > 0 && _chatBubbles[i-1].owner === _chatBubbles[i].owner) ? 'middle': 'first';
                }

            }
        }

        this.chatBubbles = _chatBubbles;
        console.log(_chatBubbles)
    }

    updateChatBubbles(message: Message) {

        if(this.chatBubbles.length) {
            const chatBubble = new ChatBubble();
            chatBubble.timestamp = message.createdAt;
            chatBubble.content = message.content;
            chatBubble.order = '';
            chatBubble.owner = message.sent ? 'sender': 'recipient';
            const lastChatBubble = this.chatBubbles[this.chatBubbles.length - 1];
            if(lastChatBubble.owner === chatBubble.owner) {
                chatBubble.order = 'last';
                lastChatBubble.order = lastChatBubble.order === 'last' ? 'middle': 'first';
            }
            this.chatBubbles.push(chatBubble);

        } else {
            this.initChatBubbles();
        }

    }
    voiceCall() {
        console.log('Calling..')
        this.router.navigate(['/tabs/call']);
    }

    scrollToBottom() {
        this.content.scrollToBottom(200);
    }
}
