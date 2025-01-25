import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-broker-modal',
  template: `
    <h2 mat-dialog-title>Add Broker</h2>
    <mat-dialog-content>
      <form (ngSubmit)="onAddBroker()">
      <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="font-weight: bold; padding: 8px;">First Name:</td>
            <td style="padding: 8px;">
              <input [(ngModel)]="brokerData.first_name" name="first_name" required />
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px;">Last Name:</td>
            <td style="padding: 8px;">
              <input [(ngModel)]="brokerData.last_name" name="last_name" required />
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px;">Email:</td>
            <td style="padding: 8px;">
              <input [(ngModel)]="brokerData.email" name="email" type="email" required />
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px;">Phone:</td>
            <td style="padding: 8px;">
              <input [(ngModel)]="brokerData.phone" name="phone" required />
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px;">NIN:</td>
            <td style="padding: 8px;">
              <input [(ngModel)]="brokerData.nin" name="nin" required />
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
              <input type="file" (change)="onUriSelect($event)" accept="image/*" />
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
            <span *ngIf="!isLoading">Add Broker</span>
            <span *ngIf="isLoading">Adding...</span>
          </button>

          <button mat-button mat-dialog-close [disabled]="isLoading">Cancel</button>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      
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
      margin: 8px;
    }
  `],
})
export class AddBrokerModalComponent {
  brokerData = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    nin: '',
    naicom_certificate: '',
    avatar: '',
    resource_uri: '',
  };

  dataResp: any = [];
  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<AddBrokerModalComponent>,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  onFileSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.brokerData.avatar = reader.result as string; // Convert to Base64
      };
      reader.readAsDataURL(file);
    }
  }

  onUriSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.brokerData.resource_uri = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onCertSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.brokerData.naicom_certificate = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async onAddBroker(): Promise<void> {
    this.isLoading = true;
    try {
      const data = await this.apiService.post('broker/', this.brokerData);

    
      if (data) {
        this.dataResp = data;
       
        if (this.dataResp.status === 'error') {
          //console.log("backend response", this.dataResp)
          this.snackBar.open(this.dataResp.message, 'Close', { duration: 3000 });
        } else {
          this.snackBar.open('Details added successfully!', 'Close', { duration: 3000 });
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
