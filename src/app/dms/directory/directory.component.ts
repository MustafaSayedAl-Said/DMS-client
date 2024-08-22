import { Component, Input, OnInit } from '@angular/core';
import { IDirectories } from '../../shared/Models/Directories';

@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrl: './directory.component.scss'
})
export class DirectoryComponent implements OnInit {
  @Input() directory: IDirectories;
  /**
   *
   */
  constructor() {
    
  }
  ngOnInit(): void {
  }

}
