import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../../../material.module';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { AddUserDialogComponent } from '../add-user-dialog/add-user-dialog.component';
import { UserDto } from '../../../models/user';
import { ConfirmDialogService } from '../../../services/confirm-dialog.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MaterialModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  allUsers: UserDto[] = [];
  displayedUsers: UserDto[] = [];
  displayedColumns: string[] = [
    'username',
    'firstName',
    'lastName',
    'email',
    'actions',
  ];

  dataSource = new MatTableDataSource<UserDto>();
  loading: boolean = true;
  error: string | null = null; // Messaggio di errore

  pageSize: number = 5;
  pageIndex: number = 0;
  totalUsers: number = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.allUsers = data;
        this.totalUsers = this.allUsers.length;
        this.updateTable();
        this.loading = false; // Nascondi il caricamento
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load users'; // Imposta il messaggio di errore
        this.loading = false; // Nascondi il caricamento
      },
    });
  }

  updateTable(): void {
    const startIndex = this.pageIndex * this.pageSize;
    this.displayedUsers = this.allUsers.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateTable();
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Chiamata al servizio per aggiungere il nuovo utente
        this.userService.addUser(result).subscribe(() => {
          this.loadUsers(); // Ricarica la lista degli utenti
        });
      }
    });
  }

  deleteUser(userId: string): void {
    this.confirmDialogService
      .confirm(
        'Conferma Eliminazione',
        'Sei sicuro di voler eliminare questo utente?'
      )
      .subscribe((confirmed) => {
        if (confirmed) {
          this.userService.deleteUser(userId).subscribe(
            () => {
              this.loadUsers();
            },
            (error) => {
              this.error = "Impossibile eliminare l'utente";
              console.error(error);
            }
          );
        }
      });
  }
}
