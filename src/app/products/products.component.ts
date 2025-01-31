import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../services/api.service';
import { ToastrService } from '../services/toastr.service';
import { AddProductModalComponent } from '../modals/add-product-modal/add-product-modal.component';
import { UpdateBrokerModalComponent } from '../modals/update-broker-modal/update-broker-modal.component';
import { CustomerDetailsModalComponent } from '../modals/customer-details-modal/customer-details-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';

export interface Product {
  id?: number;
  title: string;
  description: string;
  summary: string;
  image?: string;
  icon?: string;
  duration: string;
  rate: number;
  enabled?: boolean;
  resource_uri?: string;
  variants?: any[];
}


interface ProductListResponse {
  meta: {
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total_count: number;
  };
  objects: Product[];
}

interface ProductListParams {
  offset: number;
  limit: number;
  ordering?: string;
  query?: string;
}



@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  displayedColumns: string[] = [
    'image', 'icon', 'title', 
    'summary', 'duration', 
    'rate', 'variants',
    'enabled', 'action'];

 
        totalProducts = 0;
        isLoading = true;
  

        filterSubject = new BehaviorSubject<string>('');
        selection = new SelectionModel<Product>(true, []);

       // Pagination properties
        currentPage: number = 0;
        recordsPerPage: number = 10; // Adjust as needed
        totalRecords: number = 0;
        hasPreviousPage: boolean = false;

        totalRecord: any;
        rendered: any;
        recordsLeft: any;
      
        // Data properties
        products: Product[] = [];
        dataSource!: MatTableDataSource<Product>;

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
  ) { }

  ngOnInit() {
    //this.setupTableDataSource();
  }


  async setupTableDataSource() {
    this.sort.sortChange.subscribe(() => this.loadProducts());
    this.paginator.page.subscribe(() => this.loadProducts());
    this.filterSubject.subscribe(() => this.loadProducts());
    
    await this.loadProducts();
  }

  ngAfterViewInit() {
    // Ensure views are initialized before setting up subscriptions
    if (this.sort && this.paginator) {
      // Combine multiple change triggers
      merge(
        this.sort.sortChange, 
        this.paginator.page, 
        this.filterSubject
      ).pipe(
        tap(() => this.loadProducts())
      ).subscribe();

      // Initial load
      this.loadProducts();
    }
  }

  async loadProducts() {
    this.isLoading = true;
  
    try {
      const params: ProductListParams = {
        offset: this.paginator.pageIndex * this.paginator.pageSize,
        limit: this.paginator.pageSize
      };
  
      // Add sorting
      if (this.sort.active && this.sort.direction) {
        params.ordering =
          `${this.sort.direction === 'asc' ? '' : '-'}${this.sort.active}`;
      }
  
      // Add filtering
      const filterValue = this.filterSubject.value;
      if (filterValue) {
        params.query = filterValue;
      }
  
      // Use the async service method
      const response = await this.apiService.get<ProductListResponse>('product', params);
  
      if (response) {
        // Initialize dataSource if not already initialized
        if (!this.dataSource) {
          this.dataSource = new MatTableDataSource<Product>();
        }
  
        // Assign data and update total records
        this.dataSource.data = response.objects;
        this.totalProducts = response.meta.total_count;
      }
    } catch (error) {
      console.error('Error loading products', error);
    } finally {
      this.isLoading = false;
    }
  }
  

  
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterSubject.next(filterValue);
  }


  


  editProduct(product: Product): void {
    const dialogRef = this.dialog.open(UpdateBrokerModalComponent, {
      width: '600px',
      data:product,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
       // this.fetchProducts();
      }
    });
  }

  viewProductDetails(product: Product): void {


  }


  async deleteProduct(product: Product): Promise<void | any> {
    // Confirm deletion
    const confirmDelete = window.confirm(`Are you sure you want to delete details for ${product.title}?`);
    
    if (confirmDelete) {
      try {
        // Perform delete request
        const endpoint = `broker/${product.id}/`;
        const result = await this.apiService.delete<void>(endpoint);
        this.dataResp = result;
        if (this.dataResp.status === 'error') {
          
          this.snackBar.open(this.dataResp.message, 'Close', { duration: 3000 });
        } else {
          this.snackBar.open('Details deleted successfully!', 'Close', { duration: 3000 });
          //this.fetchProducts();
        }
        
      } catch (error) {
        console.error('Error deleting admin:', error);
        throw error;
      }
    }
}


openAddProductModal(){
 const dialogRef = this.dialog.open(AddProductModalComponent, {
                  width: '1200px',
                });
              
                dialogRef.afterClosed().subscribe((result) => {
                  if (result) {
                    this.loadProducts();
                  }
                });
}

// Checkbox selection methods
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected === numRows;
}

toggleAllRows() {
  this.isAllSelected() 
    ? this.selection.clear() 
    : this.selection.select(...this.dataSource.data);
}

toggleProductStatus(product: Product) {
  // Toggle enabled status
  product.enabled = !product.enabled;
  // Call API to update
}


}
 