import { Component, Input, OnInit } from '@angular/core';
import { IDirectories } from '../../shared/Models/Directories';
import { DmsService } from '../dms.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../core/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrl: './directory.component.scss',
})
export class DirectoryComponent implements OnInit {
  @Input() directory: IDirectories;
  editMode = false;
  directoryNameForm: FormGroup;
  constructor(
    private dmsService: DmsService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private toast: ToastrService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.createDirectoryNameForm();
  }

  createDirectoryNameForm() {
    this.directoryNameForm = this.fb.group({
      name: ['', [Validators.required]],
    });
  }

  get _name() {
    return this.directoryNameForm.get('name');
  }
  toggleEdit() {
    this.directoryNameForm.setValue({ name: this.directory.name });

    this.editMode = !this.editMode;
  }

  saveEdit() {
    const newName = this._name.value;
    console.log(newName);
    this.dmsService.updateDirectoryName(this.directory.id, newName).subscribe({
      next: () => {
        this.editMode = false;
        this.toast.success('Name updated successfully');
        this.router.navigate(["/404"]).then(() => {
          this.router.navigate(['/dms']);
        })
      },
      error: (err) => {
        this.editMode = false;
        this.toast.error('Error updating name', err);
      },
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteDirectory();
      }
    });
  }

  deleteDirectory() {
    this.dmsService.deleteDirectory(this.directory.id).subscribe({
      next: () => {
        this.toast.success('Directory deleted successfully');
        this.router.navigate(["/404"]).then(() => {
          this.router.navigate(['/dms']);
        })
      },
      error: (err) => {
        this.toast.error('Error deleting directory', err);
      },
    });
  }
}
