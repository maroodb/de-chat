import {Component, OnInit} from '@angular/core';
import {DeviceService} from '../../core/serivces/device/device.service';

@Component({
    selector: 'app-inbox',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

    peerId = 'N/A';

    constructor(private deviceService: DeviceService) {
    }

    ngOnInit() {
        this.getPeerID();

    }

    getPeerID() {
        this.deviceService.getDeviceId()
            .then(id => {
                this.peerId = id;
            });
    }


}
