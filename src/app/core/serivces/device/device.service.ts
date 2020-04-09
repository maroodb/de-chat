import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {STORAGE_KEYS} from '../commons/constants/STORAGE_KEYS';

@Injectable({
    providedIn: 'root'
})
export class DeviceService {

    constructor(private storage: Storage){}

    public getDeviceId(): Promise<any> {

        return new Promise<any>((resolve, reject) => {

            this.storage.get(STORAGE_KEYS.DEVICE_UID)
                .then(deviceId => {
                    if(deviceId) {
                        resolve(deviceId)
                    } else {
                        const newDeviceId = `DC-${this.makeid(5)}`;
                        this.storage.set(STORAGE_KEYS.DEVICE_UID, newDeviceId)
                            .then(done => {
                                resolve(newDeviceId)
                            })
                            .catch(reject)
                    }
                })
                .catch(reject)
        });

   }

   private makeid(length) {
       let result           = '';
       const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
       const charactersLength = characters.length;
       for ( let i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       return result;
   }
}