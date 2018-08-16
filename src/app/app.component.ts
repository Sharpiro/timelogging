import { Component, OnInit } from '@angular/core';
import { TimeloggingService } from './shared/timelogging.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  opened = true
  sidenavPropertyName = "sidenavStatus"

  constructor(public snackBar: MatSnackBar, private timeloggingService: TimeloggingService) { }

  async ngOnInit() {
    const sidenavStatus = localStorage.getItem(this.sidenavPropertyName)
    if (!sidenavStatus) return
    this.opened = sidenavStatus === "true"

    try {
      const tasksTableExistPromise = await this.timeloggingService.tasksTablesExists()
      const logsTableExistsPromise = await this.timeloggingService.logsTablesExists()
      const categoriesTableExistsPromise = await this.timeloggingService.categoriesTablesExists()

      if (!(await tasksTableExistPromise)) throw new Error(`table '${this.timeloggingService.tasksTableName}' does not exist @ '${this.timeloggingService.tasksTableUrl}`)
      if (!(await logsTableExistsPromise)) throw new Error(`table '${this.timeloggingService.logsTableName}' does not exist @ '${this.timeloggingService.logsTableUrl}`)
      if (!(await categoriesTableExistsPromise)) throw new Error(`table '${this.timeloggingService.categoriesTableName}' does not exist @ '${this.timeloggingService.categoriesTableUrl}`)
    } catch (ex) {
      this.snackBar.open(ex.message, undefined, { duration: 5000 })
      console.error(ex)
    }
  }

  toggle() {
    this.opened = !this.opened
    localStorage.setItem(this.sidenavPropertyName, this.opened.toString())
  }
}
