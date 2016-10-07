import { Pipe, PipeTransform } from '@angular/core';
import moment from "moment";


@Pipe({name: 'momentToString'})
export class MomentToString implements PipeTransform {
  transform(value:any):string {
    return  moment.utc(value).format("MMMM Do YYYY");
  }
}
