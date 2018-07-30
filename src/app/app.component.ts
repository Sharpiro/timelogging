import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  opened = true
  sidenavPropertyName = "sidenavStatus"
  
  ngOnInit() {
    const sidenavStatus = localStorage.getItem(this.sidenavPropertyName)
    if (!sidenavStatus) return
    this.opened = sidenavStatus === "true"
  }

  toggle() {
    this.opened = !this.opened
    localStorage.setItem(this.sidenavPropertyName, this.opened.toString())
  }
}
