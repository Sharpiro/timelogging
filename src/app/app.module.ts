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
import { TimeloggingService } from './shared/timelogging.service';
import { environment } from '../environments/environment';

const timeloggingServiceFactory: () => TimeloggingService = () => {
  const tasksTableName = "tasks"
  const logsTableName = "logs"
  // const connectionString = "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;"
  // const connectionString = "DefaultEndpointsProtocol=https;AccountName=timelogging;AccountKey=KMWJ8nhwE1RAlw+o0/wyytD/t8lp2SPF0CYZLiiW5sEGijCBxaCh8ZLWfwH2oMp8oUHA6DZnFx3hvM6/9q/k4Q==;EndpointSuffix=core.windows.net"
  // const connectionString = azure.generateDevelopmentStorageCredentials()
  const connectionString = environment.connectionString
  console.log(connectionString);

  const tableService = azure.createTableService(connectionString)

  if (environment.production) {

  }
  const tasksTableService = new TableService(tasksTableName, tableService)
  const logsTableService = new TableService(logsTableName, tableService)
  return new TimeloggingService(tasksTableService, logsTableService)
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
    { provide: TimeloggingService, useFactory: timeloggingServiceFactory }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
