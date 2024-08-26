import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IDirectories } from '../shared/Models/Directories';
import { DmsService } from './dms.service';
import { DirectoryParams } from '../shared/Models/DirectoryParams';
import { AccountService } from '../account/account.service';
import { IWorkspace } from '../shared/Models/Workspaces';
import { error } from 'console';

@Component({
  selector: 'app-dms',
  templateUrl: './dms.component.html',
  styleUrl: './dms.component.scss',
})
export class DmsComponent implements OnInit {
  @ViewChild('search') searchTerm: ElementRef;
  directories: IDirectories[];
  DirectoryParams = new DirectoryParams();
  totalCount: number;
  sortOptions = [
    { name: 'Name Ascending', value: 'NameAsc' },
    { name: 'Name Descending', value: 'NameDesc' },
  ];

  constructor(
    private dmsService: DmsService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.accountService.getWorkspaceId(token).subscribe((workspaceId) => {
      if (workspaceId) {
        this.DirectoryParams.workspaceId = workspaceId;
        this.getDirectories();
      } else {
        console.error('Workspace ID is not available');
      }
      (error) => {
        console.error('Error retrieving workspace id');
      };
    });
  }
  getDirectories() {
    this.dmsService.getDirectories(this.DirectoryParams).subscribe(
      (res) => {
        this.directories = res.data;
        this.totalCount = res.count;
        console.log(this.totalCount);
        this.DirectoryParams.pageNumber = res.pageNumber;
        this.DirectoryParams.pageSize = res.pageSize;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onSortSelect(sort: Event) {
    let sortValue = (sort.target as HTMLInputElement).value;
    this.DirectoryParams.sort = sortValue;
    this.getDirectories();
  }

  onPageChanged(event: number) {
    this.DirectoryParams.pageNumber = event;
    this.getDirectories();
  }
  OnSearch() {
    this.DirectoryParams.search = this.searchTerm.nativeElement.value;
    this.getDirectories();
  }

  OnReset() {
    this.searchTerm.nativeElement.value = '';
    this.DirectoryParams.search = '';
  }
}
