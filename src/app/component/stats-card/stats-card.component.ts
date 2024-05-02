import { Component, Input } from '@angular/core';

export interface StatsCardModel {
  title: string;
  stats: number;
  icon: string;
  description: string;
  role: string;
}

@Component({
  selector: 'app-stats-card',
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.scss']
})

export class StatsCardComponent {
  @Input() props!: StatsCardModel;
}
