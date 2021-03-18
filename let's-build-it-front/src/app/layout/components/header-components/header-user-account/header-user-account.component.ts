import { Component, OnInit } from '@angular/core';
import { AuthenticationService, BaseComponent } from '@core';
import { Router } from '@angular/router';
import { AuthenticationResponseModel } from '../../../../@shared/models/authentication.response';
import { AccountService } from '../../../../@shared/services/account.service';

@Component({
  selector: 'prx-header-user-account',
  templateUrl: './header-user-account.component.html',
  styleUrls: ['./header-user-account.component.scss'],
})
export class HeaderUserAccountComponent extends BaseComponent implements OnInit {
  constructor(private authenticationService: AuthenticationService, private router: Router, private accountService: AccountService) {
    super();
  }


  public get authenticationResponse(): AuthenticationResponseModel {
    return this.accountService.user;
  }

  ngOnInit() {

  }

  logout() {
    this.authenticationService.logout().subscribe(() => this.redirect());
    if (this.authenticationService.isAuthenticated) {
    }
  }

  redirect() {
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
