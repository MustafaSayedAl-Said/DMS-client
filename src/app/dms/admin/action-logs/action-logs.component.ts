import { Component, OnInit } from '@angular/core';
import { SignalrService } from '../signalr.service';

@Component({
  selector: 'app-action-logs',
  templateUrl: './action-logs.component.html',
  styleUrl: './action-logs.component.scss',
})
export class ActionLogsComponent implements OnInit {
  constructor(private signalRService: SignalrService) {}
  ngOnInit(): void {
    this.signalRService.startConnection();
    this.signalRService.addNotificationListener();
    this.signalRService.addBroadcastChartDataListener();
  }

  buttonClick() {
    alert(1)
    this.signalRService.broadcastChartData();
  }
}
