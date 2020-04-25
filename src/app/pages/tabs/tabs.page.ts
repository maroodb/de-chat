import { Component } from '@angular/core';
import {CallService} from '../../core/serivces/messaging/call.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private callService: CallService ) {
    this.callService.startListeningForCall();


  }

}
