import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor() { }

  randomSetTimeValue(min: number, max: number) {
    // let randomN:number = Math.floor(Math.random() * (max - min)) + min;
    return (Math.floor(Math.random() * (max - min)) + min) * 1000;
  }

}
