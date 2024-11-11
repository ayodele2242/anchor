import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';
import { EncryptionService } from '../services/encryption.service';
import { StorageService } from '../services/storage.service';
import { InternetService } from '../services/internet.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from '../services/toastr.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';


export interface StaffsData {
  id: string;
  userId: string;
  name: any;
  email: any;
  phone: any;
  gender: any;
  department: any;
  body: any;
}

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {

  currentPage: number = 1;
  searchCurrentPage: number = 1;
  recordsPerPage: number = 20;
  data: any[] = [];
  retryStatus: any;
  errMsg: any;
  errStatus: boolean = false;
  noMoreDataMessage: any;


  displayedColumns: string[] = ['avatar', 'staff_id', 'name', 'email', 'phone', 'gender', 'department', 'createTime', 'updateTime', 'status', 'action',];
  dataSource!: MatTableDataSource<StaffsData>;
  posts: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  totalRecord: any;
  rendered: any;
  recordsLeft: any;
  searchQuery: string = '';
  isSearchQueryEmpty: boolean = true;
  staffStatus = new FormControl({ value: '', disabled: true });
  id: any;
  dataResp: any;

  constructor(
    private apiService: ApiService,
    private storage: StorageService,
    private encryptionService: EncryptionService,
    private internetService: InternetService,
    private toastrService: ToastrService,) {
      this.data = [];
    }

  //dtOptions: datatables.Config = {};

  ngOnInit(): void {
    this.loadData();
  }

  applyFilter(event: Event): void {
    this.currentPage = 1; // Reset the page number when a new search is performed
    this.searchQuery = (event.target as HTMLInputElement).value;
    
    // Check if the search query is empty
    this.isSearchQueryEmpty = this.searchQuery.trim() === '';
  
    if (this.isSearchQueryEmpty) {
      // If the search query is empty, call loadData to load all data
      this.loadData();
      this.data = []; // Clear the data array before loading new data
    } else {
      // If the search query is not empty, call the API with the search query
      this.searchData();
    }
  }
  
  loadData(): void {
    
    const url = `/staffs/staffs_list?page=${this.currentPage}&perPage=${this.recordsPerPage}`;
    this.apiService.getStuff(url).subscribe((response: any) => {
      if (response.status === true) {
        // Handle pagination based on the data length
        if (response.data.length > 0) {
          // Append new data to the existing data array
          this.data = [...this.data, ...response.data];
  
          this.dataSource = new MatTableDataSource(this.data);
  
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.totalRecord = response.totalRecords;
          this.rendered = response.recordsRendered;
          this.recordsLeft = response.recordsLeft;
  
          this.errStatus = false;
          this.currentPage++;
        } else {
          // No more records to load, display a message
          this.noMoreDataMessage = "No more data";
        }
      } else {
        this.errMsg = true;
        this.errMsg = response.msg;
        this.toastrService.showError('No more data to load', 'Info', 'toast-top-right');
      }
    });
  }
  
  searchData(): void {
    this.currentPage = 1; // Reset the page number when a new search is performed
    const url = `/staffs/staffs_list?page=${this.currentPage}&perPage=${this.recordsPerPage}&search=${this.searchQuery}`;
    this.apiService.getStuff(url).subscribe((response: any) => {
      if (response.status === true) {
        // Handle the response as before
        if (response.data.length > 0) {
          // Append new data to the existing data array
          this.data = response.data;
  
          this.dataSource = new MatTableDataSource(this.data);
  
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.totalRecord = response.totalRecords;
          this.rendered = response.recordsRendered;
          this.recordsLeft = response.recordsLeft;
  
          this.errStatus = false;
          this.currentPage++;
        } else {
          // No more records to load, display a message
          this.noMoreDataMessage = "No more data";
        }
      } else {
        this.errMsg = true;
        this.errMsg = response.msg;
        this.toastrService.showError('No more data to load', 'Info', 'toast-top-right');
      }
    });
  }
  

 async toggleStatus(event: MatSlideToggleChange, id: number): Promise<void> {

    const status = event.checked ? 1 : 0;
    const iv = await this.storage.getStorage("iv");
    const key = await this.storage.getStorage("key");

    const userdata = { "id": id, "status": status };
    const text = JSON.stringify(userdata);
    const code = this.encryptionService.encrypt(key, iv, text);

    this.apiService.postData('/staffs/update_account_status', code).subscribe({
      next: async (data: any) => {
        
        if(data.status === 1){
         this.toastrService.showSuccess(data.msg, 'Success', 'toast-top-right');
        }else{
          this.toastrService.showWarning(data.msg, 'warning', 'toast-top-right');
        }
    
      },
      error: async (err: any) => {
      
        //console.log("Error " + JSON.stringify(err));
    
        if (err.status === 400) {
          this.toastrService.showError(err.error.msg, 'Error', 'toast-top-right');
        } else {
          this.toastrService.showError(this.getErrorMessage(err), 'Error', 'toast-top-right');
        }
      }
    });

   
  }
  

  deleteEmployee(id: number) {


  }

  openEditForm(data: any) {

  }

  viewEmployee(id: number){

    console.log("User id "+id);

  }


  getErrorMessage(err: any): any {
    // Handle other errors based on err.status
   if(err.message.includes('response for')){
    return 'Error connecting to server.'
   }else if(err.message.includes('Http failure during parsing')){
    return 'Error parsing your request. Please check your back-end for issue.'
   }else if(err.status == 404){
    return 'The end-point you are trying to access is not found';
   }
   else{
    return 'An unknown error occured. Please try again later.';
   }
  }
}
