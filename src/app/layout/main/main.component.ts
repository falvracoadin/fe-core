import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  leftSidebarGrow: boolean = true;
  leftSidebarOpen: boolean = false;

  rightSidebarOpen: boolean = false;

  constructor() { }

  ngOnInit(): void {
    let leftSidebarGrow = localStorage.getItem('leftSidebarGrow');

    this.leftSidebarGrow = localStorage.getItem('leftSidebarGrow') === 'true';

    if (leftSidebarGrow === null) {
      this.leftSidebarGrow = true;
      localStorage.setItem('leftSidebarGrow', this.leftSidebarGrow.toString());
    }
  }

  leftSidebarGrowChange(event: boolean): void {
    this.leftSidebarGrow = event;
    localStorage.setItem('leftSidebarGrow', this.leftSidebarGrow.toString());
  }
}
