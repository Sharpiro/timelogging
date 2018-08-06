import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatOptionModule, MatSelectModule, MatSidenavModule, MatIconModule, MatToolbarModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportingComponent } from './reporting/reporting.component';
import { TableService } from './shared/table.service';
import * as azure from '../assets/js/azure-storage.table';


const tableServiceFactory = () => {
  const tableName = "timelogging"
  const devCredentials = azure.generateDevelopmentStorageCredentials()
  const tableService = azure.createTableService(devCredentials)
  return new TableService(tableName, tableService)
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ReportingComponent
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
    MatToolbarModule
  ],
  providers: [
    { provide: TableService, useFactory: tableServiceFactory }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
