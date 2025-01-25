import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';

import { ApiService } from '../services/api.service';
import { StorageService } from '../services/storage.service';
import { ToastrService } from '../services/toastr.service';
import { UpdateAdminModalComponent } from '../update-admin-modal/update-admin-modal.component';
import { AddAdminModalComponent } from '../add-admin-modal/add-admin-modal.component';
import { CustomerDetailsModalComponent } from '../modals/customer-details-modal/customer-details-modal.component';
import { CustomerUpdateModalComponent } from '../modals/customer-update-modal/customer-update-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Customers {
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
  permissions: any[];
  profile_id: number;
  profile_url: string;
  user_type: string;
  wallet_balance: string;
}

interface CustomerListResponse {
  meta: {
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total_count: number;
  };
  objects: Customers[];
}

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent  implements OnInit{
    
   // Pagination properties
    currentPage: number = 0;
    recordsPerPage: number = 10; // Adjust as needed
    totalRecords: number = 0;
  
    // Data properties
    customers: Customers[] = [];
    dataSource!: MatTableDataSource<Customers>;
    
    // Updated table configuration to include avatar
    displayedColumns: string[] = [
      'avatar', 
      'first_name', 
      'last_name', 
      'email', 
      'phone', 
      'nin', 
      'last_login', 
      'user_type',
      'wallet_balance',
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
      this.loadCustomers();
    }

    loadCustomers(search?: string): void {
        // Prepare the URL with pagination and optional search
        const params = {
          offset: this.currentPage,
          limit: this.recordsPerPage,
          ...(search && { search }),
        };
      
        // Use the correct endpoint for admin list
        this.apiService.get<CustomerListResponse>('customer/', params)
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
                this.toastrService.showInfo('No admins found', 'Information', 'top');
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
          this.loadCustomers(filterValue);
        } else {
          // Reset to full list
          this.isSearching = false;
          this.loadCustomers();
        }
      }
    
      // Pagination event handler
      onPageChange(event: any): void {
        this.currentPage = event.pageIndex + 1;
        this.recordsPerPage = event.pageSize;
        
        // Reload data with new pagination
        this.loadCustomers(this.isSearching ? this.searchQuery : undefined);
      }


      openAddAdminModal(): void {
          const dialogRef = this.dialog.open(AddAdminModalComponent, {
            width: '500px',
          });
        
          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              this.loadCustomers();
            }
          });
        }
      
        editAdmin(admin: Customers): void {
          const dialogRef = this.dialog.open(CustomerUpdateModalComponent, {
            width: '600px',
            data: admin,  // Pass the selected admin to the modal
          });
      
          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              this.loadCustomers();
            }
          });
        }
      
          async deleteAdmin(admin: Customers): Promise<void | any> {
            // Confirm deletion
            const confirmDelete = window.confirm(`Are you sure you want to delete details for ${admin.first_name} ${admin.last_name}?`);
            
            if (confirmDelete) {
              try {
                // Perform delete request
                const endpoint = `customer/${admin.id}/`;
                const result = await this.apiService.delete<void>(endpoint);
                this.dataResp = result;
                if (this.dataResp.status === 'error') {
                  
                  this.snackBar.open(this.dataResp.message, 'Close', { duration: 3000 });
                } else {
                  this.snackBar.open('Details deleted successfully!', 'Close', { duration: 3000 });
                  this.loadCustomers();
                }
                
              } catch (error) {
                console.error('Error deleting admin:', error);
                throw error;
              }
            }
        }
      
        viewAdminDetails(customer: Customers): void {
         
           // Fetch admin details from the API
           this.apiService.get(`customer/${customer.id}`).then((customer) => {
            // Open modal and pass the admin data
            this.dialog.open(CustomerDetailsModalComponent, {
              width: '600px',
              data: customer,
            });
          }).catch((error) => {
            console.error('Error fetching admin details:', error);
          });
      
        }
  

}
