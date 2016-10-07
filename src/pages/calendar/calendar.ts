import {Component,
  OnInit,
  trigger, state, style, transition, animate
} from '@angular/core';
import {NavController } from 'ionic-angular';
import { CalendarDetailPage } from '../calendar-detail/calendar-detail';
import {DepartmentProvider} from "../../providers/department-provider";
import {PostProvider} from "../../providers/post-provider";




import {Models} from "../../models/models";
import {MonthAndYear} from "../../models/month-and-year";
import {Day} from "../../models/day";
import {CalendarMonth} from "../../models/calendar-month";


import {DateUtils} from "../../utils/date-utils";

import moment from "moment";


@Component({
  selector: "calendar-page",
  templateUrl: 'calendar.html',
  animations: [
    trigger('fade', [
      state('visible', style({
        opacity: 1
      })),
      state('invisible', style({
        opacity: 0
      })),
      transition('visible <=> invisible', animate('1500ms linear'))
    ]),
    trigger('flyInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('outRight', style({
        transform: 'translate3d(105%, 0, 0)'
      })),
      state('outLeft', style({
        transform: 'translate3d(-105%, 0, 0)'
      })),
      transition('in => outLeft', animate('400ms ease-in')),
      transition('in => outRight', animate('400ms ease-in')),
      transition('outLeft => in', animate('400ms ease-out')),
      transition('outRight => in', animate('400ms ease-out'))
    ]),
  ]
})
export class CalendarPage/* implements OnInit, OnDestroy */ {

  calendarStart:any = null;
  calendarMonth:CalendarMonth = new CalendarMonth();
  daysOfWeek:string[] = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  monthLookup:string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  flyInOutState:string = "in";
  fadeState:string = "visible";
  systemMonthAndYear:MonthAndYear;
  systemDayStart:Number;
  currentCalendarMonthAndYear:MonthAndYear;
  postCounts:Object = {};
  totalOn:number = 0;
  totalOff:number = 0;
  department:Models.Department;
  dateUtils:DateUtils = new DateUtils();
  nav:NavController;
  postProvider:PostProvider;

  constructor(nav:NavController, private departmentController:DepartmentProvider, private postProvider:PostProvider) {
    this.nav = nav;
    this.updateCurrentSystemMonthAndYear();
    this.currentCalendarMonthAndYear = new MonthAndYear(this.systemMonthAndYear.month, this.systemMonthAndYear.year);

    departmentController.Department().subscribe((dept) => {
      this.department = dept;
      this.populateCalendar();

    });
  }

  updateCurrentSystemMonthAndYear:Function = function () {
    let dt = new Date();
    this.systemMonthAndYear = new MonthAndYear(dt.getMonth(), dt.getFullYear());
    this.systemDayStart = this.dateUtils.todayStartUtc();
  };
  showDetails:Function = function (evt:Event, day:Day) {
    if (evt && evt.srcElement) {
      evt.srcElement.classList.toggle("pressed");
      setTimeout(() => {
        evt.srcElement.classList.toggle("pressed");
      }, 450);
    }
    this.nav.push(CalendarDetailPage, {day: day});
  };
  previousMonth:Function = function () {
    if (this.currentCalendarMonthAndYear.month == this.systemMonthAndYear.month && this.currentCalendarMonthAndYear.year == this.systemMonthAndYear.year) {
      return;
    }
    this.animateCalendarChange("outLeft");
    if (this.currentCalendarMonthAndYear.month == 0) {
      this.currentCalendarMonthAndYear.year--;
      this.currentCalendarMonthAndYear.month = 11;
    }
    else {
      this.currentCalendarMonthAndYear.month--;
    }
    this.populateCalendar();
    this.endAnimation();

  };
  nextMonth:Function = function () {
    this.animateCalendarChange("outRight");
    if (this.currentCalendarMonthAndYear.month == 11) {
      this.currentCalendarMonthAndYear.year++;
      this.currentCalendarMonthAndYear.month = 0;
    }
    else {
      this.currentCalendarMonthAndYear.month++;
    }
    this.populateCalendar();
    this.endAnimation();

  };

