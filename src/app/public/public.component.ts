import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IDocuments } from '../shared/Models/Documents';
import { DocumentParams } from '../shared/Models/DocumentParams';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PublicService } from './public.service';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrl: './public.component.scss',
})
export class PublicComponent implements OnInit {
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
    private publicService: PublicService,
    private sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
    this.loadPublicDocuments();
  }

  loadPublicDocuments() {
    this.publicService.getPublicDocuments(this.DocumentParams).subscribe(
      (res) => {
        this.documents = res.data;
        this.totalCount = res.count;
        this.DocumentParams.pageNumber = res.pageNumber;
        this.DocumentParams.pageSize = res.pageSize;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onSortSelect(sort: Event) {
    let sortValue = (sort.target as HTMLInputElement).value;
    this.DocumentParams.sort = sortValue;
    this.loadPublicDocuments();
  }

  onPageChanged(event: number) {
    this.DocumentParams.pageNumber = event;
    this.loadPublicDocuments();
  }

  OnSearch() {
    this.DocumentParams.search = this.searchTerm.nativeElement.value;
    this.loadPublicDocuments();
  }

  OnReset() {
    this.searchTerm.nativeElement.value = '';
    this.DocumentParams.search = '';
    this.DocumentParams = new DocumentParams();
    this.loadPublicDocuments();
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
