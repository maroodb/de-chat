import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Message} from '../entities/Message';
import {getRepository, Repository} from 'typeorm';

@Injectable({
    providedIn: 'root'
})
export class MessageDao {

    messageRepository: Repository<Message>;

    constructor(private storage: Storage) {
        this.messageRepository = getRepository('message') as Repository<Message>;
    }

    public save(message: Message): Promise<any> {
        return this.messageRepository.save(message);
    }

    public addMessage(content: string): Promise<Message> {
        const msg = new Message();
        msg.content = content;
        return this.messageRepository.save(msg);
    }


    public findAll(): Promise<Message[]> {
        return this.messageRepository.find();
    }

    public findMessageWithContact(id: number) {

       return this.messageRepository.find({ contact: {id: id }});

    }

    public deleteAll() {
       return this.messageRepository.clear();
    }
}