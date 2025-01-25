import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-broker-modal',
  template: `
    <h2 mat-dialog-title>Update Broker</h2>
    <mat-dialog-content>
    <form (ngSubmit)="onUpdateBroker()">
      <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="font-weight: bold; padding: 8px;">First Name:</td>
            <td style="padding: 8px;">
              <input [(ngModel)]="data.first_name" name="first_name" required />
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px;">Last Name:</td>
            <td style="padding: 8px;">
              <input [(ngModel)]="data.last_name" name="last_name" required />
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px;">Email:</td>
            <td style="padding: 8px;">
              <input [(ngModel)]="data.email" name="email" type="email" required />
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px;">Phone:</td>
            <td style="padding: 8px;">
              <input [(ngModel)]="data.phone" name="phone" required />
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px;">NIN:</td>
            <td style="padding: 8px;">
              <input [(ngModel)]="data.nin" name="nin" required />
            </td>
          </tr>
          
          <tr>
            <td style="font-weight: bold; padding: 8px;">Avatar:</td>
            <td style="padding: 8px;">
              <input type="file" (change)="onFileSelect($event)" accept="image/*" />
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px;">Resource Uri:</td>
            <td style="padding: 8px;">
              <input type="file" (change)="onFileChange($event)" accept="image/*" />
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px;">NAICOM Certificate:</td>
            <td style="padding: 8px;">
            <input type="file" (change)="onCertSelect($event)" accept="image/*" />
            </td>
          </tr>
        </table>
        <div style="text-align: center; margin-top: 16px;">
          <button 
            mat-raised-button 
            color="primary" 
            type="submit" 
            [disabled]="isLoading">
            <span *ngIf="!isLoading">Update</span>
            <span *ngIf="isLoading">Updating...</span>
          </button>

          <button mat-button mat-dialog-close [disabled]="isLoading">Cancel</button>
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
    mat-dialog-content input {
      width: 100%;
      box-sizing: border-box;
    }
    button {
      margin-top: 16px;
    }
    img {
      display: block;
      margin-top: 8px;
      border: 1px solid #ddd;
      padding: 4px;
      border-radius: 4px;
    }
  `],
})
export class UpdateBrokerModalComponent {
  imagePreview: string | ArrayBuffer | null = null; // For previewing the uploaded image
  imageBase64: string | null = null; // For storing Base64 encoded image
  avatarImageBase64: string | null = null;
  certImageBase64: string | null = null;
  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<UpdateBrokerModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.imagePreview = reader.result;
        this.imageBase64 = (reader.result as string).split(',')[1]; // Extract Base64 string
      };

      reader.readAsDataURL(file);
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        //this.imagePreview = reader.result;
        this.avatarImageBase64 = (reader.result as string).split(',')[1];
      };

      reader.readAsDataURL(file);
    }
  }

 

  onCertSelect(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        //this.imagePreview = reader.result;
        this.certImageBase64 = (reader.result as string).split(',')[1];
      };

      reader.readAsDataURL(file);
    }
  }

  onUpdateBroker(): void {

    this.isLoading = true;
   const updatedData = {
    first_name: this.data.first_name,
    last_name: this.data.last_name,
    email: this.data.email,
    phone: this.data.phone,
    id: this.data.id,
    nin: this.data.nin,
      naicom_certificate: this.data.naicom_certificate,
      avatar: this.avatarImageBase64,
      resource_uri: this.imageBase64,
    };
  
  

    this.apiService.patch(`broker/${this.data.id}/`, updatedData).then(
      (response: any) => {
        this.isLoading = false;
        if (response && typeof response === 'object') {
          if (response.status === 'error') {
            this.snackBar.open(response.message || 'An error occurred.', 'Close', { duration: 3000 });
          } else {
            this.snackBar.open('Details updated successfully!', 'Close', { duration: 3000 });
            this.dialogRef.close(true);
          }
        } else {
          this.snackBar.open('Unexpected response from the server.', 'Close', { duration: 3000 });
        }
      },
      (error) => {
        this.isLoading = false;
        this.snackBar.open('Error updating details. Please try again.', 'Close', { duration: 3000 });
        
      }
    );
  }
}
