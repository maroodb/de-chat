import {Component, OnInit} from '@angular/core';
import {AlertController} from '@ionic/angular';
import {Contact} from '../../core/entities/Contact';
import {ContactDao} from '../../core/dao/contact.dao';
import {ToastService} from '../../core/serivces/commons/layout/toast.service';
import {SharedMemory} from '../../core/serivces/commons/utils/shared.memory';
import {Router} from '@angular/router';
import {ChatService} from '../../core/serivces/chat/chat.service';

@Component({
    selector: 'app-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {

    contacts: Contact[];
    sharedMemory: SharedMemory;
    constructor(private alertCtrl: AlertController,
                private toastService: ToastService,
                private router: Router,
                private chatService: ChatService) {
        this.sharedMemory = SharedMemory.getInstance();
    }

    ngOnInit() {
        this.contacts = [];
        this.getAllContacts();
    }

    chatWith(contact: Contact) {
       this.sharedMemory.putCurrentContact(contact);
       this.router.navigate(['/tabs/chat-box']);

    }

    presentAddContact() {
         this.presentAddContactPrompt();
    }


    async presentAddContactPrompt() {
        const alert = await this.alertCtrl.create({
            header: 'Add Contact',
            inputs: [
                {
                    name: 'contactName',
                    placeholder: 'Choose a name'
                },
                {
                    name: 'peerId',
                    placeholder: 'Enter your contact ID',

                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Add',
                    handler: data => {
                        if(this.isContactValid(data.contactName, data.peerId)) {
                            const contact = new Contact();
                            contact.peerId = data.peerId;
                            contact.name = data.contactName;
                            contact.avatar = this.generateRandomAvatar();
                            this.addContact(contact);

                        } else {
                            return false;
                        }

                    }
                }
            ]
        });

        alert.present();

    }

    public addContact(contact: Contact) {
          this.chatService.addContact(contact)
              .then(done => {
                  this.toastService.showSuccessMessage('Your Contact added successfully!')
                  this.getAllContacts();
              })
              .catch(error => {
                  this.toastService.showErrorMessage(error.toString())
              })
    }

    private isContactValid(contactName, id) {
        return contactName && contactName.length > 0 && id && id.length > 0;
    }
    private generateRandomAvatar(): string {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    public getAllContacts() {
        this.chatService.findAllContacts()
            .then(contacts => {
                this.contacts = contacts;
                console.log(contacts)
            })
    }
}