  goToCurrentMonth:Function = function () {
    this.animateCalendarChange("outRight");
    this.updateCurrentSystemMonthAndYear();
    this.currentCalendarMonthAndYear = this.systemMonthAndYear;
    this.populateCalendar();
    setTimeout(() => {
      this.flyInOutState = "in";
      this.fadeState = "visible";
    }, 100);
    this.endAnimation();
  };

  populateCalendar:Function = function () {
    this.updateCurrentSystemMonthAndYear();
    let scheduleOffset = this.getScheduleOffset(this.currentCalendarMonthAndYear.month, this.currentCalendarMonthAndYear.year);
    var startOfMonthMoment = moment().utc().year(this.currentCalendarMonthAndYear.year).month(this.currentCalendarMonthAndYear.month).date(1);//new Date(this.currentCalendarMonthAndYear.year, this.currentCalendarMonthAndYear.month, 1);
    startOfMonthMoment.minute(0);
    startOfMonthMoment.second(0);
    startOfMonthMoment.hour(0);
    startOfMonthMoment.millisecond(0);
    //get the day of the week the first day of the month falls on
    let dayOfTheWeekOffset = startOfMonthMoment.day();
    //back up the date so we fill in dates before the first day of the month (previous month)
    startOfMonthMoment.date(startOfMonthMoment.date() - dayOfTheWeekOffset);
    console.dir("Start of month: " + startOfMonthMoment);
    //load the post count
    this.calendarStart = startOfMonthMoment;
    let startCalenderHere = startOfMonthMoment.clone();
    this.postCounts = {};
    this.postProvider.postCountForCalendar(this.calendarStart).subscribe(
      (response)=> {
        if (response) {
          this.postCounts = response.days || {};
          this.totalOn = response.totalOn || 0;
          this.totalOff = response.totalOff || 0;
        }
        else {
          this.totalOn = 0;
          this.totalOff = 0;
          this.postCounts = {};
        }
      }
    );
    //load the calendar days
    var calendarMonth = new CalendarMonth();
    //loop through all cells in the calendar, populating the date
    for (let i = 0; i < 6; i++)
      for (let j = 0; j < 7; j++) {
        var day = new Day();
        day.dayOfMonth = startCalenderHere.date();
        day.year = startCalenderHere.year();
        day.month = startCalenderHere.month();
        day.utcDayStart = this.dateUtils.dateFromDay(day).valueOf();
        day.date = startCalenderHere.clone();
        calendarMonth.weeks[i].days[j] = day;
        day.platoon = this.department.schedule.platoonSchedule[scheduleOffset % this.department.schedule.platoonSchedule.length];
        day.startTime = this.department.schedule.shiftStartTime;
        day.color = this.department.schedule.platoonColorCodes[day.platoon] || "#ffffff";
        startCalenderHere.date(startCalenderHere.date() + 1);
        scheduleOffset++
      }
    calendarMonth.year = this.currentCalendarMonthAndYear.year;
    calendarMonth.month = this.monthLookup[this.currentCalendarMonthAndYear.month];
    this.calendarMonth = calendarMonth;
  };
  endAnimation:Function = function () {
    setTimeout(() => {
      this.flyInOutState = "in";
      this.fadeState = "visible";
    }, 100);
  };

  getScheduleOffset:Function = function (month, year) {
    var dt = this.dateUtils.dateFromMS(this.department.schedule.platoonScheduleStartDate);
    var dt2 = moment([year, month, 1, 0, 0]);
    var diff = dt2.diff(dt, "days");
    return diff % (this.department.schedule.platoonSchedule.length);
  };
  animateCalendarChange:Function = function (outDirection) {
    this.flyInOutState = outDirection;
    this.fadeState = "invisible";
  };

}
