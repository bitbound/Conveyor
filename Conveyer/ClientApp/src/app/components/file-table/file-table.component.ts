import { OnInit, Component, Input } from "@angular/core";
import { FileDescription } from "src/app/interfaces/FileDescription";
import { FileUpload } from "src/app/models/FileUpload";
import { HttpClient, HttpRequest, HttpEventType } from "@angular/common/http";
import { AuthorizeService } from "src/api-authorization/authorize.service";

@Component({
    selector: 'app-file-table',
    styleUrls: ['file-table.component.css'],
    templateUrl: 'file-table.component.html',
})
export class FileTableComponent implements OnInit {
    constructor(client: HttpClient, auth: AuthorizeService) {
        this.httpClient = client;
        auth.isAuthenticated().subscribe({
            next: (result) => {
                this.isAuthenticated = result;
            }
        });
    }

    public dataSource: Array<FileDescription> = new Array<FileDescription>();
    private httpClient: HttpClient;
    public isAuthenticated: boolean;
    public uploads: Array<FileUpload> = new Array<FileUpload>();




    public downloadFile(fileGuid: string) {
        var url = `api/File/Download/${fileGuid}`;
        location.href = url;
    }

    public viewFile(fileGuid: string) {
        var url = `api/File/Display/${fileGuid}`;
    }

    public deleteFile(fileGuid: string) {
        var url = `api/File/Delete/${fileGuid}`;
    }


    public loadFiles() {
        if (this.isAuthenticated) {
            this.httpClient.get("api/File/Descriptions").subscribe({
                next: (result) =>{
                    this.dataSource = result as Array<FileDescription>;
                },
                error: (error) => {
                    alert("Error retrieving files.");
                    console.error(error);
                }
            })
        }
        else {
            if (localStorage['fileDescriptions']) {
                this.dataSource = JSON.parse(localStorage['fileDescriptions']);
            }
        }
        this.dataSource.forEach(element => {
            element.dateUploaded = new Date(element.dateUploaded);
        });
    }


    public ngOnInit(): void {
        this.loadFiles();
    }

    public uploadFiles(files: FileList) {
        for (var i = 0; i < files.length; i++) {

            var fileUpload = new FileUpload(files[i].name);
            this.uploads.push(fileUpload);

            var formData = new FormData();
            formData.append("file", files[i]);
            var request = new HttpRequest("POST", "api/File/Upload", formData, {
                reportProgress: true
            });

            this.httpClient.request(request).subscribe(event => {
                switch (event.type) {
                    case HttpEventType.UploadProgress:
                        fileUpload.percentLoaded = event.loaded / event.total;
                        break;
                    case HttpEventType.Response:
                        if (event.ok) {
                            var fileDesc = event.body as FileDescription;
                            fileDesc.dateUploaded = new Date(fileDesc.dateUploaded);
                            this.dataSource.push(fileDesc);
                            if (!this.isAuthenticated){
                                localStorage['fileDescriptions'] = JSON.stringify(this.dataSource);
                            }
                        }
                        else {
                            alert("There was an error uploading the file.");
                            console.error(event);
                        }
                        this.uploads.splice(this.uploads.indexOf(fileUpload), 1);
                        break;
                    default:
                        break;
                }
            }, error => {
                alert("There was an error uploading the file.");
                console.error(error);
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
}