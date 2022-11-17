import { Component } from '@angular/core';
import {sayHello} from "@dechat/core";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  message: string;
  constructor() {
    this.message = sayHello();
  }

}
