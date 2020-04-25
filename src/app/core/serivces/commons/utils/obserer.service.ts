import {Subject} from "rxjs";
import {MessageDTO} from '../../../dto/MessageDTO';

export class ObsererService {

    private static instance: ObsererService;
    public subject: any;
    public callSubject: any;

    private constructor() {
        this.subject =  new Subject();
        this.callSubject = new Subject();
    }


    public static getInstance(): ObsererService {
        if (!ObsererService.instance) {
            ObsererService.instance = new ObsererService();
        }

        return ObsererService.instance;
    }

    public pushMessage(messageDTO: MessageDTO ) {
        this.subject.next(messageDTO);
    }

    public incomeCall(peerId) {
       this.callSubject.next(peerId);
    }


}