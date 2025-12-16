import { Routes } from '@angular/router';
import { CompanyListComponent } from './company-list/company-list';
import { CompanyFormComponent } from './company-form/company-form';
import { CompanyViewComponent } from './company-view/company-view';

export const routes: Routes = [
  { path: '', redirectTo: '/companies', pathMatch: 'full' },
  { path: 'companies', component: CompanyListComponent },
  { path: 'add-company', component: CompanyFormComponent },
  { path: 'company/:id', component: CompanyViewComponent }
];
