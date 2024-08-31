import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IDocuments } from '../../../../shared/Models/Documents';
import { DocumentParams } from '../../../../shared/Models/DocumentParams';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DmsService } from '../../../dms.service';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { AccountService } from '../../../../account/account.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../core/confirmation-dialog/confirmation-dialog.component';
import { AdminService } from '../../admin.service';
import { IWorkspace } from '../../../../shared/Models/Workspaces';

@Component({
  selector: 'app-admin-directory',
  templateUrl: './admin-directory.component.html',
  styleUrl: './admin-directory.component.scss',
})
export class AdminDirectoryComponent implements OnInit {
  @ViewChild('search') searchTerm: ElementRef;
  workspaceName: string;
  id: number;
  name: string;
  documents: IDocuments[];
  DocumentParams = new DocumentParams();
  totalCount: number;
  selectedDocument: SafeResourceUrl | null = null;
  isPopupVisible: boolean = false;
  fileUploadForm: FormGroup;
  selectedFile: File = null;
  fileName = '';
  showDialog = false;
  sortField: string = '';
  sortOrder: string = '';
  workspaceId: number;

  constructor(
    private dmsService: DmsService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private breadcrumbService: BreadcrumbService,
    private adminService: AdminService,
    private toast: ToastrService,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.createDocumentFileForm();
    this.id = parseInt(this.activatedRoute.snapshot.paramMap.get('id'));
    console.log("id is " + this.id);
    this.name = this.activatedRoute.snapshot.paramMap.get('name');

    this.adminService.getWorkspaceDetails(this.id).subscribe({
      next: (workspace: IWorkspace) => {
        this.workspaceName = workspace.name;
        this.workspaceId = workspace.id;
        this.breadcrumbService.set(
          `users/workspace/${this.workspaceId}/${this.workspaceName}`,
          this.workspaceName
        );
        this.breadcrumbService.set(
          `users/workspace/${this.workspaceId}/${this.workspaceName}/dms/${this.id}/${this.name}`,
          this.name
        );
        
        this.loadDocuments();
      },
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

  onSort(field: string) {
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder === 'Asc' ? 'Desc' : 'Asc';
    } else {
      this.sortField = field;
      this.sortOrder = 'Asc';
    }
    this.DocumentParams.sort = this.sortField + this.sortOrder;
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
    this.sortField = '';
    this.sortOrder = '';
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

  openDocumentAddDialog() {
    this.showDialog = true;
  }
  cancel() {
    this.showDialog = false;
    this.fileUploadForm.patchValue({ file: null });
    this.fileName = '';
  }

  onFileSelected(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (
        fileExtension !== 'pdf' &&
        fileExtension !== 'png' &&
        fileExtension !== 'jpg' &&
        fileExtension !== 'svg' &&
        fileExtension !== 'html' &&
        fileExtension !== 'gif'
      ) {
        this.toast.error(
          'Please select a PDF, PNG, JPG, SVG, HTML or GIF file.'
        );
        input.value = '';
        this.fileUploadForm.patchValue({
          file: null,
        });
        this.fileName = '';
      } else {
        this.selectedFile = event.target.files[0];
        this.fileName = this.selectedFile.name;
        this.fileUploadForm.patchValue({
          file: this.selectedFile,
        });
      }
    }
  }

  save() {
    this.dmsService.addDocument(this.selectedFile, this.id).subscribe({
      next: () => {
        this.toast.success('Document added Successfully');
        this.showDialog = false;
        this.fileUploadForm.patchValue({ file: null });
        this.fileName = '';
        this.loadDocuments();
      },
      error: (err) => {
        this.toast.error('Error adding document', err);
      },
    });
  }
}
