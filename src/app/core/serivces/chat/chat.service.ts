import {Injectable} from '@angular/core';
import {ContactDao} from '../../dao/contact.dao';
import {MessageDao} from '../../dao/message.dao';
import {Contact} from '../../entities/Contact';

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    constructor(private contactDao: ContactDao,
                private messageDao: MessageDao) {

    }

    addContact(contact: Contact): Promise<any> {
        return this.contactDao.addContact(contact);
    }

    findAllContacts(): Promise<Contact []> {
        return this.contactDao.findAll();
    }
}