import { Pipe, PipeTransform } from '@angular/core';


@Pipe({name: 'objectContainsProperty'})
export class ObjectContainsProperty implements PipeTransform {
  transform(value:Object,args:string):boolean {
    var hasConv =  args && value ? value[args] : false;
    return hasConv;
  }
}
