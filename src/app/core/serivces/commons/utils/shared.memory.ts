import {Contact} from '../../../entities/Contact';

export class SharedMemory {

    private static instance: SharedMemory;
    public data: Map<string, any>;

    private constructor() {
        this.data = new Map<string, any>();
    }


    public static getInstance(): SharedMemory {
        if (!SharedMemory.instance) {
            SharedMemory.instance = new SharedMemory();
        }

        return SharedMemory.instance;
    }

    putCurrentContact(contact: Contact) {
        this.data.set('CC', contact);
    }
    getCurrentContact(): Contact {
        return this.data.get('CC') || new Contact();
    }

    putCallIncome(contact: Contact) {
        this.data.set('CALL', contact);
    }
    getCallIncome() {
        return this.data.get('CALL');
    }
}