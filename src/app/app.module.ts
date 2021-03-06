import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import {
  MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatOptionModule, MatSelectModule,
  MatSidenavModule, MatIconModule, MatToolbarModule, MatDialogModule, ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher, MatTabsModule, MatTableModule, MatCardModule, MatProgressBarModule
} from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportingComponent } from './reporting/reporting.component';
import { TableService } from './shared/table.service';
import * as azure from '../assets/js/azure-storage.table';
import { TimeloggingService } from './shared/timelogging.service';
import { environment } from '../environments/environment';
import { AddTaskComponent } from './dashboard/add-task/add-task.component';
import { ModifyTaskComponent } from './reporting/modify-task/modify-task.component';
import { AddCategoryComponent } from './dashboard/add-category/add-category.component';
import { TasksComponent } from './tasks/tasks.component';
import { ProgressComponent } from './progress/progress.component';

const timeloggingServiceFactory: () => TimeloggingService = () => {
  console.log(environment.connectionString);
  const tableService = azure.createTableService(environment.connectionString)
  const tasksTableService = new TableService(environment.tasksTableName, tableService)
  const logsTableService = new TableService(environment.logsTableName, tableService)
  const categoriesTableService = new TableService(environment.categoriesTableName, tableService)
  return new TimeloggingService(tasksTableService, logsTableService, categoriesTableService)
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ReportingComponent,
    AddTaskComponent,
    ModifyTaskComponent,
    AddCategoryComponent,
    TasksComponent,
    ProgressComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatTableModule,
    MatCardModule,
    MatProgressBarModule
  ],
  providers: [
    { provide: TimeloggingService, useFactory: timeloggingServiceFactory },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }
  ],
  entryComponents: [AddTaskComponent, ModifyTaskComponent, AddCategoryComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
