import {Injectable} from '@angular/core';
import {ToastController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    constructor(private toastController: ToastController){

    }

    async showErrorMessage(msg: string) {
        const toast = await this.toastController.create({

            message: msg,
         //   color: 'danger',
            duration: 2000,
            mode: 'md',
            buttons: [
                {
                    text: 'Fermer',
                    role: 'cancel',
                    handler: () => {
                        toast.dismiss();
                    }
                }
            ]

        });
        toast.present();
    }

    async showSuccessMessage(msg: string) {
        const toast = await this.toastController.create({

            message: msg,
            color: 'success',
            duration: 2000,
            mode: 'md',
            buttons: [
                {
                    text: 'Fermer',
                    role: 'cancel',
                    handler: () => {
                        toast.dismiss();
                    }
                }
            ]

        });
        toast.present();
    }
}