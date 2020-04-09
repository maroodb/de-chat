import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Contact} from './Contact';

@Entity('message')
export class Message {

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    content: string;
    @Column({default: false})
    seen: boolean;

    @ManyToOne(type => Contact, sender => sender.sentMessages)
    sender: Contact;

    @ManyToOne(type => Contact, sender => sender.receivedMessages)
    receiver: Contact;

}