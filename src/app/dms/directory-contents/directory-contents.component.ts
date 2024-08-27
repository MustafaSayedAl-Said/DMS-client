import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { IDocuments } from '../../shared/Models/Documents';
import { DmsService } from '../dms.service';
import { ActivatedRoute } from '@angular/router';
import { DocumentParams } from '../../shared/Models/DocumentParams';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { BreadcrumbService } from 'xng-breadcrumb';
import { AccountService } from '../../account/account.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogComponent } from '../../core/confirmation-dialog/confirmation-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-directory-contents',
  templateUrl: './directory-contents.component.html',
  styleUrl: './directory-contents.component.scss',
})
export class DirectoryContentsComponent implements OnInit {
  @ViewChild('search') searchTerm: ElementRef;
  workspaceName: string;
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
  fileUploadForm: FormGroup;
  selectedFile: File = null;
  fileName = '';
  showDialog = false;

  constructor(
    private dmsService: DmsService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private breadcrumbService: BreadcrumbService,
    private accountService: AccountService,
    private toast: ToastrService,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.createDocumentFileForm();
    this.id = parseInt(this.activatedRoute.snapshot.paramMap.get('id'));
    this.name = this.activatedRoute.snapshot.paramMap.get('name');
    this.accountService.getWorkspaceNameFromSubject().subscribe((name) => {
      this.workspaceName = name;
      this.breadcrumbService.set('dms', this.workspaceName);
      this.breadcrumbService.set('dms/:id/:name', this.name);
      console.log(this.activatedRoute.snapshot.params);
      this.loadDocuments();
    });
  }

  createDocumentFileForm() {
    this.fileUploadForm = this.fb.group({
      file: [null, Validators.required],
    });
  }
  get _file() {
    return this.fileUploadForm.get('file');
  }
  loadDocuments() {
    this.DocumentParams.directoryId = this.id;
    this.dmsService.getDocuments(this.DocumentParams).subscribe(
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

  toggleVisibility(id: number) {
    this.dmsService.updateDocumentVisibility(id).subscribe({
      next: () => {
        this.toast.success('Visibility updated successfully');
        this.loadDocuments();
      },
      error: (err) => {
        this.toast.error('Error updating visiblity', err);
      },
    });
  }
  openDialog(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteDocument(id);
      }
    });
  }

  deleteDocument(id: number) {
    this.dmsService.deleteDocument(id).subscribe({
      next: () => {
        this.toast.success('Document deleted Successfully');
        this.loadDocuments();
      },
      error: (err) => {
        this.toast.error('Error deleting document', err);
      },
    });
  }

  openDocumentAddDialog(){
    this.showDialog = true;
  }
  cancel() {
    this.showDialog = false;
    this.fileUploadForm.patchValue({ file: null });
    this.fileName = '';
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.fileName = this.selectedFile.name;
    this.fileUploadForm.patchValue({
      file: this.selectedFile,
    });
  }

  save() {
    this.dmsService.addDocument(this.selectedFile, this.id).subscribe({
      next:() => {
        this.toast.success('Document added Successfully');
        this.showDialog = false;
        this.fileUploadForm.patchValue({ file: null });
        this.fileName = '';
        this.loadDocuments();
      },
      error: (err)=>{
        this.toast.error('Error adding document', err)
      }
    })

  }
}
