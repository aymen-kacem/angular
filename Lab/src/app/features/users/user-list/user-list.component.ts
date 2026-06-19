import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/core/services/user.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { UserFormComponent } from '../user-form/user-form.component';
import { User } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['avatar', 'fullName', 'email', 'role', 'actions'];
  dataSource = new MatTableDataSource<User>([]);
  loading = false;

  totalUsers = 0;
  nbAdmins = 0;
  nbTeachers = 0;
  nbStudents = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private toastService: ToastService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (users) => {
        this.dataSource.data = users;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.totalUsers = users.length;
        this.nbAdmins = users.filter(u => u.role === 'admin').length;
        this.nbTeachers = users.filter(u => u.role === 'teacher').length;
        this.nbStudents = users.filter(u => u.role === 'student').length;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'teacher': return 'Enseignant';
      case 'student': return 'Étudiant';
      default: return role;
    }
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newUser = {
          ...result,
          uid: result.uid || ''
        };
        this.userService.create(newUser).subscribe({
          next: () => {
            this.toastService.showSuccess('Profil utilisateur créé avec succès !');
            this.fetchUsers();
          }
        });
      }
    });
  }

  openEditDialog(user: User): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '500px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.update(user.id, result).subscribe({
          next: () => {
            this.toastService.showSuccess('Profil utilisateur mis à jour avec succès !');
            this.fetchUsers();
          }
        });
      }
    });
  }

  deleteUser(user: User): void {
    if (user.role === 'admin' && user.email === 'aymenkacem@gmail.com') {
      this.toastService.showError("Impossible de supprimer le compte administrateur principal.");
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: "Supprimer l'utilisateur",
        message: `Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.fullName} ?`
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.userService.delete(user.id).subscribe({
          next: () => {
            this.toastService.showSuccess('Utilisateur supprimé.');
            this.fetchUsers();
          }
        });
      }
    });
  }
}
