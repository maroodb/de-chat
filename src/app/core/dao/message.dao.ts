import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Message} from '../entities/Message';
import {getRepository, Repository} from 'typeorm';

@Injectable({
    providedIn: 'root'
})
export class MessageDao {

    messageRepository: Repository<Message>;
    constructor(private storage: Storage){
        this.messageRepository = getRepository('message') as Repository<Message>;
    }

    public addMessage(conetent: string): Promise<any> {
        const msg = new Message();
        msg.content = conetent;
        return this.messageRepository.save(msg);
    }

    findAll(): Promise<Message[]> {
        return this.messageRepository.find();
    }
}