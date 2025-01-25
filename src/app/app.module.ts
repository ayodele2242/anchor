import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatTabsModule} from '@angular/material/tabs';


import { AppRoutingModule } from './app-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { BodyComponent } from './body/body.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { PagesComponent } from './pages/pages.component';
import { MediaComponent } from './media/media.component';
import { SettingsComponent } from './settings/settings.component';
import { SublevelMenuComponent } from './sidenav/sublevel-menu.component';
import { HeaderComponent } from './header/header.component';

 import { OverlayModule } from '@angular/cdk/overlay';
 import { CdkMenuModule } from '@angular/cdk/menu';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LockComponent } from './lock/lock.component';
import { AddUserComponent } from './add-user/add-user.component';
import { UsersListComponent } from './users-list/users-list.component';
import { InternetService } from './services/internet.service';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { BranchesComponent } from './branches/branches.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { DepartmentsComponent } from './departments/departments.component';
import { JobTitleComponent } from './job-title/job-title.component';
import { SharedsignalService } from './services/sharedsignal.service';
import { AdminListComponent } from './admin-list/admin-list.component';

import { SharedCommandService } from './services/sharedcommand.service';
import { AdminDetailsModalComponent } from './admin-details-modal/admin-details-modal.component';
import { UpdateAdminModalComponent } from './update-admin-modal/update-admin-modal.component';
import { AddAdminModalComponent } from './add-admin-modal/add-admin-modal.component';
import { CustomerDetailsModalComponent } from './modals/customer-details-modal/customer-details-modal.component';
import { CustomerUpdateModalComponent } from './modals/customer-update-modal/customer-update-modal.component';
import { BrokersComponent } from './brokers/brokers.component';
import { AddBrokerModalComponent } from './modals/add-broker-modal/add-broker-modal.component';
import { UpdateBrokerModalComponent } from './modals/update-broker-modal/update-broker-modal.component';



//import { LoadingInterceptor } from './loading.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
    SidenavComponent,
    DashboardComponent,
    StatisticsComponent,
    PagesComponent,
    MediaComponent,
    SettingsComponent,
    SublevelMenuComponent,
    HeaderComponent,
    LoginComponent,
    ForgotPasswordComponent,
    LockComponent,
    AddUserComponent,
    UsersListComponent,
    AddEmployeeComponent,
    BranchesComponent,
    EmployeeListComponent,
    DepartmentsComponent,
    JobTitleComponent,
    AdminListComponent,
    AdminDetailsModalComponent,
    UpdateAdminModalComponent,
    AddAdminModalComponent,
    CustomerDetailsModalComponent,
    CustomerUpdateModalComponent,
    BrokersComponent,
    AddBrokerModalComponent,
    UpdateBrokerModalComponent,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    OverlayModule,
    CdkMenuModule,
    HttpClientModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatTabsModule,
   
    
  ],
  providers: [
    SharedCommandService,
    {
      
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,

    },
    HttpClient,
    InternetService,
    SharedsignalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
