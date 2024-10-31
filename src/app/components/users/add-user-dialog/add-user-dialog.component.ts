import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../services/api.service';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule],
})
export class AddUserDialogComponent {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddUserDialogComponent>,
    private apiService: ApiService
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const newUser = this.userForm.value;
      this.apiService.post('public/register', newUser).subscribe({
        next: () => {
          console.log('User added successfully');
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Failed to add user:', err);
        },
      });
    }
  }
}
