import {Ion, Platform, AlertController , NavController} from 'ionic-angular';
import { primeNbrContainer} from './primeNbrContainer';
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/timer'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/take'
import {Howl, Howler} from 'howler';
import {Component, Input, ViewChild} from '@angular/core';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  classVariable: string = '';

  // parts needed for the countdown timer
  maxTimeLimit: number = 20;
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
  additionalSubtractors: number[] = [11,17,19,23,29];
  randomBigPrimeNbr: number = 15;
  bigPrimeNumbers: number[] = primeNbrContainer.getBigPrimeNbrs();
  input: string = "";

  @ViewChild('inputField') myInput ;
  subtractor: number = 0;

  totalTimer;
  totalTimeCounter = 20;
  started = false;

  countDown;
  tick = 1000;
  counter = 5;
  consecutiveCorrectAnswerCounter = 0;
  nbrOfPoints: number;


  getRandomNbr(list: number[]) {
    return list[Math.floor(Math.random() * list.length)];
  }

  constructor(public navCtrl: NavController, private alertCtrl: AlertController, platform: Platform) {
    this.randomBigPrimeNbr = this.getRandomNbr(this.bigPrimeNumbers);
    this.subtractor = this.getRandomNbr(this.subtractors);
    this.updateCalculationDisplay(this.randomBigPrimeNbr, this.subtractor);
    this.input = "";
    this.consecutiveCorrectAnswerCounter = 0;
    this.nbrOfPoints = 0;


  }


  timerTick() {
    this.totalTimer = setTimeout(() =>
    {
      this.totalTimeCounter--;
      if (this.totalTimeCounter <= 0) {
        this.presentAlert();
        return;
      } else if (this.totalTimeCounter > 0) {
        this.timerTick();
      }

    }, 1000);

  }
  updateCalc() {

   if (this.myInput._value.length <4) {
     return;
   }

    let wasInputRight: boolean;
    wasInputRight =  (parseInt(this.input) == (this.randomBigPrimeNbr - this.subtractor));
    if ( wasInputRight) {
      this.nbrOfPoints++;
      this.consecutiveCorrectAnswerCounter ++;
      if ( this.consecutiveCorrectAnswerCounter >= 4) {
        this.consecutiveCorrectAnswerCounter = 0;
        this.subtractor = this.getRandomNbr(this.additionalSubtractors);
      }
      this.randomBigPrimeNbr = this.randomBigPrimeNbr - this.subtractor;
      //this.subtractor = this.getRandomNbr(this.subtractors);
      this.updateCalculationDisplay(this.randomBigPrimeNbr, this.subtractor)
      // Decrease available answerTime
      -- this.availableAnswerTime;
    } else {
      this.wrongAnswerRoutine();

    }

    if ( this.started == false) {
      this.started = true;
      this.timerTick();
    }

    this.counterRoutine();

    this.myInput.setFocus();
  }

  private updateCalculationDisplay(randomBigPrimeNbr: number, subtractor: number) {
    this.calculation = randomBigPrimeNbr + " - " + subtractor + " = ";

  }

  private wrongAnswerRoutine() {
    this.classVariable = 'animated shake';

    let sound = new Howl({
      src: ['http://localhost:8100/assets/wrong.mp3']
    });

    sound.play();

    // increase available answer time and restart
    if ( this.availableAnswerTime < this.maxTimeLimit) {
      this.availableAnswerTime = this.availableAnswerTime +1;

    }
    this.randomBigPrimeNbr = this.getRandomNbr(this.bigPrimeNumbers);
    this.updateCalculationDisplay(this.randomBigPrimeNbr, this.subtractor)
    this.counter = this.availableAnswerTime;
    this.changeColor=true;
    this.counterRoutine();

  }


  ionViewDidLoad() {
    setTimeout(() => {
      this.myInput.setFocus();
    },150);

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
            this.classVariable = '';

          }
          if ( this.counter <= 0) {
            // timer is over trigger answer false routine
            return this.wrongAnswerRoutine();
          }
          return  this.current = this.counter;
        }
      )
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Done',
      subTitle: 'You are finished!, you reached '+ this.nbrOfPoints,
      buttons: ['Dismiss']
    });
    this.countDown = null;
    alert.present();
  }
}
