import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { Observable } from 'rxjs';

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
  }

  public isAuthenticated: boolean;
  private httpClient: HttpClient;

  public uploadFiles(files: FileList) {
    for (var i = 0; i < files.length; i++) {
      var formData = new FormData();
      formData.append("file", files[i]);
      var observable = this.httpClient.post("api/File/Upload", formData);
      observable.subscribe({
        error: error => {
          console.log(error);
        },
        next: result => {
          console.log(result);
        }
      });
    }
  }
}
