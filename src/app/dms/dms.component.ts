import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IDirectories } from '../shared/Models/Directories';
import { DmsService } from './dms.service';
import { DirectoryParams } from '../shared/Models/DirectoryParams';
import { error } from 'console';
import { LoaderService } from '../core/services/loader.service';

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

  constructor(private dmsService: DmsService, private loaderService: LoaderService) {}

  ngOnInit(): void {
    this.getDirectories();
  }

  getDirectories() {
    this.loaderService.loader();
    this.dmsService.getDirectories(this.DirectoryParams).subscribe((res) => {
      this.directories = res.data;
      this.totalCount = res.count;
      console.log(this.totalCount);
      this.DirectoryParams.pageNumber = res.pageNumber;
      this.DirectoryParams.pageSize = res.pageSize;
      this.loaderService.hidingLoader();
    }, error=>{
      console.log(error);
      this.loaderService.hidingLoader(); 
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
    this.DirectoryParams = new DirectoryParams();
    this.getDirectories();
  }
}
