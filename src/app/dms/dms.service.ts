import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPaginationDirectories } from '../shared/Models/PaginationDirectories';
import { catchError, map, of, throwError } from 'rxjs';
import { DirectoryParams } from '../shared/Models/DirectoryParams';
import { DocumentParams } from '../shared/Models/DocumentParams';
import { IPaginationDocuments } from '../shared/Models/PaginationDocuments';

@Injectable({
  providedIn: 'root',
})
export class DmsService {
  baseUrl = 'https://localhost:7030/api/';

  constructor(private http: HttpClient) {}

  getDirectories(DirectoryParams: DirectoryParams) {
    let params = new HttpParams();
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    if (DirectoryParams.sort) {
      //Sort=NameAsc
      params = params.append('Sort', DirectoryParams.sort);
    }
    if (DirectoryParams.search) {
      params = params.append('Search', DirectoryParams.search);
    }
    params = params.append('pageNumber', DirectoryParams.pageNumber.toString());
    params = params.append('pageSize', DirectoryParams.pageSize.toString());
    return this.http
      .get<IPaginationDirectories>(this.baseUrl + 'directories/user', {
        headers: headers,
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          return response.body;
        })
      );
  }

  getDocuments(DocumentParams: DocumentParams) {
    let params = new HttpParams();
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    if (DocumentParams.sort) {
      params = params.append('Sort', DocumentParams.sort);
    }
    if (DocumentParams.search) {
      params = params.append('Search', DocumentParams.search);
    }
    params = params.append('DirectoryId', DocumentParams.directoryId);
    params = params.append('pageNumber', DocumentParams.pageNumber.toString());
    params = params.append('pageSize', DocumentParams.pageSize.toString());
    return this.http
      .get<IPaginationDocuments>(this.baseUrl + 'documents', {
        headers: headers,
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          return response.body;
        })
      );
  }

  updateDirectoryName(id: number, newName: string) {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    headers = headers.set('Content-Type', 'application/json');
    const body = JSON.stringify(newName);
    console.log(body);

    return this.http
      .patch(this.baseUrl + 'directories/' + id, body, {
        headers,
      })
      .pipe(
        map(() => {
          // If the delete request is successful, return true
          return true;
        }),
        catchError((err) => {
          console.error('Error deleting directory:', err);
          // If there's an error, return false
          return of(false);
        })
      );
  }

  deleteDirectory(id: number) {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);

    return this.http
      .delete(this.baseUrl + 'directories/' + id, { headers })
      .pipe(
        map(() => {
          // If the delete request is successful, return true
          return true;
        }),
        catchError((err) => {
          console.error('Error deleting directory:', err);
          // If there's an error, return false
          return of(false);
        })
      );
  }

  addDirectory(name: string, workspaceId: number) {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);

    return this.http
      .post(
        this.baseUrl + 'directories',
        { name: name, workspaceId: workspaceId },
        { headers }
      )
      .pipe(
        map(() => {
          return true;
        }),
        catchError((err) => {
          console.error('Error Adding directory: ', err);
          return of(false);
        })
      );
  }
}
