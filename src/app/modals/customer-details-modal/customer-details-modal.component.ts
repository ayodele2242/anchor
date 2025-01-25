import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-customer-details-modal',
  template: `
    <h2 mat-dialog-title>Customer Details</h2>
    <mat-dialog-content>
      <!-- Avatar at the top center -->
      <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 20px; width: 100%;">
        <img [src]="data.avatar" alt="Avatar" style="border-radius: 50%; width: 80px; height: 80px; object-fit: cover;">
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="font-weight: bold; padding: 8px;">First Name:</td>
          <td style="padding: 8px;">{{ data.first_name }}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; padding: 8px;">Last Name:</td>
          <td style="padding: 8px;">{{ data.last_name }}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; padding: 8px;">Email:</td>
          <td style="padding: 8px;">{{ data.email }}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; padding: 8px;">Phone:</td>
          <td style="padding: 8px;">{{ data.phone }}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; padding: 8px;">NIN:</td>
          <td style="padding: 8px;">{{ data.nin }}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; padding: 8px;">User Type:</td>
          <td style="padding: 8px;">{{ data.user_type }}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; padding: 8px;">Last Login:</td>
          <td style="padding: 8px;">
            {{ formatDate(data.last_login) }}
          </td>
        </tr>
      </table>
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
      color: #ddd;
    }
    mat-dialog-content tr {
      color: #ddd;
    }
    mat-dialog-content tr:nth-child(even) {
      background-color: rgb(15, 16, 16);
    }
    mat-dialog-content tr:hover {
      background-color: rgb(46, 44, 44);
    }
    /* Avatar styling */
    mat-dialog-content img {
      border-radius: 50%;
      width: 80px;
      height: 80px;
      object-fit: cover;
    }
  `],
  providers: [DatePipe],
})
export class CustomerDetailsModalComponent {
  constructor(
    public dialogRef: MatDialogRef<CustomerDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datePipe: DatePipe
  ) {}

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'MMMM d, yyyy') || 'N/A';
  }
}
