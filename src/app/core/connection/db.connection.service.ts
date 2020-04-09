import {Injectable} from '@angular/core';
import {Platform} from '@ionic/angular';
import {Connection, createConnection, getConnection} from 'typeorm';
import {Message} from '../entities/Message';
import {Contact} from '../entities/Contact';

@Injectable({
    providedIn: 'root'
})
export class DbConnectionService {

    constructor(private platform: Platform) { }


    private createConnection(): Promise<Connection> {

        let dbOptions;

        if(this.platform.is('cordova')) {
            console.log(`Running in Cordova platfrom`);
            dbOptions = {
                type: 'cordova',
                database: '__de_chatDB',
                location: 'default'
            };
        } else {
            console.log(`Running in Browser platfrom`);
            dbOptions = {
                type: "sqljs",
                location: 'browser',
                autoSave: true
            };
        }

        Object.assign(dbOptions, {
            logging: ['error', 'query', 'schema'],
            synchronize: true,
            entities: [
                Message,
                Contact
            ]
        });
        console.log(dbOptions)
        return createConnection(dbOptions);
    }

    public async ready() {
        try {

            await getConnection();

        } catch (ex) {

            console.log('Connection not established!', ex);

            await this.createConnection();

        }
    }
}