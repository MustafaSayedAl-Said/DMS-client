import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPaginationDirectories } from '../shared/Models/PaginationDirectories';
import { map } from 'rxjs';
import { DirectoryParams } from '../shared/Models/DirectoryParams';
import { DocumentParams } from '../shared/Models/DocumentParams';
import { IPaginationDocuments } from '../shared/Models/PaginationDocuments';


@Injectable({
  providedIn: 'root'
})
export class DmsService {

  baseUrl = 'https://localhost:7030/api/';

  constructor(private http: HttpClient) { }

  getDirectories(DirectoryParams: DirectoryParams) {
    let params = new HttpParams();
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    if(DirectoryParams.sort){
      //Sort=NameAsc
      params = params.append('Sort', DirectoryParams.sort);
    }
    if(DirectoryParams.search){
      params = params.append('Search', DirectoryParams.search);
    }
    params = params.append('pageNumber', DirectoryParams.pageNumber.toString());
    params = params.append('pageSize', DirectoryParams.pageSize.toString());
    return this.http.get<IPaginationDirectories>(this.baseUrl + 'directories/user', {headers: headers, observe: 'response', params})
    .pipe(
      map(response => {
        return response.body;
      })
    );
  }

  getDocuments(DocumentParams: DocumentParams){
    let params = new HttpParams();
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    if(DocumentParams.sort){
      params = params.append('Sort', DocumentParams.sort);
    }
    if(DocumentParams.search){
      params = params.append('Search', DocumentParams.search);
    }
    params = params.append('DirectoryId', DocumentParams.directoryId);
    params = params.append('pageNumber', DocumentParams.pageNumber.toString());
    params = params.append('pageSize', DocumentParams.pageSize.toString());
    return this.http.get<IPaginationDocuments>(this.baseUrl + 'documents', {headers: headers, observe: 'response', params})
    .pipe(
      map(response => {
        return response.body;
      })
    );
  }
}
