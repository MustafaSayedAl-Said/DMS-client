import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private hubConnection: signalR.HubConnection;

  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7030/notificationHub',{accessTokenFactory:()=>{
        return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxNSIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwiZ2l2ZW5fbmFtZSI6IkFkbWluIiwicm9sZSI6IkFkbWluIiwibmJmIjoxNzI1ODEyNTM5LCJleHAiOjE3MjY2NzY1MzksImlhdCI6MTcyNTgxMjUzOSwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzAzMC8iLCJhdWQiOiJodHRwczovL2dpdGh1Yi5jb20vTXVzdGFmYVNheWVkQWwtU2FpZCJ9.QlbtQpmTvPcnKbW8SdhqwpUYGtzf1BdEJPvieaGRudM"
      }})
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))

      .catch((err) => console.log('Error while starting connection: ' + err));
  }

  addNotificationListener() {
    this.hubConnection.on('ReceiveNotification', (message: string) => {   
      console.log('New Action: ' + message);
    });
  }
  public broadcastChartData = () => {
    const data = 'Hello world';

    this.hubConnection
      .invoke('NotifyAdmin', data)
      .catch((err) => console.error(err));
  };

  public addBroadcastChartDataListener = () => {
    this.hubConnection.on('broadcastchartdata', (data) => {
      console.log('Testing');
    });
  };
  // public addBroadcastChartDataListener = () => {
  //   this.hubConnection.on('NotifyAdmin', (data) => {
  //     this.bradcastedData = data;
  //   })
  // }

  constructor() {}
}
