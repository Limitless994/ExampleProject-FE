import { Component, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { AddUserDialogComponent } from '../users/add-user-dialog/add-user-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UserListComponent } from '../users/user-list/user-list.component';
import { ProductListComponent } from "../products/product-list/product-list.component";

@Component({
  selector: 'app-admin-view',
  standalone: true,
  imports: [MaterialModule, UserListComponent, ProductListComponent], // Aggiungi il componente qui
  templateUrl: './admin-view.component.html',
})
export class AdminViewComponent {
  @ViewChild(UserListComponent) userListComponent!: UserListComponent;

  constructor() {}

}
