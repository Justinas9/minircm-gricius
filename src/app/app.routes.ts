import { Routes } from '@angular/router';
import { CompanyListComponent } from './company-list/company-list';
import { CompanyFormComponent } from './company-form/company-form';
import { CompanyViewComponent } from './company-view/company-view';
import { AuthComponent } from './auth.component/auth.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/companies', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  {
    path: 'companies',
    component: CompanyListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'add-company',
    component: CompanyFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'company/:id',
    component: CompanyViewComponent,
    canActivate: [authGuard]
  }
];
