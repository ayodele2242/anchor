import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { StorageService } from '../services/storage.service';
import { ToastrService } from '../services/toastr.service';
import { AddBrokerModalComponent } from '../modals/add-broker-modal/add-broker-modal.component';
import { UpdateBrokerModalComponent } from '../modals/update-broker-modal/update-broker-modal.component';
import { CustomerDetailsModalComponent } from '../modals/customer-details-modal/customer-details-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface broker {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  nin: string;
  last_login: string;
  resource_uri: string;
  auth_token: string;
  avatar: string;
  profile_id: number;
  profile_url: string;
  user_type: string; 
  wallet_balance: string;
}


interface BrokerListResponse {
  meta: {
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total_count: number;
  };
  objects: broker[];
}


@Component({
  selector: 'app-brokers',
  templateUrl: './brokers.component.html',
  styleUrls: ['./brokers.component.scss']
})
export class BrokersComponent implements OnInit{

  // Pagination properties
      currentPage: number = 0;
      recordsPerPage: number = 10; // Adjust as needed
      totalRecords: number = 0;
    
      // Data properties
      customers: broker[] = [];
      dataSource!: MatTableDataSource<broker>;
      
      // Updated table configuration to include avatar
      displayedColumns: string[] = [
        'resource_uri',
        'first_name',
        'last_name',
        'email',
        'phone',
        'nin',
        'wallet_balance',
        'naicom_certificate',
        'last_login',
        'action'
      ];
    
      dataResp: any = [];
    
      // Search and filtering
      searchQuery: string = '';
      isSearching: boolean = false;
    
      // View child decorators
      @ViewChild(MatPaginator) paginator!: MatPaginator;
      @ViewChild(MatSort) sort!: MatSort;
  
      constructor(
        private apiService: ApiService,
        private toastrService: ToastrService, 
        private dialog: MatDialog,
        private snackBar: MatSnackBar
      ) {}
  
      ngOnInit(): void {
        this.loadBrokers();
      }

       loadBrokers(search?: string): void {
             
              const params = {
                offset: this.currentPage,
                limit: this.recordsPerPage,
                ...(search && { search }),
              };
            
              // Use the correct endpoint for admin list
              this.apiService.get<BrokerListResponse>('broker', params)
                .then((response) => {
                  if (response) {
                    // Update admins list - now directly from response.objects
                    this.customers = response.objects;
            
                    // Update pagination information
                    this.totalRecords = response.meta.total_count;
            
                    // Create table data source
                    this.dataSource = new MatTableDataSource(this.customers);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
            
                    // Handle empty results
                    if (this.customers.length === 0) {
                      this.toastrService.showInfo('No brokers found', 'Information', 'top');
                    }
                  }
                })
                .catch((error) => {
                  this.toastrService.showError(
                    'Failed to load admins. Please try again.',
                    'Error',
                    'top'
                  );
                  console.error('Admin list fetch error:', error);
                });
            }
            
            applyFilter(event: Event): void {
              const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
              
              // Reset pagination when searching
              this.currentPage = 1;
              
              if (filterValue) {
                // Perform search
                this.isSearching = true;
                this.loadBrokers(filterValue);
              } else {
                // Reset to full list
                this.isSearching = false;
                this.loadBrokers();
              }
            }
          
            // Pagination event handler
            onPageChange(event: any): void {
              this.currentPage = event.pageIndex + 1;
              this.recordsPerPage = event.pageSize;
              
              // Reload data with new pagination
              this.loadBrokers(this.isSearching ? this.searchQuery : undefined);
            }
      
      
            openAddBrokerModal(): void {
                const dialogRef = this.dialog.open(AddBrokerModalComponent, {
                  width: '600px',
                });
              
                dialogRef.afterClosed().subscribe((result) => {
                  if (result) {
                    this.loadBrokers();
                  }
                });
              }
            
              editBroker(broker: broker): void {
                const dialogRef = this.dialog.open(UpdateBrokerModalComponent, {
                  width: '600px',
                  data:broker,
                });
            
                dialogRef.afterClosed().subscribe((result) => {
                  if (result) {
                    this.loadBrokers();
                  }
                });
              }
            
                async deleteBroker(broker: broker): Promise<void | any> {
                  // Confirm deletion
                  const confirmDelete = window.confirm(`Are you sure you want to delete details for ${broker.first_name} ${broker.last_name}?`);
                  
                  if (confirmDelete) {
                    try {
                      // Perform delete request
                      const endpoint = `broker/${broker.id}/`;
                      const result = await this.apiService.delete<void>(endpoint);
                      this.dataResp = result;
                      if (this.dataResp.status === 'error') {
                        
                        this.snackBar.open(this.dataResp.message, 'Close', { duration: 3000 });
                      } else {
                        this.snackBar.open('Details deleted successfully!', 'Close', { duration: 3000 });
                        this.loadBrokers();
                      }
                      
                    } catch (error) {
                      console.error('Error deleting admin:', error);
                      throw error;
                    }
                  }
              }
            
              viewBrokerDetails(broker: broker): void {
               
                 // Fetch admin details from the API
                 this.apiService.get(`customer/${broker.id}`).then((broker) => {
                  // Open modal and pass the admin data
                  this.dialog.open(CustomerDetailsModalComponent, {
                    width: '600px',
                    data: broker,
                  });
                }).catch((error) => {
                  console.error('Error fetching admin details:', error);
                });
            
              }

}
