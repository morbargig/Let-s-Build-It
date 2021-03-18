import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SideBarConfig } from '../../../../@shared/components/side-bar-page/sidebar.config';
import { UserModel } from '../../../../@shared/models/user.model';
import { UsersService } from '../../../../content/users/services/users.service';
import { EntityDetailsModel } from '../../../../@shared/components/side-bar-page/entity-details/entity-details.component';
import { DatePipe } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class UserResolverService implements Resolve<SideBarConfig<UserModel>>  {
  constructor(private userService: UsersService, private date: DatePipe) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): SideBarConfig<UserModel> | Observable<SideBarConfig<UserModel>> | Promise<SideBarConfig<UserModel>> {
    return {
      getEntityById: id => this.userService.get(id),
      getEntityDetails: (user: UserModel) => {
        return {
          mediaId: user.profileImageId,
          title: `${user.firstName} ${user.lastName}`,
          subTitle: [`${user.email} `, `Last Login: ${this.date.transform(user.lastSeen, 'd MMM h:mm a')}`],
          rightValues: [
            { label: 'Phone', value: null },
            { label: 'Age', value: null },
            { label: 'Status', value: user.isActive ? 'Active' : 'InActive' },
            { label: 'Subscription', value: null },
            { label: 'NFC Key', value: null }
          ]
        } as EntityDetailsModel
      },
      backLink: { label: 'Customer', value: '../../' },
      sidebarItems: [
        { label: 'Summary', value: 'summary' },
        { label: 'Profile', value: 'profile' },
        { label: 'Notifications', value: 'notifications' },
        { label: 'Messages', value: 'messages' },
        { label: 'Log Activities', value: 'log-activities' },
      ]
    } as SideBarConfig<UserModel>
  }
}
