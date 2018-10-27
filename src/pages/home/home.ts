import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { primeNbrContainer} from './primeNbrContainer';
import {RoundProgressEase} from 'round-progress.ease';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  current: number = 27;
  max: number = 50;
  stroke: number = 15;
  radius: number = 125;
  semicircle: boolean = false;
  rounded: boolean = false;
  responsive: boolean = false;
  clockwise: boolean = true;
  color: string = '#45ccce';
  background: string = '#eaeaea';
  duration: number = 800;
  animation: string = 'easeOutCubic';
  animationDelay: number = 0;
  animations: string[] = [];
  gradient: boolean = false;
  realCurrent: number = 0;

  calculation: string = "2017-17";
  subtractors: number[] = [7,13];
  randomBigPrimeNbr: number = 15;
  bigPrimeNumbers: number[] = primeNbrContainer.getBigPrimeNbrs();
  input: number = 0;
  subtractor: number = 0;

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

  }
  refresh()
  {
  }

  private updateCalculationDisplay(randomBigPrimeNbr: number, subtractor: number) {
    this.calculation = randomBigPrimeNbr + " - " + subtractor;

  }
}
