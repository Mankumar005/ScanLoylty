import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbDialogService, NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService, NbToastrService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';
import { UtilService } from '../../../shared/common-service/util.service';
import { Router } from '@angular/router';
import { ConfirmModalComponent } from '../../../shared/modal-service/confirm-modal/confirm-modal.component';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  public userPictureOnly: boolean = false;
  public user: any = null;
  public userDetails: any = null;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';
  // { title: "Profile" },
  public userMenu = [{ title: "Log out" }];

  constructor(
    public utilService: UtilService,
    public authService: NbAuthService,
    public router: Router,
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private layoutService: LayoutService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private breakpointService: NbMediaBreakpointsService,
  ) {
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;
    this.userDetails = this.utilService.getLocalStorageValue('userDetail')
    // console.log(this.userDetails,'userDetails====');

    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => this.user = users.nick);

    this.userService.getUsers()
      .subscribe((users: any) => this.user = users.nick);
    this.menuService.onItemClick().subscribe((event) => {
      this.onItemSelection(event.item.title);
    })

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }


  public onItemSelection(title: any) {
    if (title === "Log out") {
      this.logOut()
    } else if (title === 'Profile') {
      console.log('Profile Clicked ')
    }
  }
  public logOut(): void {
    this.dialogService.open(ConfirmModalComponent, {
      context: {
        data: "Are you sure want to log out?",
      },
    })
      .onClose.subscribe((confirm: any) => {
        if (confirm) {
          localStorage.removeItem("auth_app_token");
          localStorage.removeItem("userDetail");
          localStorage.removeItem("access_token");
          this.router.navigate(['auth/login'])
        }
      });
  }
  public toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();
    return false;
  }

  public navigateHome() {
    this.router.navigate([`/pages/dashborad`])
    this.menuService.navigateHome();
    return false;
  }
}
