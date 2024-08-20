import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDirectories } from '../shared/Models/Directories';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  baseUrl = 'https://localhost:7030/api/';

  constructor(private http: HttpClient) { }

  getDirectories(workspaceId: number) {
    return this.http.get<IDirectories[]>(this.baseUrl + 'directories/workspace/${workspaceId}');
  }
}
