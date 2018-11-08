import { Platform, AlertController , NavController} from 'ionic-angular';
import { primeNbrContainer} from './primeNbrContainer';
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/timer'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/take'
import {Howl, Howler} from 'howler';
import {Component,  ViewChild} from '@angular/core';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  // Variables: Adjust as needed.
  // The default subtrahends
  subtrahends: number[] = [7,13];
  //After 4 correct answers are given, one of the folowing is selected as the new subtrahend
  additionalSubtrahends: number[] = [11,17,19,23,29];
  // Initial time that is available for each answer
  availableAnswerTime: number = 5;
  // Maximum available time for one answer
  maxTimeLimit: number = 20;
  // Points to reach until it stops
  pointLimit: number = 70;
  // Time to reach until it stops
  totalTimeCounter = 600;
  // Shake the screen on wrong answer or not
  useShake: boolean = true;
  // use sound on wrong answer or not
  useSound: boolean = false;
  // use red screen on wrong answer or not
  useRedScreen: boolean = true;

  // DO not touch the following
  classVariable: string = '';

  // parts needed for the countdown timer

  current: number = 5;
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
  calculation: string = "";

  randomBigPrimeNbr: number = 15;
  bigPrimeNumbers: number[] = primeNbrContainer.getBigPrimeNbrs();
  input: string = "";

  @ViewChild('inputField') myInput ;
  subtrahend: number = 0;
  totalTimer;
  started = false;
  countDown;
  tick = 1000;
  counter = 5;
  consecutiveCorrectAnswerCounter = 0;
  rightAnswerCounter: number;
  nbrOfPoints: number;
  firstAnswer: boolean;


  getRandomNbr(list: number[]) {
    return list[Math.floor(Math.random() * list.length)];
  }

  constructor(public navCtrl: NavController, private alertCtrl: AlertController, platform: Platform) {
    this.randomBigPrimeNbr = this.getRandomNbr(this.bigPrimeNumbers);
    this.subtrahend = this.getRandomNbr(this.subtrahends);
    this.buildCalculationString(this.randomBigPrimeNbr, this.subtrahend);
    this.input = "";
    this.consecutiveCorrectAnswerCounter = 0;
    this.rightAnswerCounter = 0;
    this.nbrOfPoints = 0;


  }


  timerTick() {
    this.totalTimer = setTimeout(() =>
    {
      this.totalTimeCounter--;
      if (this.totalTimeCounter <= 0) {
        this.playerDoneAlert();
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
    wasInputRight =  (parseInt(this.input) == (this.randomBigPrimeNbr - this.subtrahend));
    if ( wasInputRight) {
      // add more points for consecutive correct answers
      this.rightAnswerCounter++;
      this.consecutiveCorrectAnswerCounter ++;
      this.nbrOfPoints = this.nbrOfPoints + this.consecutiveCorrectAnswerCounter;

      this.randomBigPrimeNbr = this.randomBigPrimeNbr - this.subtrahend;


      // Add random event if 4 or more correct answers are given consecutively
      if ( (this.rightAnswerCounter % 4) == 0) {
        this.subtrahend = this.getRandomNbr(this.additionalSubtrahends);
      }

      this.buildCalculationString(this.randomBigPrimeNbr, this.subtrahend)
      // Decrease available answerTime
      if ( this.started) {
        -- this.availableAnswerTime;
      }
      this.firstAnswer = false;

    } else {
       this.wrongAnswerRoutine();

    }
    // Check if points are reached to stop.
    if ( this.nbrOfPoints >= this.pointLimit) {
      this.playerDoneAlert();
    }
    if ( !this.started ) {
      this.started = true;
      this.timerTick();
    }

    this.counterRoutine();

    this.myInput.setFocus();
  }

  private buildCalculationString(randomBigPrimeNbr: number, subtrahend: number) {
    this.calculation = randomBigPrimeNbr + " - " + subtrahend + " = ";

  }

  private wrongAnswerRoutine() {
    this.consecutiveCorrectAnswerCounter = 0;
    if ( this.nbrOfPoints > 0) {
      this.nbrOfPoints--;

    }
    if ( this.useShake) {
      this.classVariable = 'animated shake';
    }

    if ( this.useSound) {
      let sound = new Howl({
        src: ['http://localhost:8100/assets/wrong.mp3']
      });

      sound.play();
    }

    // increase available answer time and restart
    if ( this.availableAnswerTime < this.maxTimeLimit) {
      this.availableAnswerTime = this.availableAnswerTime +1;

    }
    this.randomBigPrimeNbr = this.getRandomNbr(this.bigPrimeNumbers);
    this.buildCalculationString(this.randomBigPrimeNbr, this.subtrahend)
    if (this.useRedScreen) {
      this.changeColor=true;

    }
    this.counterRoutine();

  }


  ionViewDidLoad() {
    setTimeout(() => {
      this.myInput.setFocus();
      this.firstAnswer = true;
    },150);

  }

  private counterRoutine() {
    this.counter = this.availableAnswerTime;

    this.input = "";
    this.countDown = Observable.timer(0, this.tick)
      .take(this.counter)
      .map(() => {
          --this.counter;
          if ( this.useRedScreen && (this.counter <= this.availableAnswerTime -2) ) {
              this.changeColor=false;
            if ( this.useShake) {
              this.classVariable = '';
            }
          }
          if ( this.counter <= 0) {
            // timer is over trigger answer false routine
            return this.wrongAnswerRoutine();
          }
          return  this.current = this.counter;
        }
      )
  }

  playerDoneAlert() {
    let alert = this.alertCtrl.create({
      title: 'Done',
      subTitle: 'You are finished!, you reached '+ this.nbrOfPoints,
      buttons: ['Dismiss']
    });
    this.countDown = null;
    alert.present();
  }
}
