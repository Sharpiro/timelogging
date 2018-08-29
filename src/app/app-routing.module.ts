import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportingComponent } from './reporting/reporting.component';
import { TasksComponent } from './tasks/tasks.component';
import { ProgressComponent } from './progress/progress.component';

const routes: Routes = [
    { path: "dashboard", component: DashboardComponent },
    { path: "progress", component: ProgressComponent },
    { path: "reporting", component: ReportingComponent },
    { path: "tasks", component: TasksComponent },
    { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
