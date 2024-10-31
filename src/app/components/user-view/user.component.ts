import { Component, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { UserListComponent } from '../users/user-list/user-list.component';
import { ProductListComponent } from "../products/product-list/product-list.component";

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [MaterialModule, UserListComponent, ProductListComponent], // Aggiungi il componente qui
  templateUrl: './user.component.html',

})
export class UserViewComponent {}
