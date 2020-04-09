import {IonicModule} from '@ionic/angular';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {TabsPageRoutingModule} from './tabs-routing.module';

import {TabsPage} from './tabs.page';
import {ContactsComponent} from '../contacts/contacts.component';
import {InboxComponent} from '../inbox/inbox.component';
import {ChatBoxComponent} from '../chat-box/chat-box.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import {HomeComponent} from '../home/home.component';
import {QRCodeModule} from 'angularx-qrcode';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        PickerModule,
        EmojiModule,
        QRCodeModule,
        TabsPageRoutingModule,

    ],
    declarations: [TabsPage, ContactsComponent, InboxComponent, ChatBoxComponent, HomeComponent],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class TabsPageModule {
}
