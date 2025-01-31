import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../services/api.service';
import { ToastrService } from '../services/toastr.service';
import { AddBrokerModalComponent } from '../modals/add-broker-modal/add-broker-modal.component';
import { UpdateBrokerModalComponent } from '../modals/update-broker-modal/update-broker-modal.component';
import { CustomerDetailsModalComponent } from '../modals/customer-details-modal/customer-details-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';

export interface ProductVariant {
  id: number;
  name: string;
  price: number;
  product: string;
  resource_uri: string;
  questions?: any[];
  claim_questions?: any[];
}

interface ProductVariantListResponse {
  meta: {
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total_count: number;
  };
  objects:  ProductVariant[];
  
}

interface ProductVariantListParams {
  offset: number;
  limit: number;
  ordering?: string;
  search?: string;
}



@Component({
  selector: 'app-product-variants',
  templateUrl: './product-variants.component.html',
  styleUrls: ['./product-variants.component.scss']
})
export class ProductVariantsComponent implements OnInit {

  displayedColumns: string[] = [
    'resource_uri',
    'name',
    'questions',
    'claim_questions',
    'price',
    'product',
    'action'
  ];
  
   
          totalProducts = 0;
          isLoading = true;
          
    
  
          filterSubject = new BehaviorSubject<string>('');
          selection = new SelectionModel<ProductVariant>(true, []);
  
         // Pagination properties
          currentPage: number = 0;
          recordsPerPage: number = 10; // Adjust as needed
          totalRecords: number = 0;
          hasPreviousPage: boolean = false;
  
          totalRecord: any;
          rendered: any;
          recordsLeft: any;
        
          // Data properties
          products: ProductVariant[] = [];
          dataSource!: MatTableDataSource<ProductVariant>;
  
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
        this.sort.sortChange.subscribe(() => this.loadProductVariants());
        this.paginator.page.subscribe(() => this.loadProductVariants());
        this.filterSubject.subscribe(() => this.loadProductVariants());
        
        await this.loadProductVariants();
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
            tap(() => this.loadProductVariants())
          ).subscribe();
    
          // Initial load
          this.loadProductVariants();
        }
      }
    
      async loadProductVariants() {
        this.isLoading = true;
      
        try {
          const params: ProductVariantListParams = {
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
            params.search = filterValue;
          }
      
          // Use the async service method
          const response = await this.apiService.get<ProductVariantListResponse>('productvariant', params);
      
          if (response) {
            // Initialize dataSource if not already initialized
            if (!this.dataSource) {
              this.dataSource = new MatTableDataSource<ProductVariant>();
            }
      
            // Assign data and update total records
            this.dataSource.data = response.objects;
            this.totalProducts = response.meta.total_count;
          }else{
            console.log("Nothing fetched")
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

      
      openAddProductModal(){

      }


        editProduct(product: ProductVariant): void {
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
      
        viewProductDetails(product: ProductVariant): void {
      
      
        }
      
      
        async deleteProduct(product: ProductVariant): Promise<void | any> {
          // Confirm deletion
          const confirmDelete = window.confirm(`Are you sure you want to delete details for ${product.name}?`);
          
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
      
      

}
