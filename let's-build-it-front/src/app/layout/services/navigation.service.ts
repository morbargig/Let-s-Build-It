import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  faLayerGroup,
  faHome,
  faTools,
  faLowVision,
  faUsersCog,
  faUserPlus,
  faCarSide,
  faCar,
  faExclamationTriangle,
  faCompress,
  faTag,
  faUserTag,
  faMicrophone,
  faLanguage,
  faAmericanSignLanguageInterpreting,
  faCog,
  faUserSecret,
  faWarehouse,
  faBoxes,
  faPallet,
  faKeyboard,
  faGlobe,
  faHouseDamage,
  faDiceFive,
  faThList,
  faCalendarAlt,
  faIdCard,
  faUserTie,
  faMagic,
  faThLarge,
  faBell,
  faServer,
  faWallet,
} from '@fortawesome/free-solid-svg-icons';

import { NavigationOptions } from '../models/navigation';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { Permission } from '../../@ideo/infrastructure/permissions/permission';
import { faSearch, faEnvelope, faLink } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor() { }

  getNavigationItems(): Observable<NavigationOptions[]> {
    return of([
      // {
      //   icon: {},
      //   title: 'BestAgency',
      //   permission: { values: ['AccessAdminPanel'] } as Permission,
      //   items: [
      //     {
      //       title: 'Inventories',
      //       icon: { name: faWarehouse },
      //       permission: { values: ['AccessAgencyFleetInventories'] } as Permission,
      //       items: [
      //         {
      //           icon: { name: faPallet },
      //           title: 'Create inventory',
      //           link: '/inventories/create',
      //           permission: { values: ['CreateAgencyFleetInventories'] } as Permission,
      //         },
      //         {
      //           icon: { name: faBoxes },
      //           title: 'List',
      //           link: '/inventories',
      //           permission: { values: ['AccessAgencyFleetInventories'] } as Permission,
      //         },
      //       ],
      //     },
      //     {
      //       title: 'Configuration',
      //       icon: { name: faTools },
      //       items: [
      //         {
      //           icon: { name: faMicrophone },
      //           title: 'Audit Logs',
      //           link: '/configuration/audit-logs',
      //           permission: { roles: ['Admin'] } as Permission,
      //         },
      //         {
      //           icon: { name: faKeyboard },
      //           title: 'Templates',
      //           link: '/configuration/templates',
      //           permission: { roles: ['Admin'] } as Permission,
      //         },
      //         {
      //           title: 'Users',
      //           icon: { name: faUsersCog },
      //           permission: { values: ['AccessUsers'] } as Permission,
      //           items: [
      //             {
      //               icon: { name: faUserPlus },
      //               title: 'Create customer',
      //               link: '/users/create',
      //               permission: { values: ['CreateUsers'] } as Permission,
      //             },
      //             {
      //               icon: { name: faUserTag },
      //               title: 'Customer tags',
      //               link: '/users/tags',
      //               permission: { values: ['AccessTags'] } as Permission,
      //             },

      //           ],
      //         },
      //         {
      //           icon: { name: faUserSecret },
      //           title: 'Security',
      //           permission: { roles: ['Admin'] } as Permission,
      //           items: [
      //             {
      //               icon: { name: faLowVision },
      //               title: 'Access Control List',
      //               link: '/configuration/acl',
      //               permissions: { roles: ['Admin'] } as Permission,
      //             },
      //             {
      //               icon: { name: faLowVision },
      //               title: 'Roles',
      //               link: '/configuration/security/roles',
      //               permissions: { roles: ['Admin'] } as Permission,
      //             },
      //           ],
      //         },
      //         {
      //           icon: { name: faTag },
      //           title: 'Tags management',
      //           link: '/configuration/tags',
      //           permission: { values: ['AccessTags'] } as Permission,
      //         },
      //         {
      //           icon: { name: faWallet },
      //           title: 'Payment plans',
      //           link: '/configuration/payment-plans',
      //           permission: { values: ['AccessPaymentPlans'] } as Permission,
      //         },
      //         {
      //           icon: { name: faGlobe },
      //           title: 'Localization',
      //           permission: { values: ['AccessLocalization'] } as Permission,
      //           items: [
      //             {
      //               icon: { name: faLanguage },
      //               title: 'Language',
      //               link: '/configuration/localization/languages',
      //               permission: { values: ['AccessLocalization'] } as Permission,
      //             },
      //             {
      //               icon: { name: faAmericanSignLanguageInterpreting },
      //               title: 'Locale Resource',
      //               link: '/configuration/localization/locale-resources',
      //               permission: { values: ['AccessLocalization'] } as Permission,
      //             },
      //           ],
      //         },
      //         {
      //           icon: { name: faCog },
      //           title: 'Settings',
      //           link: '/configuration/settings',
      //           permission: { values: ['AccessSettings'] } as Permission,
      //         },
      //       ],
      //     },
      //   ],
      // },
      {
        title: 'Dashboard',
        icon: {},
        permission: { values: ['AccessAdminPanel'] } as Permission,
        items: [
          {
            icon: { name: faHome },
            title: 'Dashboard',
            link: '/home',
            permission: { values: ['AccessAdminPanel'] } as Permission,
          },
        ],
      },
      // {
      //   title: 'Fleet',
      //   icon: {},
      //   permission: { values: ['AccessAgencies', 'AccessAgencyFleet'] } as Permission,
      //   items: [
      //     {
      //       icon: { name: faLayerGroup },
      //       title: 'Fleets',
      //       link: '/agencies',
      //       permission: { values: ['AccessAgencies'] } as Permission,
      //     },
      //     {
      //       icon: { name: faLayerGroup },
      //       title: 'Fleet View',
      //       link: '/fleets',
      //       permission: { values: ['AccessAgencyFleet'] } as Permission,
      //     },
      //     {
      //       title: 'Vehicles',
      //       icon: { name: faCarSide },
      //       permission: { values: ['AccessAgencyVehicles'] } as Permission,
      //       items: [
      //         {
      //           icon: { name: faCar },
      //           title: 'Create vehicle',
      //           link: '/vehicles/create',
      //           permission: { values: ['CreateAgencyVehicles'] } as Permission,
      //         },
      //         {
      //           icon: { name: faLayerGroup },
      //           title: 'List',
      //           link: '/vehicles',
      //           permission: { values: ['AccessAgencyVehicles'] } as Permission,
      //         },
      //         {
      //           icon: { name: faCompress },
      //           title: 'Segments',
      //           link: '/vehicles/segments',
      //           permission: { values: ['AccessAgencyFleetSegments'] } as Permission,
      //         },
      //       ],
      //     },
      //     {
      //       icon: { name: faHouseDamage },
      //       title: 'Damages',
      //       link: '/fleets/my/profile/damages',
      //       permission: { values: ['AccessAgencyFleet'] } as Permission,
      //     },
      //     {
      //       title: 'Alerts',
      //       icon: { name: faExclamationTriangle },
      //       link: 'agencies/alerts',
      //       permissions: { values: ['AccessAlerts'] } as Permission,
      //     },
      //     {
      //       title: 'Zones',
      //       icon: { name: faDiceFive },
      //       link: '/fleets/my/profile/zones',
      //       permissions: { values: ['AccessAgencyFleetParkings'] } as Permission,
      //     },
      //     // {
      //     //   title: 'Models',
      //     //   icon: { name: faCar },
      //     //   link: './',
      //     //   permissions: { values: ['AccessAlerts'] } as Permission,
      //     // },
      //     // {
      //     //   title: 'Services',
      //     //   icon: { name: faServer },
      //     //   link: './',
      //     //   permissions: { values: ['AccessAlerts'] } as Permission,
      //     // },
      //   ],
      // },
      // {
      //   title: 'Bookings',
      //   icon: {},
      //   permission: { values: ['AccessBookings'] } as Permission,
      //   items: [
      //     {
      //       title: 'List View',
      //       icon: { name: faThList },
      //       link: '',
      //       permissions: { values: ['AccessBookings'] } as Permission,
      //     },
      //     {
      //       title: 'Calendar View',
      //       icon: { name: faCalendarAlt },
      //       link: '',
      //       permissions: { values: ['AccessBookings'] } as Permission,
      //     },
      //     {
      //       title: 'Create Booking',
      //       icon: { name: faLink },
      //       link: '/booking/create',
      //       permissions: { values: ['AccessBookings'] } as Permission,
      //     },
      //   ],
      // },
      // {
      //   title: 'Customers',
      //   icon: {},
      //   permission: { values: ['AccessUsers', 'AccessAgencyUsers'] } as Permission,
      //   items: [
      //     {
      //       icon: { name: faLayerGroup },
      //       title: 'List',
      //       link: '/users',
      //       permission: { values: ['AccessUsers', 'AccessAgencyUsers'] } as Permission,
      //     },
      //     {
      //       title: 'Individuals View',
      //       icon: { name: faIdCard },
      //       link: '',
      //       permissions: { values: ['AccessUsers'] } as Permission,
      //     },
      //     {
      //       title: 'Corporates View',
      //       icon: { name: faUserTie },
      //       link: '',
      //       permissions: { values: ['AccessUsers'] } as Permission,
      //     },
      //   ],
      // },
      // {
      //   title: 'Contracts',
      //   icon: {},
      //   permission: { values: ['AccessContracts'] } as Permission,
      //   items: [
      //     {
      //       title: 'List',
      //       icon: { name: faLayerGroup },
      //       link: '',
      //       permissions: { values: ['AccessContracts'] } as Permission,
      //     },
      //   ],
      // },
      // {
      //   title: 'Invoices',
      //   icon: {},
      //   permission: { values: ['AccessInvoices'] } as Permission,
      //   items: [
      //     {
      //       title: 'List',
      //       icon: { name: faLayerGroup },
      //       link: '',
      //       permissions: { values: ['AccessInvoices'] } as Permission,
      //     },
      //   ],
      // },
    ]);
  }
}
