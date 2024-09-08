import { Component, OnInit } from '@angular/core';
import { SignalrService } from '../signalr.service';
import { ActionLog } from '../../../shared/Models/ActionLog';

@Component({
  selector: 'app-action-logs',
  templateUrl: './action-logs.component.html',
  styleUrl: './action-logs.component.scss',
})
export class ActionLogsComponent implements OnInit {
  actionLogs: ActionLog[] = [];

  constructor(private signalRService: SignalrService) {}
  ngOnInit(): void {
    this.signalRService.startConnection();
    this.signalRService.addNotificationListener((message: string) => {
      try {
        // Parse the message
        const parsedData = JSON.parse(message);

        // Log the parsed data for verification
        console.log('Parsed data:', parsedData);

        // Ensure the correct case-sensitive field names are used
        const actionLog: ActionLog = {
          Id: parsedData?.Id, // Should match 'Id' from parsedData
          ActionType: parsedData?.ActionType, // Should match 'ActionType' from parsedData
          UserId: parsedData?.UserId, // Should match 'UserId' from parsedData
          DocumentId: parsedData?.DocumentId, // Should match 'DocumentId' from parsedData
          UserName: parsedData?.UserName, // Should match 'UserName' from parsedData
          DocumentName: parsedData?.DocumentName, // Should match 'DocumentName' from parsedData
          CreationDate: new Date(parsedData?.CreationDate || Date.now()), // Parse CreationDate correctly
        };

        // Add the action log to the array
        this.actionLogs.push(actionLog);

        // Log the action log for confirmation
        console.log('New Action Log added: ', actionLog);
      } catch (error) {
        console.error('Error processing notification: ', error);
      }
    });
  }

  print() {
    console.log(this.actionLogs[0].DocumentId);
  }
}
