import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-customer-update-modal',
  template: `
    <h2 mat-dialog-title>Update Customer</h2>
    <mat-dialog-content>
      <form (ngSubmit)="onUpdateAdmin()">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="font-weight: bold; padding: 8px;">First Name:</td>
            <td style="padding: 8px;">
              <input [(ngModel)]="data.first_name" name="first_name" required>
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px;">Last Name:</td>
            <td style="padding: 8px;">
              <input [(ngModel)]="data.last_name" name="last_name" required>
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px;">Email:</td>
            <td style="padding: 8px;">
              <input [(ngModel)]="data.email" name="email" type="email" required>
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px;">Phone:</td>
            <td style="padding: 8px;">
              <input [(ngModel)]="data.phone" name="phone" required>
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px;">NIN:</td>
            <td style="padding: 8px;">
              <input [(ngModel)]="data.nin" name="nin" required>
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px;">Wallet Balance:</td>
            <td style="padding: 8px;">
              <input [(ngModel)]="data.wallet_balance" name="wallet_balance" type="number">
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px;">Last Login:</td>
            <td style="padding: 8px;">
              <input [(ngModel)]="data.last_login" name="last_login" type="datetime-local">
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px;">Upload Image:</td>
            <td style="padding: 8px;">
              <input type="file" (change)="onFileChange($event)">
            </td>
          </tr>
          <tr *ngIf="imagePreview">
            <td style="font-weight: bold; padding: 8px;">Image Preview:</td>
            <td style="padding: 8px;">
              <img [src]="imagePreview" alt="Image Preview" style="max-width: 100%; max-height: 200px;">
            </td>
          </tr>
        </table>
        <div style="text-align: center; margin-top: 16px;">
          <button mat-button mat-raised-button color="primary" type="submit">Update</button>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
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
export class CustomerUpdateModalComponent {
  imagePreview: string | ArrayBuffer | null = null; // For previewing the uploaded image
  imageBase64: string | null = null; // For storing Base64 encoded image

  constructor(
    public dialogRef: MatDialogRef<CustomerUpdateModalComponent>,
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

  onUpdateAdmin(): void {
    const updatedData = {
      first_name: this.data.first_name,
      last_name: this.data.last_name,
      email: this.data.email,
      phone: this.data.phone,
      id: this.data.id,
      nin: this.data.nin,
      wallet_balance: this.data.wallet_balance,
      resource_uri: this.imageBase64,
    };

    this.apiService.patch(`customer/${this.data.id}/`, updatedData).then(
      (response: any) => {
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
        this.snackBar.open('Error updating details. Please try again.', 'Close', { duration: 3000 });
        
      }
    );
  }
}
