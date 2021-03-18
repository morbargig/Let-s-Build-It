import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { CredentialsService } from './credentials.service';
import { LoginContext, RegisterContext, AuthorizationEntity } from './authentication.models';
import { AccountService } from '../../@shared/services/account.service';
import { AuthenticationResponseModel } from '@app/@shared/models/authentication.response';
import { switchMap, tap } from 'rxjs/operators';

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private loggedIn: boolean;

  get isAuthenticated() {
    return this.loggedIn;
  }

  constructor(private credentialsService: CredentialsService, private accountService: AccountService) { }

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(context: LoginContext): Observable<AuthenticationResponseModel> {
    this.loggedIn = true;

    // Replace by proper authentication call

    const request = {
      username: context.employId,
      password: context.password,
    };
    debugger
    return this.accountService.authenticate(request).pipe(
      tap((x) =>
        this.credentialsService.setCredentials(
          {
            accessToken: x.token,
            email: x.username,
            authorized: true,
            username: x.username,
            expiresIn: x.validTo,
          } as AuthorizationEntity,
          context.remember
        )
      ),
      switchMap((res) => this.accountService.getUserPermissions())
    );

    // this.credentialsService.setCredentials(data, context.remember);
    // return of(data);
  }

  /**
   * Registers the user.
   * @param context The register parameters.
   * @return The user credentials.
   */
  register(context: RegisterContext): Observable<AuthorizationEntity> {
    // Replace by proper registration call
    const data: AuthorizationEntity = {
      username: context.username,
      accessToken: '654321',
      fullName: '',
      admin: true,
      authorized: true,
      email: '',
      expiresIn: new Date(),
      newUser: false,
    };

    return of(data);
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.credentialsService.setCredentials();
    return of(true);
  }
}
