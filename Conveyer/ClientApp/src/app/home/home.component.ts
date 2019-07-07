import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})


export class HomeComponent {
  constructor(http: HttpClient, auth: AuthorizeService) {
     auth.isAuthenticated().subscribe({
       next: (result)=>{ 
         this.isAuthenticated = result;
       }
     });
  }

  public isAuthenticated: boolean;
}
