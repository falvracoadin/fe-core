import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-detail-spesialis',
  templateUrl: './detail-spesialis.component.html',
  styleUrls: ['./detail-spesialis.component.scss']
})
export class DetailSpesialisComponent implements OnInit {
  @Output() afterSave = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

}
