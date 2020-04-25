import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Contact} from './Contact';

@Entity('message')
export class Message {

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    content: string;
    @Column({default: false})
    seen: boolean;
    @Column({nullable: true})
    sent: boolean;

    @CreateDateColumn()
    createdAt: Date;
    @ManyToOne(type => Contact, contact => contact.messages)
    contact: Contact;
}