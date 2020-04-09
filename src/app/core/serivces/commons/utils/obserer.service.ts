import {Subject} from "rxjs";

export class ObsererService {

    private static instance: ObsererService;
    public subject: any;

    private constructor() {
        this.subject =  new Subject();
    }


    public static getInstance(): ObsererService {
        if (!ObsererService.instance) {
            ObsererService.instance = new ObsererService();
        }

        return ObsererService.instance;
    }

    public pushMessage(data) {
        this.subject.next(data);
    }


}