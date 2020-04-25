import {IonicModule} from '@ionic/angular';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {TabsPageRoutingModule} from './tabs-routing.module';

import {TabsPage} from './tabs.page';
import {ContactsComponent} from '../contacts/contacts.component';
import {InboxComponent} from '../inbox/inbox.component';
import {ChatBoxComponent} from '../chat-box/chat-box.component';
import {HomeComponent} from '../home/home.component';
import {QRCodeModule} from 'angularx-qrcode';
import {CallComponent} from '../call/call.component';
import {ChatBubbleComponent} from '../chat-box/chat-bubble/chat-bubble.component';
import {MaterialModule} from '../../material.module';

@NgModule({
    entryComponents: [ChatBubbleComponent],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        MaterialModule,
        QRCodeModule,
        TabsPageRoutingModule,

    ],
    declarations: [TabsPage,
        ContactsComponent,
        InboxComponent,
        ChatBoxComponent,
        CallComponent,
        ChatBubbleComponent,
        HomeComponent],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class TabsPageModule {
}
