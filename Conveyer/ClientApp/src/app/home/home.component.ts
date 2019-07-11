import { Component, Inject, ViewChild } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpEvent } from '@angular/common/http';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { Observable } from 'rxjs';
import { FileTableComponent } from '../components/file-table/file-table.component';
import { FileDescription } from '../interfaces/FileDescription';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})


export class HomeComponent {
  constructor(client: HttpClient, auth: AuthorizeService) {
    this.httpClient = client;
    auth.isAuthenticated().subscribe({
      next: (result) => {
        this.isAuthenticated = result;
      }
    });

    this.loadFiles();
  }

  @ViewChild("app-file-table") fileTable:FileTableComponent<FileDescription>;

  public isAuthenticated: boolean;
  public dataSource: Array<FileDescription>;
  private httpClient: HttpClient;

  public onDragOver(e:DragEvent){
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }

  public onDrop(e:DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files.length < 1) {
        return;
    }
    this.uploadFiles(e.dataTransfer.files);
  }

  public uploadFiles(files: FileList) {
    for (var i = 0; i < files.length; i++) {
      var formData = new FormData();
      formData.append("file", files[i]);
      var request = new HttpRequest("POST", "api/File/Upload", formData, {
        reportProgress: true
      });

      this.httpClient.request(request).subscribe(event => {
         switch (event.type) {
           case HttpEventType.UploadProgress:
             break;
          case HttpEventType.Response:
            if (event.ok) {

            }
            else {

            }
            break;
           default:
             break;
         }
      }, error => {

      });
      
      var observable = this.httpClient.post("api/File/Upload", formData);
      observable.subscribe()
      observable.subscribe({
        error: error => {
          alert("There was an error uploading ")
          console.log(error);
        },
        next: result => {
          console.log(result);
        }
      });
    }
  }

  private loadFiles(){
    if (this.isAuthenticated) {

    }
  }
}
