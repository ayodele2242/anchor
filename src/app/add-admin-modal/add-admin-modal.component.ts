import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-admin-modal',
  template: `
    <h2 mat-dialog-title>Add Admin</h2>
    <mat-dialog-content>
      <form (ngSubmit)="onAddAdmin()">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="font-weight: bold; padding: 8px;">First Name:</td>
            <td style="padding: 8px;">
              <input [(ngModel)]="adminData.first_name" name="first_name" required>
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px;">Last Name:</td>
            <td style="padding: 8px;">
              <input [(ngModel)]="adminData.last_name" name="last_name" required>
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px;">Email:</td>
            <td style="padding: 8px;">
              <input [(ngModel)]="adminData.email" name="email" type="email" required>
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px;">Password:</td>
            <td style="padding: 8px;">
              <input [(ngModel)]="adminData.password" name="password" type="password" required>
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px;">Phone:</td>
            <td style="padding: 8px;">
              <input [(ngModel)]="adminData.phone" name="phone" required>
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px;">NIN:</td>
            <td style="padding: 8px;">
              <input [(ngModel)]="adminData.nin" name="nin" required>
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px;">Wallet Balance:</td>
            <td style="padding: 8px;">
              <input [(ngModel)]="adminData.wallet_balance" name="wallet_balance" type="number" required>
            </td>
          </tr>
        </table>
        <div style="text-align: center; margin-top: 16px;">
          <button 
            mat-raised-button 
            color="primary" 
            type="submit" 
            [disabled]="isLoading">
            <span *ngIf="!isLoading">Add Admin</span>
            <span *ngIf="isLoading">Adding...</span>
          </button>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close [disabled]="isLoading">Cancel</button>
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
export class AddAdminModalComponent {
  adminData = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    nin: '',
    wallet_balance: '',
    resource_uri: '',
    
  };

  dataResp: any = [];
  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<AddAdminModalComponent>,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  async onAddAdmin(): Promise<void> {
    this.isLoading = true;
    try {
      const data = await this.apiService.post('admin/', this.adminData);

    
      if (data) {
        this.dataResp = data;
       
        if (this.dataResp.status === 'error') {
          //console.log("backend response", this.dataResp)
          this.snackBar.open(this.dataResp.message || 'Failed to add admin.', 'Close', { duration: 3000 });
        } else {
          this.snackBar.open('Admin added successfully!', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        }
      }
    } catch (error: any) {
      console.log('server error: ',error.message)
      this.snackBar.open('Error adding admin. Please try again.', 'Close', { duration: 3000 });
    } finally {
      this.isLoading = false;
    }
  }
}
