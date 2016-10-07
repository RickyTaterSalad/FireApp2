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
    selectedRank: string;
    selectedPlatoon : string;
    selectedAH : string;
    department;
    ranks : string[];
    platoons : string[];
    stations;
    ahCodes;

    constructor(private navCtrl: NavController,
                private navParams: NavParams,
                private authProvider:AuthProvider,
                private accountProvider:AccountProvider,
                private departmentProvider:DepartmentProvider,
                private stationProvider:StationProvider,
                private assignHireCodesProvider:AssignHireCodeProvider) {

            departmentProvider.Department().subscribe(
                (dept) => {
                    this.department = dept;
                    this.ranks = this.department.ranks;
                    this.platoons = this.department.platoons;
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

   register:Function = function() {
      this.accountProvider.self().subscribe(
          (account) => {
            //   account.firstName = this.firstName;
            //   account.lastName = this.lastName;
              account.platoon = this.platoon;
              account.rank = this.rank;
              account.assignedHireCode = this.ahCode;
            //   account.email = this.email;
              account.station = this.station;

              this.accountProvider.register();

          },
          (err) => {
              //unable to get self
          }
      );
  }
}
