import moment from "moment";

import {Day}from "../models/day";


export class DateUtils {
  DAY:string = "day";


  public dateFromDay:Function = function (day:Day) {
    if (!day) {
      return null;
    }
    try {
      var obj = {year: day.year, month: day.month, day: day.dayOfMonth};
      return moment.utc(obj);
    }
    catch (err) {
      return null;
    }
  };


//month is passed with january as 1. we decrement internally
  public dateFromDayMonthYear:Function = function (day, month, year) {
    if (!day || (!month && month != 0) || !year) {
      return null;
    }
    try {
      var obj = {year: year, month: month - 1, day: day};
      return moment.utc(obj);
    }
    catch (err) {
      return null;
    }
  };
//date in ms: 1472586908000
  public dateFromMS:Function = function (/*Number*/ dateInMs, /* {startOfDay:true|false,endOfDay:true|false} */options) {
    if (!dateInMs) {
      return null;
    }
    var date = moment.utc(dateInMs);
    if (options) {
      if (options.startOfDay) {
        date.minute(0);
        date.second(0);
        date.hour(0);
        date.millisecond(0);
      }
      else if (options.endOfDay) {
        date.minute(59);
        date.second(59);
        date.hour(23);
        date.millisecond(999);
      }
    }
    return date;
  };
  public isDateBeforeToday:Function = function (/* Moment */ date) {
    if (!date) {
      return null;
    }
    return date.isBefore(this.todayUtc(), this.DAY);

  };

  public isDateToday:Function = function (/* Moment */ date) {
    if (!date) {
      return null;
    }

    return date.isSame(this.todayUtc(), this.DAY);

  };
  public isDateAfterToday:Function = function (/* Moment */ date) {
    if (!date) {
      return null;
    }
    return date.isAfter(this.todayUtc(), this.DAY);
  };
  todayStartUtc:Function = function () {
    var date = moment().utc();
    date.minute(0);
    date.second(0);
    date.hour(0);
    date.millisecond(0);
    return date;

  };
  todayUtc:Function = function () {
    return moment().utc();
  };
}
