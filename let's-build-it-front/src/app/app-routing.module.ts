import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { Shell } from '@app/shell/shell.service';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'home',
      loadChildren: () => import('./content/home/home.module').then((m) => m.HomeModule),
    },
    // {
    //   path: 'starter',
    //   loadChildren: () => import('./content/start/start.module').then((m) => m.StartModule),
    // },
    {
      path: 'configuration',
      loadChildren: () => import('./content/configuration/configuration.module').then((m) => m.ConfigurationModule),
    },
    {
      path: 'users',
      loadChildren: () => import('./content/users/users.module').then((m) => m.UsersModule),
    },
    {
      path: 'vehicles',
      loadChildren: () => import('./content/vehicles/vehicles.module').then((m) => m.VehiclesModule),
    },
    {
      path: 'agencies/:partnerId/fleets',
      loadChildren: () => import('./content/fleets/fleets.module').then((m) => m.FleetsModule),
    },
    {
      path: 'fleets',
      loadChildren: () => import('./content/fleets/fleets.module').then((m) => m.FleetsModule),
    },
    {
      path: 'agencies',
      loadChildren: () => import('./content/agencies/agencies.module').then((m) => m.AgenciesModule),
    },

    {
      path: 'inventories',
      loadChildren: () => import('./content/inventories/inventories.module').then((m) => m.InventoriesModule),
    },
    {
      path: 'booking',
      loadChildren: () => import('./content/bookings/booking.module').then((m) => m.BookingModule),
    },

  ]),

  // Fallback when no prior route is matched
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: 'enabled',
      // enableTracing: true
    }),
  ],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule { }
