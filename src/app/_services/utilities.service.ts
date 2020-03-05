import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor() { }

  /*
* @author: Josue Rodriguez <josue@Fiducia.com.mx>
* @inputs: min: number, max: number
* @output: number
* @description: Retorna un numero random generando un rango entre los parametros
* de entrada (min, max) para ser convertido a milisegusdos (*1000).
* */
  randomSetTimeValue(min: number, max: number) {
    // let randomN:number = Math.floor(Math.random() * (max - min)) + min;
    return (Math.floor(Math.random() * (max - min)) + min) * 1000;
  }

}
