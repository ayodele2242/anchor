import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';

import { ApiService } from '../services/api.service';
import { StorageService } from '../services/storage.service';
import { ToastrService } from '../services/toastr.service';
import { AdminDetailsModalComponent } from '../admin-details-modal/admin-details-modal.component';
import { UpdateAdminModalComponent } from '../update-admin-modal/update-admin-modal.component';
import { AddAdminModalComponent } from '../add-admin-modal/add-admin-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


// Updated Admin interface to match the new API response
interface Admin {
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

interface AdminListResponse {
  meta: {
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total_count: number;
  };
  objects: Admin[];
}

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.scss']
})
export class AdminListComponent implements OnInit {
  // Pagination properties
  currentPage: number = 0;
  recordsPerPage: number = 10; // Adjust as needed
  totalRecords: number = 0;

  // Data properties
  admins: Admin[] = [];
  dataSource!: MatTableDataSource<Admin>;
  
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
    this.loadAdmins();
  }

  loadAdmins(search?: string): void {
    // Prepare the URL with pagination and optional search
    const params = {
      offset: this.currentPage,
      limit: this.recordsPerPage,
      ...(search && { search }),
    };
  
    // Use the correct endpoint for admin list
    this.apiService.get<AdminListResponse>('admin/', params)
      .then((response) => {
        if (response) {
          // Update admins list - now directly from response.objects
          this.admins = response.objects;
  
          // Update pagination information
          this.totalRecords = response.meta.total_count;
  
          // Create table data source
          this.dataSource = new MatTableDataSource(this.admins);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
  
          // Handle empty results
          if (this.admins.length === 0) {
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
      this.loadAdmins(filterValue);
    } else {
      // Reset to full list
      this.isSearching = false;
      this.loadAdmins();
    }
  }

  // Pagination event handler
  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.recordsPerPage = event.pageSize;
    
    // Reload data with new pagination
    this.loadAdmins(this.isSearching ? this.searchQuery : undefined);
  }

  // Admin actions
  toggleAdminStatus(admin: Admin): void {
    // Implement admin status toggle logic
    this.toastrService.showInfo(`Toggle status for ${admin.first_name} ${admin.last_name}`, 'Status', 'top');
  }

  openAddAdminModal(): void {
    const dialogRef = this.dialog.open(AddAdminModalComponent, {
      width: '500px',
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadAdmins();
      }
    });
  }

  editAdmin(admin: Admin): void {
    const dialogRef = this.dialog.open(UpdateAdminModalComponent, {
      width: '600px',
      data: admin,  // Pass the selected admin to the modal
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadAdmins();
      }
    });
  }

    async deleteAdmin(admin: Admin): Promise<void | any> {
      // Confirm deletion
      const confirmDelete = window.confirm(`Are you sure you want to delete admin ${admin.first_name} ${admin.last_name}?`);
      
      if (confirmDelete) {
        try {
          // Perform delete request
          const endpoint = `admin/${admin.id}/`;
          const result = await this.apiService.delete<void>(endpoint);
          this.dataResp = result;
          if (this.dataResp.status === 'error') {
            
            this.snackBar.open(this.dataResp.message || 'Failed to add admin.', 'Close', { duration: 3000 });
          } else {
            this.snackBar.open('Admin details deleted successfully!', 'Close', { duration: 3000 });
            this.loadAdmins();
          }
          
        } catch (error) {
          console.error('Error deleting admin:', error);
          throw error;
        }
      }
  }

  viewAdminDetails(admin: Admin): void {
   
     // Fetch admin details from the API
     this.apiService.get(`admin/${admin.id}`).then((admin) => {
      // Open modal and pass the admin data
      this.dialog.open(AdminDetailsModalComponent, {
        width: '600px',
        data: admin,
      });
    }).catch((error) => {
      console.error('Error fetching admin details:', error);
    });

  }
}