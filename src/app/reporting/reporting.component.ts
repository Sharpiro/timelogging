import { Component, OnInit } from '@angular/core';

const TableStorage = (<any>window).AzureStorage.Table

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.css']
})
export class ReportingComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    console.log(TableStorage);
    var tableSvc = TableStorage.createTableService("devstoreaccount1", "Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==");
    
    // const blobService = azure.createBlobService()
  }

}
