import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-admin-modal',
  template: `
    <h2 mat-dialog-title>Update Admin</h2>
    <mat-dialog-content>
      <form (ngSubmit)="onUpdateAdmin()">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="font-weight: bold; padding: 8px; ">First Name:</td>
            <td style="padding: 8px; ">
              <input [(ngModel)]="data.first_name" name="first_name" required>
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px; ">Last Name:</td>
            <td style="padding: 8px; ">
              <input [(ngModel)]="data.last_name" name="last_name" required>
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px; ">Email:</td>
            <td style="padding: 8px; ">
              <input [(ngModel)]="data.email" name="email" required>
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px; ">Phone:</td>
            <td style="padding: 8px; ">
              <input [(ngModel)]="data.phone" name="phone" required>
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px; ">NIN:</td>
            <td style="padding: 8px; ">
              <input [(ngModel)]="data.nin" name="nin" required>
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px; ">Wallet Balance:</td>
            <td style="padding: 8px; ">
              <input [(ngModel)]="data.wallet_balance" name="wallet_balance" type="number">
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px; ">Last Login:</td>
            <td style="padding: 8px; ">
              <input [(ngModel)]="data.last_login" name="last_login" type="datetime-local">
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
  `],
})
export class UpdateAdminModalComponent {
  constructor(
    public dialogRef: MatDialogRef<UpdateAdminModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  onUpdateAdmin(): void {
    const updatedData = {
      first_name: this.data.first_name,
      last_name: this.data.last_name,
      email: this.data.email,
      phone: this.data.phone,
      id: this.data.id,
      nin: this.data.nin,
      wallet_balance: this.data.wallet_balance, // Added wallet balance
    };
  
    this.apiService.patch(`admin/${this.data.id}/`, updatedData).then(
      (response: any) => {
        if (response && typeof response === 'object') {
          if (response.status === 'error') {
            this.snackBar.open(response.message || 'An error occurred.', 'Close', { duration: 3000 });
          } else {
            this.snackBar.open('Admin updated successfully!', 'Close', { duration: 3000 });
            this.dialogRef.close(true); // Close the dialog and indicate update success
          }
        } else {
          this.snackBar.open('Unexpected response from the server.', 'Close', { duration: 3000 });
        }
      },
      (error) => {
        this.snackBar.open('Error updating admin. Please try again.', 'Close', { duration: 3000 });
        console.error('Error:', error); // Log the error for debugging
      }
    );
  }
  
  
}
