import {Injectable, NgZone} from '@angular/core';
import {ContactDao} from '../../dao/contact.dao';
import {MessageDao} from '../../dao/message.dao';
import {Contact} from '../../entities/Contact';
import {Message} from '../../entities/Message';
import { Base64 } from 'js-base64';
import {ObsererService} from '../commons/utils/obserer.service';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    observerService: ObsererService;
    constructor(private contactDao: ContactDao,
                private _zone: NgZone,
                private messageDao: MessageDao) {

        this.observerService = ObsererService.getInstance();
    }

    addContact(contact: Contact): Promise<any> {
        return this.contactDao.addContact(contact);
    }

    findAllContacts(): Promise<Contact []> {
        return this.contactDao.findAll();
    }

    findAllMessagesWithContact(id: number): Promise<Message[]> {

         return new Promise<Message[]>((resolve, reject) => {
             this.messageDao.findMessageWithContact(id)
                 .then(messages => {
                     messages.forEach(m => m.content = Base64.decode(m.content));
                     resolve(messages);
                 })
                 .catch(reject)
         });


    }

    newMessagesObserver(): Observable<any> {
        return new Observable(observer => {

            this.observerService.subject.subscribe((data) => {
                const message = new Message();
                message.sent = false;
                message.seen = true;
                message.content = data.content;
                this.addIncomingMessage(message, data.peerId)
                    .then(createdMessage => {
                        this._zone.run(() => {
                            createdMessage.content = Base64.decode(createdMessage.content);
                            observer.next(createdMessage);
                        })
                    })
                    .catch(error => {
                        this._zone.run(() => {
                            observer.error(error);
                        })
                    })
            });

        })
    }

    public addMessageToPeer(content: string, peerId: string): Promise<Message> {

        return new Promise<any>((resolve, reject) => {
            this.contactDao.findContactByPeerId(peerId)
                .then(contact => {
                    if(contact) {
                        const message = new Message();
                        message.contact = contact;
                        message.content = content;
                        message.seen = true;
                        message.sent = true;
                        this.messageDao.save(message)
                            .then((message) => {
                                if(message) {
                                    message.content = Base64.decode(message.content);
                                }
                                resolve(message)
                            })
                            .catch(reject)
                    }
                })
                .catch(reject)
        })
    }

    public addIncomingMessage(message: Message, peerId: string): Promise<Message> {

        return new Promise<any>((resolve, reject) => {
            this.contactDao.findContactByPeerId(peerId)
                .then(contact => {
                    if(contact) {
                        message.contact = contact;
                        this.messageDao.save(message)
                            .then(resolve)
                            .catch(reject)
                    }
                })
                .catch(reject)
        })

    }
}