import {Injectable} from '@angular/core';
import {Message} from '../models/Message';
import {Storage} from '@ionic/storage';

@Injectable({
    providedIn: 'root'
})
export class MessageDao {

    constructor(private storage: Storage){}

    public addMessage(message: Message) {

    }
}