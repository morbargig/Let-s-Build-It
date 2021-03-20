import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // { path: '', redirectTo: 'acl' },
  { path: 'acl', loadChildren: () => import('./modules/acl/acl.module').then((m) => m.AclModule) },
  {
    path: 'security',
    loadChildren: () => import('./modules/security/security.module').then((m) => m.SecurityModule),
  },
  {
    path: 'audit-logs',
    loadChildren: () => import('./modules/audit-logs/audit-logs.module').then((m) => m.AuditLogsModule),
  },
  {
    path: 'settings',
    loadChildren: () => import('./modules/settings/settings.module').then((m) => m.SettingsModule),
  },
  {
    path: 'tags',
    loadChildren: () => import('./modules/tags/tags.module').then((m) => m.TagsModule),
  },
  {
    path: 'localization',
    loadChildren: () => import('./modules/localization/localization.module').then((m) => m.LocalizationModule),
  },
  {
    path: 'templates',
    loadChildren: () => import('./modules/templates/templates.module').then((m) => m.TemplatesModule),
  },
  {
    path: 'payment-plans',
    loadChildren: () => import('./modules/payment-plans/payment-plans.module').then((m) => m.PaymentPlansModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigurationRoutingModule {}
