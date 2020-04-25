import {Injectable} from '@angular/core';
import {WebRtcService} from '../network/web.rtc.service';
import {ObsererService} from '../commons/utils/obserer.service';
import {SharedMemory} from '../commons/utils/shared.memory';
import {ContactDao} from '../../dao/contact.dao';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class CallService {

    observerService: ObsererService;
    sharedMemory: SharedMemory;
    constructor(private webRtcService: WebRtcService,
                private router: Router,
                private contactDao: ContactDao){
        this.sharedMemory = SharedMemory.getInstance();
        this.observerService = ObsererService.getInstance();


    }
    public call(peerId: string, stream: any): Promise<any> {

        return this.webRtcService.call(peerId, stream)
    }


    public answerCall(peerId: string, stream: any): Promise<any> {

        return this.webRtcService.answerCall(peerId, stream);
    }

    public startListeningForCall() {
        this.observerService.callSubject.subscribe((peerId) => {
            this.contactDao.findByPeerId(peerId)
                .then(contact => {
                    this.sharedMemory.putCallIncome(contact);
                    console.log(contact);
                    this.router.navigate(['/tabs/call'])
                })
        })
    }
}