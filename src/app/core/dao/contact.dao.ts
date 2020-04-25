import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Contact} from '../entities/Contact';
import {STORAGE_KEYS} from '../serivces/commons/constants/STORAGE_KEYS';
import {getRepository, Repository} from 'typeorm';
import {Message} from '../entities/Message';

@Injectable({
    providedIn: 'root'
})
export class ContactDao {

    contactRepository: Repository<Contact>;
    constructor(private storage: Storage) {
        this.contactRepository = getRepository('contact') as Repository<Contact>;
    }

    addContact(contact: Contact): Promise<any> {

        return new Promise<any>((resolve, reject) => {

            this.contactRepository.find({where: {peerId: contact.peerId}})
                .then(contacts => {
                    if(contacts && contacts.length) {
                        reject(new Error('Peer already exist.'))
                    } else {
                        this.contactRepository.save(contact)
                            .then(resolve)
                            .catch(reject)
                    }
                })
        })
    }

    public findAll(): Promise<Contact[]> {
        return this.contactRepository.find();
    }

    public findContactByPeerId(peerId: string): Promise<Contact> {

        return new Promise<Contact>((resolve, reject) => {
            this.contactRepository.findOne({ peerId: peerId })
                .then(contact => {
                    resolve(contact)
                })
                .catch(reject)
        })
    }

    findAllContacts(): Promise<Contact[]> {

        return new Promise<Contact[]>((resolve, reject) => {

            this.getContactIdList()
                .then(list => {
                    if (list instanceof Array) {
                        const lookForContacts = list.map(peerid => this.findByPeerId(peerid));
                        Promise.all(lookForContacts)
                            .then(values => {
                                resolve(values)
                            })
                            .catch(reject)
                    }
                })
        })
    }

    public findByPeerId(peerId: string): Promise<Contact> {
        return new Promise<Contact>((resolve, reject) => {
            this.storage.get(peerId)
                .then(contact => {
                    resolve(contact);
                })
                .catch(reject)
        })
    }
    private getContactIdList(): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            this.storage.get(STORAGE_KEYS.CONTACT_LIST)
                .then(list => {
                    resolve(list);

                })
                .catch(reject)
        })
    }
    private insertContactKey(key: string): Promise<any> {

        return new Promise<any>((resolve, reject) => {

            this.storage.get(STORAGE_KEYS.CONTACT_LIST)
                .then(list => {
                    let contactList;
                    if(list instanceof Array) {
                        list.push(key);
                        contactList = list
                    } else {
                        contactList = [key];
                    }

                    this.storage.set(STORAGE_KEYS.CONTACT_LIST, contactList)
                        .then(resolve)
                        .catch(reject)
                })
                .catch(error => {

                });


        })
    }
}