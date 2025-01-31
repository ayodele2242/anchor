import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-add-product-modal',
  template: `
    <h2 mat-dialog-title>Add New Product</h2>
    <mat-dialog-content>
      <form [formGroup]="productForm" (ngSubmit)="onAddProduct()">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="font-weight: bold; padding: 8px;">Title:</td>
            <td style="padding: 8px;">
              <div class="">
              <mat-form-field appearance="outline" style="width: 100%;">
                <input matInput formControlName="title" required />
              </mat-form-field>
              </div>
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px;">Variants:</td>
            <td style="padding: 8px;">
              <mat-form-field appearance="outline" style="width: 100%;">
                <mat-label>Variants</mat-label>
                <mat-select formControlName="variants" multiple>
                  <mat-option *ngFor="let variant of productVariants" [value]="variant.id">
                    {{ variant.name }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </td>
          </tr><!--- {{ variant.price | currency }}-->
          <tr>
            <td style="font-weight: bold; padding: 8px;">Icon:</td>
            <td style="padding: 8px;">
              <input type="file"  (change)="onFileSelect($event)" accept="image/*" />
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px;">Status:</td>
            <td style="padding: 8px;">
              <mat-form-field appearance="outline" style="width: 100%;">
                <mat-label>Status</mat-label>
                <mat-select formControlName="status" required>
                  <mat-option *ngFor="let option of statusOptions" [value]="option.value">
                    {{ option.label }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px;">Image:</td>
            <td style="padding: 8px;">
              <input type="file" (change)="onUriSelect($event)" accept="image/*" />
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px;">Summary:</td>
            <td style="padding: 8px;">
              <mat-form-field appearance="outline" style="width: 100%;">
                <textarea
                  matInput
                  formControlName="summary"
                  rows="4"
                  required
                ></textarea>
              </mat-form-field>
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px;">Description:</td>
            <td style="padding: 8px;">
              <angular-editor
                formControlName="description"
                [config]="editorConfig"
              ></angular-editor>
            </td>
          </tr>
         
          <tr>
            <td style="font-weight: bold; padding: 8px;">Duration:</td>
            <td style="padding: 8px;">
              <div class="duration-inputs">
                <mat-form-field appearance="outline">
                  <mat-label>Days</mat-label>
                  <input
                    matInput
                    type="number"
                    formControlName="days"
                    min="0"
                    required
                  />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Hours</mat-label>
                  <input
                    matInput
                    type="number"
                    formControlName="hours"
                    min="0"
                    max="23"
                    required
                  />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Minutes</mat-label>
                  <input
                    matInput
                    type="number"
                    formControlName="minutes"
                    min="0"
                    max="59"
                    required
                  />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Seconds</mat-label>
                  <input
                    matInput
                    type="number"
                    formControlName="seconds"
                    min="0"
                    max="59"
                    required
                  />
                </mat-form-field>
              </div>
            </td>
          </tr>
        </table>
        <div style="text-align: center; margin-top: 16px;">
          <button
            mat-raised-button
            color="primary"
            type="submit"
            [disabled]="isLoading || !productForm.valid"
          >
            <span *ngIf="!isLoading">Add Product</span>
            <span *ngIf="isLoading">Adding...</span>
          </button>

          <button mat-button mat-dialog-close [disabled]="isLoading">
            Cancel
          </button>
        </div>
      </form>
    </mat-dialog-content>
  `,
  styles: [`
    mat-dialog-content table {
      width: 100%;
    }
    mat-dialog-content td {
      padding: 8px;
    }
    .duration-inputs {
      display: flex;
      gap: 8px;
    }
    .duration-inputs mat-form-field {
      flex: 1;
    }
    button {
      margin: 8px;
    }
    :host ::ng-deep .angular-editor-textarea {
      min-height: 150px;
    }
    :host ::ng-deep .angular-editor .angular-editor-toolbar {
    background-color: white;
    border: 1px solid #ccc;
    padding: 0.5rem;
  }

  :host ::ng-deep .angular-editor .angular-editor-toolbar button {
    background-color: rgb(34, 54, 120);
    margin: 2px;
    padding: 4px;
    min-width: 30px;
    float: left;
    border: 1px solid rgb(34, 54, 120);
    border-radius: 4px;
  }

  :host ::ng-deep .angular-editor .angular-editor-toolbar button:hover {
    background-color: rgb(44, 64, 130);
    cursor: pointer;
  }

  :host ::ng-deep .angular-editor .angular-editor-toolbar button[active] {
    background-color: rgb(24, 44, 100);
  }

  :host ::ng-deep .angular-editor .angular-editor-toolbar button svg {
    fill: white;
    width: 20px;
    height: 20px;
  }

  :host ::ng-deep .angular-editor-textarea {
    padding: 1rem;
    border: 1px solid #ccc;
    min-height: 150px;
  }

  :host ::ng-deep .angular-editor-wrapper {
    background-color: white;
    color: black;
  }
  `],
})
export class AddProductModalComponent implements OnInit {
  productForm!: FormGroup;
  dataResp: any = [];
  isLoading = false;
  productVariants: any[] = [];
  statusOptions = [
    { value: 'true', label: 'Enable' },
    { value: 'false', label: 'Disable' }
    
  ];

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '200px',
    minHeight: '150px',
    placeholder: 'Enter description here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    toolbarPosition: 'top',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['fontName'],
      ['fontSize']
    ],
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' }
    ],
    customClasses: [],
    sanitize: false,

    outline: true,
    uploadUrl: '', // If you need image upload functionality
    rawPaste: false,
    showToolbar: true,
    enableToolbar: true
  };
  constructor(
    public dialogRef: MatDialogRef<AddProductModalComponent>,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadProductVariants();
  }

  private initializeForm(): void {
    this.productForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      summary: new FormControl('', Validators.required),
      enabled: new FormControl(true, Validators.required),
      days: new FormControl(0, [Validators.required, Validators.min(0)]),
      hours: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(23)]),
      minutes: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(59)]),
      seconds: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(59)]),
      icon: new FormControl(''),
      image: new FormControl(''),
      variants: new FormControl([]),
    });
  }

  async loadProductVariants(): Promise<void> {
    this.isLoading = true;
    try {
      const response = await this.apiService.get<any>('productvariant');
      this.productVariants = response.objects.map((variant: any) => ({
        id: variant.id,
        name: variant.name,
        price: variant.price,
      }));
    } catch (error) {
      console.error('Error loading product variants:', error);
    } finally {
      this.isLoading = false;
    }
  }

  onFileSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // Extract the base64 string without the data URL prefix
        const base64String = (reader.result as string).split(',')[1];
        this.productForm.patchValue({ icon: base64String });
      };
      reader.readAsDataURL(file);
    }
  }
  
  onUriSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // Extract the base64 string without the data URL prefix
        const base64String = (reader.result as string).split(',')[1];
        this.productForm.patchValue({ image: base64String });
      };
      reader.readAsDataURL(file);
    }
  }

  private formatDuration(): string {
    const days = this.productForm.get('days')?.value || 0;
    const hours = this.productForm.get('hours')?.value || 0;
    const minutes = this.productForm.get('minutes')?.value || 0;
    const seconds = this.productForm.get('seconds')?.value || 0;
    
    // Pad numbers with leading zeros
    const paddedHours = hours.toString().padStart(2, '0');
    const paddedMinutes = minutes.toString().padStart(2, '0');
    const paddedSeconds = seconds.toString().padStart(2, '0');
    
    return `${days} ${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  }

  async onAddProduct(): Promise<void> {
    if (this.productForm.valid) {
      this.isLoading = true;
      try {
        const payload = {
          enabled: this.productForm.get('enabled')?.value === 'true',  // Convert string to boolean
          title: this.productForm.get('title')?.value,
          summary: this.productForm.get('summary')?.value,
          description: this.productForm.get('description')?.value,
          image: this.productForm.get('image')?.value || '',
          icon: this.productForm.get('icon')?.value || '',
          duration: this.formatDuration(),
          variants: this.productForm.get('variants')?.value,
        };

        const data = await this.apiService.post('product/', payload);

        if (data) {
          this.dataResp = data;
          if(this.dataResp.error){
            this.snackBar.open(this.dataResp.error, 'Close', { duration: 6000 });
          } else if (this.dataResp.status === 'error') {
            this.snackBar.open(this.dataResp.message, 'Close', { duration: 6000 });
          } else {
            this.snackBar.open('Product added successfully!', 'Close', { duration: 3000 });
            this.dialogRef.close(true);
          }
        }
      } catch (error: any) {
        console.error('Server error:', error.message);
        this.snackBar.open('Error adding product. Please try again.', 'Close', { duration: 3000 });
      } finally {
        this.isLoading = false;
      }
    }
  }
}