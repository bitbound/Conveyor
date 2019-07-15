import { OnInit, Component, Input } from "@angular/core";
import { FileDescription } from "src/app/interfaces/FileDescription";
import { FileUpload } from "src/app/models/FileUpload";
import { HttpClient, HttpRequest, HttpEventType } from "@angular/common/http";
import { AuthorizeService } from "src/api-authorization/authorize.service";
import { faSortAmountUp, faSortAmountDown, IconDefinition, faSortAmountDownAlt } from '@fortawesome/free-solid-svg-icons';

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

    private httpClient: HttpClient;
    
    public currentFilter: string = "";
    public currentSortIcon: IconDefinition;
    public currentSortColumn: ColumnType = ColumnType.fileName;
    public currentSortType: SortType = SortType.none;

    public dataSource: Array<FileDescription> = new Array<FileDescription>();
    public filteredData: Array<FileDescription> = new Array<FileDescription>();
    public isAuthenticated: boolean;
    public uploads: Array<FileUpload> = new Array<FileUpload>();

    public applyFilter(filter:string) {
        this.filteredData.forEach(x=>x.isSelected = false);
        this.dataSource.forEach(x=>x.isSelected = false);
        this.filteredData = this.dataSource.filter(x=>x.fileName.toLowerCase().includes(filter.toLowerCase()));
    }

    public downloadFile(fileGuid: string) {
        var url = `api/File/Download/${fileGuid}`;
        location.href = url;
    }

    public viewFile(fileGuid: string) {
        var url = `api/File/Display/${fileGuid}`;
    }

    public deleteAllSelectedFiles() {
        var selectedFiles = this.filteredData.filter(x => x.isSelected);
        if (selectedFiles.length == 0) {
            return;
        }

        var result = confirm(`Are you sure you want to delete ${selectedFiles.length} files?`);

        if (result) {

        }
    }

    public deleteFile(fileGuid: string) {
        var url = `api/File/Delete/${fileGuid}`;
    }

    public loadFiles() {
        if (this.isAuthenticated) {
            this.httpClient.get("api/File/Descriptions").subscribe({
                next: (result) => {
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
        this.filteredData = this.dataSource.slice();
    }


    public ngOnInit(): void {
        this.loadFiles();
    }

    public toggleColumnSorting(column: ColumnType) {

        if (column != this.currentSortColumn) {
            this.currentSortType = SortType.none;
        }
        else {
            this.currentSortColumn = column;
        }

        if (this.currentSortType == SortType.descending) {
            this.currentSortType = SortType.none;
        }
        else {
            this.currentSortType++;
        }

        switch (this.currentSortType) {
            case SortType.ascending:
                this.currentSortIcon = faSortAmountDownAlt;
                break;
            case SortType.descending:
                this.currentSortIcon = faSortAmountUp;
                break;
            default:
                this.currentSortIcon = null;
                break;
        }

        switch (column) {
            case ColumnType.fileName:
                switch (this.currentSortType) {
                    case SortType.ascending:
                        this.filteredData.sort((a, b) => {
                            if (a.fileName.toLowerCase() < b.fileName.toLowerCase()){
                                return -1;
                            }
                            if (a.fileName.toLowerCase() > b.fileName.toLowerCase()){
                                return 1
                            }
                            return 0;
                        });
                        break;
                    case SortType.descending:
                        this.filteredData.sort((a, b) => {
                            if (a.fileName.toLowerCase() > b.fileName.toLowerCase()){
                                return -1;
                            }
                            if (a.fileName.toLowerCase() < b.fileName.toLowerCase()){
                                return 1
                            }
                            return 0;
                        });
                        break;
                    case SortType.none:
                        this.filteredData.sort((a, b) => {
                            return a.id - b.id;
                        });
                        break;
                    default:
                        break;
                }
                break;
            case ColumnType.dateUploaded:
                switch (this.currentSortType) {
                    case SortType.ascending:
                        this.filteredData.sort((a, b) => {
                            if (a.dateUploaded < b.dateUploaded){
                                return -1;
                            }
                            if (a.dateUploaded > b.dateUploaded){
                                return 1;
                            }
                            return 0;
                        });
                        break;
                    case SortType.descending:
                        this.filteredData.sort((a, b) => {
                            if (a.dateUploaded > b.dateUploaded){
                                return -1;
                            }
                            if (a.dateUploaded < b.dateUploaded){
                                return 1;
                            }
                            return 0;
                        });
                        break;
                    case SortType.none:
                        this.filteredData.sort((a, b) => {
                            return a.id - b.id;
                        });
                        break;
                    default:
                        break;
                }
                break;

            case ColumnType.size:
                switch (this.currentSortType) {
                    case SortType.ascending:
                        this.filteredData.sort((a, b) => {
                            if (a.sizeInKb < b.sizeInKb) {
                                return -1;
                            }
                            if (a.sizeInKb > b.sizeInKb) {
                                return 1;
                            }
                            return 0;
                        });
                        break;
                    case SortType.descending:
                        this.filteredData.sort((a, b) => {
                            if (a.sizeInKb > b.sizeInKb) {
                                return -1;
                            }
                            if (a.sizeInKb < b.sizeInKb) {
                                return 1;
                            }
                            return 0;
                        });
                        break;
                    case SortType.none:
                        this.filteredData.sort((a, b) => {
                            return a.id - b.id;
                        });
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }

        this.currentSortColumn = column;
    }

    public toggleSelectAll(checkAll: boolean) {
        this.filteredData.forEach(x => x.isSelected = checkAll);
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
                        var percent = event.loaded / event.total;
                        if (Number.isFinite(percent)) {
                            fileUpload.percentLoaded = percent;    
                        }
                        break;
                    case HttpEventType.Response:
                        if (event.ok) {
                            var fileDesc = event.body as FileDescription;
                            fileDesc.dateUploaded = new Date(fileDesc.dateUploaded);
                            this.dataSource.push(fileDesc);
                            this.filteredData.push(fileDesc);
                            if (!this.isAuthenticated) {
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
        }
    }
}

enum ColumnType {
    fileName,
    dateUploaded,
    size
}

enum SortType {
    none,
    ascending,
    descending
}