import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {AuthProvider} from "../../providers/auth-provider";
import {DepartmentProvider} from "../../providers/department-provider";
import {AccountProvider} from "../../providers/account-provider";
import {StationProvider} from "../../providers/station-provider";
import {AssignHireCodeProvider} from "../../providers/assign-hire-provider";


/*
 Generated class for the RegisterPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: "register-page",
  templateUrl: 'register.html'

})
export class RegisterPage {

  rank:"";
  platoon:"";
  station:"";
  ahCode:"";

  department;
  ranks:string[];
  platoons:string[];
  stations;
  ahCodes;

  constructor(private navCtrl:NavController,
              private navParams:NavParams,
              private authProvider:AuthProvider,
              private accountProvider:AccountProvider,
              private departmentProvider:DepartmentProvider,
              private stationProvider:StationProvider,
              private assignHireCodesProvider:AssignHireCodeProvider) {

    departmentProvider.Department().subscribe(
      (dept) => {
        console.dir(dept);
        this.department = dept;
        if (this.department) {
          this.ranks = this.department.ranks;
          this.platoons = this.department.platoons;
        }
      }
    );

    stationProvider.Stations().subscribe(
      (stations) => {
        this.stations = stations;
      }
    );

    assignHireCodesProvider.AHCodes().subscribe(
      (ahCodes) => {
        this.ahCodes = ahCodes;
      }
    );
  }

  register:Function = function () {
    if(this.rank && this.station && this.ahCode && this.platoon){
      var registerParams = {
        rank: this.rank,
        station: this.station,
        assignHireCode: this.ahCode,
        platoon: this.platoon
      }
      this.accountProvider.register(registerParams);

    }

  }
}
