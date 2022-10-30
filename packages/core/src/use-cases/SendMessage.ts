import {UseCase} from "./UseCase";
import {Message} from "./Message";

export class SendMessage implements UseCase<string, any> {

    public execute(message: Message): Promise<any> {
        return Promise.resolve(undefined);
    }
}