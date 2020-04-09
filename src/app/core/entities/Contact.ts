import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Message} from './Message';

@Entity('contact')
export class Contact {

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    peerId: string;
    @Column()
    name: string;
    @Column({nullable: true})
    publicKey: string;
    @Column()
    avatar: string;

    @OneToMany(type => Message, message => message.sender)
    sentMessages: Message[];

    @OneToMany(type => Message, message => message.sender)
    receivedMessages: Message[]
}