import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { IDirectories } from '../shared/Models/Directories';
import { DmsService } from './dms.service';
import { DirectoryParams } from '../shared/Models/DirectoryParams';
import { AccountService } from '../account/account.service';
import { BreadcrumbService } from 'xng-breadcrumb';

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
  token: string;
  workspaceName: string = 'My Workspace';

  constructor(
    private dmsService: DmsService,
    private accountService: AccountService,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.accountService.getWorkspaceName().subscribe((name)=>{
      this.workspaceName = name;
      this.breadcrumbService.set('dms', this.workspaceName);
      console.log("Workspace Name: ", this.workspaceName);
    })
    this.getDirectories();
  }
  getDirectories() {
    this.dmsService.getDirectories(this.DirectoryParams).subscribe({
        next: (res) => {
            this.directories = res.data;
            this.totalCount = res.count;
            console.log(this.totalCount);
            this.DirectoryParams.pageNumber = res.pageNumber;
            this.DirectoryParams.pageSize = res.pageSize;
        },
        error: (error) => {
            console.log(error);
        },
        complete: () => {
            console.log('Request completed');
        }
    });
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
    this.getDirectories();
  }
}
