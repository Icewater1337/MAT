import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { primeNbrContainer} from './primeNbrContainer';
import {RoundProgressEase} from 'round-progress.ease';
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/timer'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/take'
import { Pipe, PipeTransform } from '@angular/core';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  current: number = 5;
  max: number = 5;
  stroke: number = 15;
  radius: number = 125;
  semicircle: boolean = false;
  rounded: boolean = false;
  responsive: boolean = false;
  clockwise: boolean = true;
  color: string = '#ce1609';
  background: string = '#eaeaea';
  duration: number = 800;


  calculation: string = "2017-17";
  subtractors: number[] = [7,13];
  randomBigPrimeNbr: number = 15;
  bigPrimeNumbers: number[] = primeNbrContainer.getBigPrimeNbrs();
  input: number = 0;
  subtractor: number = 0;

  countDown;
  counter = 5;
  tick = 1000;


  getRandomNbr(list: number[]) {
    return list[Math.floor(Math.random() * list.length)];
  }

  constructor(public navCtrl: NavController) {
    this.randomBigPrimeNbr = this.getRandomNbr(this.bigPrimeNumbers);
    this.subtractor = this.getRandomNbr(this.subtractors);
    this.updateCalculationDisplay(this.randomBigPrimeNbr, this.subtractor);
  }



  updateCalc() {
    if ( parseInt(this.input) == this.randomBigPrimeNbr - this.subtractor) {
      this.randomBigPrimeNbr = this.randomBigPrimeNbr - this.subtractor;
      this.subtractor = this.getRandomNbr(this.subtractors);
      this.updateCalculationDisplay(this.randomBigPrimeNbr, this.subtractor)
    }
    this.input = null;

    this.countDown = Observable.timer(0, this.tick)
      .take(this.counter)
      .map(() => {
      this.current = this.counter;
        return --this.counter;
      }
    )

  }


  refresh()
  {
  }

  private updateCalculationDisplay(randomBigPrimeNbr: number, subtractor: number) {
    this.calculation = randomBigPrimeNbr + " - " + subtractor;

  }

}
