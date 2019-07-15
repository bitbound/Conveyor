import { Component, Inject, ViewChild } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpEvent } from '@angular/common/http';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { Observable } from 'rxjs';
import { FileTableComponent } from '../components/file-table/file-table.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})


export class HomeComponent {
  constructor(auth: AuthorizeService) {
    auth.isAuthenticated().subscribe({
      next: (result) => {
        this.isAuthenticated = result;
      }
    });
  }

  @ViewChild("fileTable") fileTable: FileTableComponent;

  public isAuthenticated: boolean;

  public onDragOver(e: DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }

  public onDrop(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files.length < 1) {
      return;
    }
    this.fileTable.uploadFiles(e.dataTransfer.files);
  }

  public onUploadInputChanged(e: HTMLInputElement){
    this.fileTable.uploadFiles(e.files);
    e.value = null;
  }
}
