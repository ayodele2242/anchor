import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { CoupensComponent } from './coupens/coupens.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MediaComponent } from './media/media.component';
import { PagesComponent } from './pages/pages.component';
import { ProductsComponent } from './products/products.component';
import { SettingsComponent } from './settings/settings.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { BranchesComponent } from './branches/branches.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { DepartmentsComponent } from './departments/departments.component';
import { JobTitleComponent } from './job-title/job-title.component';
import { AdminListComponent } from './admin-list/admin-list.component';
import { UsersListComponent } from './users-list/users-list.component';
import { BrokersComponent } from './brokers/brokers.component';
import { ProductVariantsComponent } from './product-variants/product-variants.component';
//import { RedirectDashboardGuard } from './guards/prevent-back.guard';


const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  },

  { 
    path: 'login', 
    component: LoginComponent,
  },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard]
  },
  { 
    path: 'admin-list', 
    component: AdminListComponent, 
    canActivate: [AuthGuard]
  },
  { 
    path: 'users-list', 
    component: UsersListComponent, 
    canActivate: [AuthGuard]
  },
  { 
    path: 'brokers', 
    component: BrokersComponent,
    canActivate: [AuthGuard] 
   },
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [AuthGuard],
     
  },
  {
    path: 'product-variants',
    component: ProductVariantsComponent,
    canActivate: [AuthGuard],
     
  },
  { 
    path: 'statistics', 
    component: StatisticsComponent,
    canActivate: [AuthGuard] 
   },
  {
    path: 'coupens',
    loadChildren: () => import('./coupens/coupens.module').then(m => m.CoupensModule),
    canActivate: [AuthGuard] 
  },
  { 
    path: 'pages', 
    component: PagesComponent,
    canActivate: [AuthGuard] 
   },
  { 
    path: 'media', 
    component: MediaComponent,
    canActivate: [AuthGuard] 
   },
  { 
    path: 'settings', 
    component: SettingsComponent,
    canActivate: [AuthGuard] 
   },
  { 
    path: 'add_employee', 
    component: AddEmployeeComponent,
    canActivate: [AuthGuard] 
   },
   { 
    path: 'branches', 
    component: BranchesComponent,
    canActivate: [AuthGuard] 
   },
   { 
    path: 'employees_list', 
    component: EmployeeListComponent,
    canActivate: [AuthGuard] 
   },
   { 
    path: 'departments', 
    component: DepartmentsComponent,
    canActivate: [AuthGuard] 
   },
   { 
    path: 'job_title', 
    component: JobTitleComponent,
    canActivate: [AuthGuard] 
   }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private authGuard: AuthGuard) {
    this.authGuard.checkBackButton();
  }
 }
