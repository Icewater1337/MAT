import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  calculation: string = "2017-17";
  myVal1: string = "5";

  refresh()
  {
    this.myVal1 = this.calculation;
  }

}
