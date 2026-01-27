import { Component, inject, ViewChild, AfterViewInit, computed, Signal } from '@angular/core';
import { PassportService } from '../_services/passport-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MissionService } from '../_services/mission-service';
import { Mission } from '../_models/mission';
import { MissionFilter } from '../_models/mission-filter';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-missions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './missions.html',
  styleUrl: './missions.scss',
})
export class Missions implements AfterViewInit {
  private _missionService = inject(MissionService);
  private _passportService = inject(PassportService);

  isSignin: Signal<boolean>;

  filter: MissionFilter = {};
  dataSource = new MatTableDataSource<Mission>([]);

  baseColumns = ['name', 'description', 'chief_display_name', 'crew_count', 'status', 'created_at', 'updated_at'];
  displayedColumns = computed(() => {
    return this.isSignin() ? [...this.baseColumns, 'actions'] : this.baseColumns;
  });

  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.isSignin = computed(() => this._passportService.isSignin());

    this.filter = this._missionService.filter;
    this.onSubmit();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async onSubmit() {
    this.isLoading = true;
    try {
      const results = await this._missionService.getByFilter(this.filter);
      this.dataSource.data = results;
    } catch (e) {
      console.error('Error fetching missions:', e);
    } finally {
      this.isLoading = false;
    }
  }

  clearFilter() {
    this.filter = { name: undefined, status: undefined };
    this.onSubmit();
  }
}
