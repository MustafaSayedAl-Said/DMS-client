import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { IDocuments } from '../../shared/Models/Documents';
import { DmsService } from '../dms.service';
import { ActivatedRoute } from '@angular/router';
import { DocumentParams } from '../../shared/Models/DocumentParams';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Modal } from 'bootstrap';
import { error } from 'console';
import { BreadcrumbService } from 'xng-breadcrumb';
import { LoaderService } from '../../core/services/loader.service';

@Component({
  selector: 'app-directory-contents',
  templateUrl: './directory-contents.component.html',
  styleUrl: './directory-contents.component.scss',
})
export class DirectoryContentsComponent implements OnInit {
  @ViewChild('search') searchTerm: ElementRef;
  id: number;
  name: string;
  documents: IDocuments[];
  DocumentParams = new DocumentParams();
  totalCount: number;
  selectedDocument: SafeResourceUrl | null = null;
  isPopupVisible: boolean = false;
  sortOptions = [
    { name: 'Name Ascending', value: 'NameAsc' },
    { name: 'Name Descending', value: 'NameDesc' },
  ];

  constructor(
    private dmsService: DmsService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private breadcrumbService: BreadcrumbService,
    private loaderService: LoaderService
  ) {}
  ngOnInit(): void {
    this.id = parseInt(this.activatedRoute.snapshot.paramMap.get('id'));
    this.name = this.activatedRoute.snapshot.paramMap.get('name');
    this.breadcrumbService.set('dms/:id/:name', this.name);
    console.log(this.activatedRoute.snapshot.params);
    this.loadDocuments();
  }
  loadDocuments() {
    this.loaderService.loader();
    this.DocumentParams.directoryId = this.id;
    this.dmsService.getDocuments(this.DocumentParams).subscribe(
      (res) => {
        this.documents = res.data;
        this.totalCount = res.count;
        this.DocumentParams.pageNumber = res.pageNumber;
        this.DocumentParams.pageSize = res.pageSize;
        this.loaderService.hidingLoader();
      },
      (error) => {
        console.log(error);
        this.loaderService.hidingLoader();
      }
    );
  }

  onSortSelect(sort: Event) {
    let sortValue = (sort.target as HTMLInputElement).value;
    this.DocumentParams.sort = sortValue;
    this.loadDocuments();
  }

  onPageChanged(event: number) {
    this.DocumentParams.pageNumber = event;
    this.loadDocuments();
  }

  OnSearch() {
    this.DocumentParams.search = this.searchTerm.nativeElement.value;
    this.loadDocuments();
  }

  OnReset() {
    this.searchTerm.nativeElement.value = '';
    this.DocumentParams.search = '';
    this.DocumentParams = new DocumentParams();
    this.loadDocuments();
  }
  onDocumentClick(documentPath: string): void {
    this.selectedDocument =
      this.sanitizer.bypassSecurityTrustResourceUrl(documentPath);
    this.isPopupVisible = true;
  }

  closePopup(): void {
    this.isPopupVisible = false;
  }

  onModalBackgroundClick(event: MouseEvent): void {
    // Close the modal if the user clicks outside the modal content
    const target = event.target as HTMLElement;
    if (target.classList.contains('custom-modal')) {
      this.closePopup();
    }
  }
}
