import { Component } from '@angular/core';
import {Ion, NavController} from 'ionic-angular';
import { primeNbrContainer} from './primeNbrContainer';
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/timer'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/take'
import {Howl, Howler} from 'howler';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  // parts needed for the countdown timer
  current: number = 5;
  availableAnswerTime: number = 5;
  stroke: number = 15;
  radius: number = 125;
  semicircle: boolean = false;
  rounded: boolean = false;
  responsive: boolean = false;
  clockwise: boolean = true;
  color: string = '#ce1609';
  background: string = '#eaeaea';
  duration: number = 1000;

  changeColor: boolean = false;
  calculation: string = "2017-17";
  subtractors: number[] = [7,13];
  randomBigPrimeNbr: number = 15;
  bigPrimeNumbers: number[] = primeNbrContainer.getBigPrimeNbrs();
  input: String = "";
  subtractor: number = 0;

  countDown;
  tick = 1000;
  counter = 5;


  getRandomNbr(list: number[]) {
    return list[Math.floor(Math.random() * list.length)];
  }

  constructor(public navCtrl: NavController) {
    this.randomBigPrimeNbr = this.getRandomNbr(this.bigPrimeNumbers);
    this.subtractor = this.getRandomNbr(this.subtractors);
    this.updateCalculationDisplay(this.randomBigPrimeNbr, this.subtractor);
    this.input = "";

  }



  updateCalc() {
    let wasInputRight: boolean;
    wasInputRight =  (parseInt(this.input) == (this.randomBigPrimeNbr - this.subtractor));
    if ( wasInputRight) {
      this.randomBigPrimeNbr = this.randomBigPrimeNbr - this.subtractor;
      this.subtractor = this.getRandomNbr(this.subtractors);
      this.updateCalculationDisplay(this.randomBigPrimeNbr, this.subtractor)
      // Decrease available answerTime
      -- this.availableAnswerTime;
    } else {
      this.wrongAnswerRoutine();

    }

    this.counterRoutine();

  }

  private updateCalculationDisplay(randomBigPrimeNbr: number, subtractor: number) {
    this.calculation = randomBigPrimeNbr + " - " + subtractor;

  }

  private wrongAnswerRoutine() {
    let sound = new Howl({
      src: ['http://localhost:8100/assets/wrong.mp3']
    });

    sound.play();


    // increase available answer time and restart
    this.availableAnswerTime = this.availableAnswerTime +3;
    this.randomBigPrimeNbr = this.getRandomNbr(this.bigPrimeNumbers);
    this.updateCalculationDisplay(this.randomBigPrimeNbr, this.subtractor)
    this.counter = this.availableAnswerTime;
    this.changeColor=true;
    this.counterRoutine();

  }



  private counterRoutine() {
    this.counter = this.availableAnswerTime;
    this.input = "";
    this.countDown = Observable.timer(0, this.tick)
      .take(this.counter)
      .map(() => {
          --this.counter;
          if ( this.counter <= this.availableAnswerTime -2 ) {
            this.changeColor=false;

          }
          if ( this.counter <= 0) {
            // timer is over trigger answer false routine
            return this.wrongAnswerRoutine();
          }
          return  this.current = this.counter;
        }
      )
  }
}
