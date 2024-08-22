import { Component, Input, OnInit } from '@angular/core';
import { IDocuments } from '../../shared/Models/Documents';
import { DmsService } from '../dms.service';
import { ActivatedRoute } from '@angular/router';
import { DocumentParams } from '../../shared/Models/DocumentParams';

@Component({
  selector: 'app-directory-contents',
  templateUrl: './directory-contents.component.html',
  styleUrl: './directory-contents.component.scss'
})
export class DirectoryContentsComponent implements OnInit {
  documents: IDocuments[];
  DocumentParams = new DocumentParams();
  totalCount:number;
  sortOptions = [
    {name: 'Name Ascending', value: 'NameAsc'},
    {name: 'Name Descending', value: 'NameDesc'}
  ];

  constructor(private dmsService:DmsService, private activatedRoute: ActivatedRoute) { }
  ngOnInit(): void {
    this.loadDocuments();
  }
  loadDocuments(){
    this.DocumentParams.directoryId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'))
    this.dmsService.getDocuments(this.DocumentParams).subscribe((res) => {
      this.documents = res.data;
      console.log(this.documents);
      this.totalCount = res.count;
      console.log(this.totalCount);
      this.DocumentParams.pageNumber = res.pageNumber;
      this.DocumentParams.pageSize = res.pageSize;
      console.log(this.DocumentParams.pageSize)
    });
  }

  onSortSelect(sort: Event){
    let sortValue = (sort.target as HTMLInputElement).value;
    this.DocumentParams.sort = sortValue;
    this.loadDocuments();
  }

  onPageChanged(event: number){
    this.DocumentParams.pageNumber = event;
    this.loadDocuments();
  }

  
}
