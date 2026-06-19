import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { CategoryService } from 'src/app/core/services/category.service';
import { EventService } from 'src/app/core/services/event.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { CategoryFormComponent } from '../category-form/category-form.component';
import { Category } from 'src/app/core/models/category.model';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'eventsCount', 'actions'];
  dataSource = new MatTableDataSource<Category>([]);
  loading = false;

  totalEvents = 0;
  mostUsedCategory = '—';
  private eventCountMap: Record<string, number> = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private categoryService: CategoryService,
    private eventService: EventService,
    private toastService: ToastService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  get totalCategories(): number {
    return this.dataSource.data.length;
  }

  getEventCount(name: string): number {
    return this.eventCountMap[name] || 0;
  }

  fetchCategories(): void {
    this.loading = true;
    forkJoin({
      categories: this.categoryService.getAll(),
      events: this.eventService.getAll()
    }).subscribe({
      next: ({ categories, events }) => {
        this.eventCountMap = {};
        events.forEach(e => {
          if (e.category) {
            this.eventCountMap[e.category] = (this.eventCountMap[e.category] || 0) + 1;
          }
        });
        this.totalEvents = events.length;

        let max = -1;
        let most = '—';
        categories.forEach(c => {
          const n = this.eventCountMap[c.name] || 0;
          if (n > max) { max = n; most = c.name; }
        });
        this.mostUsedCategory = categories.length ? most : '—';

        this.dataSource.data = categories;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CategoryFormComponent, {
      width: '420px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.create(result).subscribe({
          next: () => {
            this.toastService.showSuccess('Catégorie créée avec succès !');
            this.fetchCategories();
          }
        });
      }
    });
  }

  openEditDialog(category: Category): void {
    const dialogRef = this.dialog.open(CategoryFormComponent, {
      width: '420px',
      data: category
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.update(category.id, result).subscribe({
          next: () => {
            this.toastService.showSuccess('Catégorie mise à jour avec succès !');
            this.fetchCategories();
          }
        });
      }
    });
  }

  deleteCategory(category: Category): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Supprimer la catégorie',
        message: `Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}" ?`
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.categoryService.delete(category.id).subscribe({
          next: () => {
            this.toastService.showSuccess('Catégorie supprimée.');
            this.fetchCategories();
          }
        });
      }
    });
  }
}
