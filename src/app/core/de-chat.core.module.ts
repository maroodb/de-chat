import {NgModule, Optional, SkipSelf} from '@angular/core';
import {WebRtcService} from './serivces/network/web.rtc.service';
import {CommonModule} from '@angular/common';
import {MessagingService} from './serivces/messaging/messaging.service';
import {DeviceService} from './serivces/device/device.service';
import {SpinnerService} from './serivces/commons/layout/spinner.service';
import {ToastService} from './serivces/commons/layout/toast.service';
import {ContactDao} from './dao/contact.dao';
import {DbConnectionService} from './connection/db.connection.service';
import {MessageDao} from './dao/message.dao';
import {ChatService} from './serivces/chat/chat.service';
import {CallService} from './serivces/messaging/call.service';


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
    ],
    providers: [
        DbConnectionService,
        WebRtcService,
        MessagingService,
        DeviceService,
        SpinnerService,
        ToastService,
        ChatService,
        CallService,


        ContactDao,
        MessageDao
    ]
})
export class DeChatCoreModule {
    constructor(@Optional() @SkipSelf() parentModule: DeChatCoreModule) {
        if (parentModule) {
            throw new Error('You should import core module only in the root module');
        }
    }
}