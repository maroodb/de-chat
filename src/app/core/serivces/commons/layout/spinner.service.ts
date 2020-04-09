import {Injectable} from '@angular/core';
import {LoadingController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class SpinnerService {

    waitingLoading;
    constructor(private loadingController: LoadingController) {

        this.waitingLoading = this.loadingController.create({
            spinner: "circles"  ,
            duration: 500000,
            message: 'Patientez SVP ..',
            translucent: true,
            cssClass: 'custom-class custom-loading'
        })
    }

    private createSpinner() {

        return this.loadingController.create({
            spinner: "circles"  ,
            duration: 5000,
            message: 'Patientez SVP ..',
            translucent: true,
            cssClass: 'custom-class custom-loading'
        })
    }

    spinnerOn() {

        this.waitingLoading = this.createSpinner();
        this.waitingLoading.then(loading => loading.present());
    }



    spinnerOff() {

        this.waitingLoading.then(loading => loading.dismiss());

    }
}