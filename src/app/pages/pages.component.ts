import { Component, OnInit } from '@angular/core';
import { MENU_ITEMS } from './pages-menu';
import { UtilService } from '../shared/common-service/util.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
     <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnInit  {

  // menu = MENU_ITEMS;
  public menu = [];
  public userRole: any;
  public userDetails: any;
  constructor(
    private jwtHelper: JwtHelperService,
    public utilService: UtilService
  ) { }

ngOnInit(): void {
  this.userRole = this.jwtHelper.decodeToken(localStorage.getItem('access_token'));
    this.userDetails = this.utilService.getLocalStorageValue("userDetail");
    // if (this.userRole.role == 'CUSTOMER') {
    //   this.menu = this.menu.filter(function (el) {
    //     return el.title != "Admin Area"
    //   });
    // }

    if (this.userDetails && this.userDetails.menu_permissions.length) {
      let menusArray: any = [];
      this.userDetails.menu_permissions.forEach((mainMenu: any) => {
        let obj: any = {};
        obj.title = mainMenu.name;
        obj.icon = mainMenu.icon_css_class;
        obj.link = mainMenu.url;
        if (mainMenu.children_menus && mainMenu.children_menus.length) {
          this.recursiveChildMenuLoop(obj, mainMenu.children_menus);
        }
        menusArray.push(obj);
      });
      this.menu = menusArray;
    }
  }

 public recursiveChildMenuLoop(menuObj: any, childMenus: any) {
  menuObj.children = [];
  childMenus.forEach((childMenu: any) => {
    let childMenuObj: any = {};
    childMenuObj ={
      title: childMenu.name,
      icon : childMenu.icon_css_class,
      link: childMenu.url
    }
    menuObj.children.push(childMenuObj);
    if(childMenu.children_menus && childMenu.children_menus.length) {
        this.recursiveChildMenuLoop(childMenuObj, childMenu.children_menus);
      }
  });
 }
}
