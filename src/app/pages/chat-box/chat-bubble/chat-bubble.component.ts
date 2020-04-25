import {Component, Input, OnInit} from '@angular/core';
import {MessageDTO} from '../../../core/dto/MessageDTO';

@Component({
  selector: 'app-chat-bubble',
  templateUrl: './chat-bubble.component.html',
  styleUrls: ['./chat-bubble.component.scss'],
})
export class ChatBubbleComponent implements OnInit {

  @Input() messages: MessageDTO [];

  bubbledMessages: any [];

  constructor() { }

  ngOnInit() {



  }

}
