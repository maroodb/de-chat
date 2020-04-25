import {Component, OnInit} from '@angular/core';
import {CallService} from '../../core/serivces/messaging/call.service';
import {Contact} from '../../core/entities/Contact';
import {SharedMemory} from '../../core/serivces/commons/utils/shared.memory';

@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.scss'],
})
export class CallComponent implements OnInit {

    currentContact: Contact;
    sharedMemory: SharedMemory;
    inStream;
    outStream;

    activeCall = false;

  constructor(private callService: CallService) {
      this.sharedMemory = SharedMemory.getInstance();
  }

  ngOnInit() {
    this.currentContact = this.sharedMemory.getCurrentContact();
    const incomeCall = this.sharedMemory.getCallIncome();

    if(incomeCall) {
        this.currentContact = this.sharedMemory.getCallIncome();
    } else {
        this.initCallMedia(this.currentContact.peerId);
    }
    //this.initCallMedia(this.currentContact.peerId);
  }

  initCallMedia(peerId: string) {

    this.getAudioStream()
        .then(audioStream => {
          this.outStream = audioStream;
          this.activeCall = true;
          this.callService.call(peerId, audioStream)
              .then(incomeStream => {
                  this.inStream = incomeStream;
                  console.log('call start')
              })
        })
  }

    ionViewWillEnter() {
        this.activeCall = false;
        this.currentContact = this.sharedMemory.getCurrentContact();
        const incomeCall = this.sharedMemory.getCallIncome();

        if(incomeCall) {
            this.currentContact = this.sharedMemory.getCallIncome();
        } else if(this.currentContact.peerId) {
            this.initCallMedia(this.currentContact.peerId);
        }
    }


  private getAudioStream(): Promise<any> {

     return new Promise<any>((resolve, reject) => {
         const getUserMedia = (navigator.getUserMedia).bind(navigator);
         getUserMedia({video: false, audio: true}, function(stream) {

             console.log("audio stream done");
             resolve(stream)
         }, function(err) {
             console.log('Failed to get local stream' ,err);
             reject(err)
         });
     })
  }

  hangCall() {
      this.activeCall = false;
      this.outStream.getTracks().forEach(track => track.stop());
  }

  refuseCall() {

  }

    answerCall() {
      this.activeCall = true;
      this.getAudioStream()
          .then(outStream => {
              this.outStream = outStream;
              this.callService.answerCall(this.currentContact.peerId, outStream)
                  .then(incomeStream => {
                     this.inStream = incomeStream;
                  })
          })
  }
}
