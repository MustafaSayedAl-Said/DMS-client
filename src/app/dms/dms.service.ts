import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPagination } from '../shared/Models/Pagination';
import { map } from 'rxjs';
import { DirectoryParams } from '../shared/Models/DirectoryParams';


@Injectable({
  providedIn: 'root'
})
export class DmsService {

  baseUrl = 'https://localhost:7030/api/';

  constructor(private http: HttpClient) { }

  getDirectories(DirectoryParams: DirectoryParams) {
    let params = new HttpParams();
    if(DirectoryParams.sort){
      //Sort=NameAsc
      params = params.append('Sort', DirectoryParams.sort);
    }
    if(DirectoryParams.search){
      params = params.append('Search', DirectoryParams.search);
    }
    params = params.append('WorkspaceId', DirectoryParams.workspaceId.toString());
    params = params.append('pageNumber', DirectoryParams.pageNumber.toString());
    params = params.append('pageSize', DirectoryParams.pageSize.toString());
    return this.http.get<IPagination>(this.baseUrl + 'directories', {observe: 'response', params})
    .pipe(
      map(response => {
        return response.body;
      })
    );
  }
}
