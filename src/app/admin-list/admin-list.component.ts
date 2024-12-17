import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';

import { ApiService } from '../services/api.service';
import { StorageService } from '../services/storage.service';
import { ToastrService } from '../services/toastr.service';
import { Admin } from '../interfaces/admin.interface';

interface AdminListResponse {
  meta: {
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total_count: number;
  };
  objects: {
    admin: Admin[];
  };
}

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.scss']
})
export class AdminListComponent implements OnInit {
  // Pagination properties
  currentPage: number = 1;
  recordsPerPage: number = 10; // Adjust as needed
  totalRecords: number = 0;

  // Data properties
  admins: Admin[] = [];
  dataSource!: MatTableDataSource<Admin>;
  
  // Table configuration
  displayedColumns: string[] = [
    'resource_uri', 
    'id', 
    'first_name', 
    'last_name', 
    'phone', 
    'email', 
    'nin', 
    'last_login', 
    'action'
  ];

  // Search and filtering
  searchQuery: string = '';
  isSearching: boolean = false;

  // View child decorators
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiService: ApiService,
    private toastrService: ToastrService
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
          // Update admins list
          this.admins = response.objects.admin;
  
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
    // This would typically involve calling an API to update the admin's status
    this.toastrService.showInfo(`Toggle status for ${admin.first_name} ${admin.last_name}`, 'Status', 'top');
  }

  editAdmin(admin: Admin): void {
    // Implement edit admin logic
    console.log('Edit admin:', admin);
  }

  deleteAdmin(admin: Admin): void {
    // Implement delete admin logic
    console.log('Delete admin:', admin);
  }

  viewAdminDetails(admin: Admin): void {
    // Implement view admin details logic
    console.log('View admin details:', admin);
  }
}