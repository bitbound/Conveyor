import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthorizeService } from "src/api-authorization/authorize.service";

@Component({
    selector: 'app-auth-keys',
    templateUrl: 'auth-keys.component.html',
})
export class AuthKeysComponent implements OnInit {
    constructor(client: HttpClient, auth: AuthorizeService) {
        this.httpClient = client;
        this.authService = auth;
    }

    private httpClient: HttpClient;
    private authService: AuthorizeService;

    public isAuthenticated: boolean;

    public loadFiles() {
        if (this.isAuthenticated) {
            this.httpClient.get("api/File/Descriptions").subscribe({
                next: (result) => {
                    console.log(result);
                },
                error: (error) => {
                    alert("Error retrieving files.");
                    console.error(error);
                }
            });
        }
    }

    public ngOnInit(): void {
        this.authService.isAuthenticated().subscribe({
            next: (result) => {
                
                this.isAuthenticated = result;
                this.loadFiles();
            },
            complete: () => {
                
            }
        });
    }
}