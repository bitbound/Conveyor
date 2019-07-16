import { OnInit, Component, Input } from "@angular/core";
import { FileDescription } from "src/app/interfaces/FileDescription";
import { FileUpload } from "src/app/models/FileUpload";
import { HttpClient, HttpRequest, HttpEventType } from "@angular/common/http";
import { AuthorizeService } from "src/api-authorization/authorize.service";
import { faSortAmountUp, faSortAmountDown, IconDefinition, faSortAmountDownAlt, faWindowClose } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-file-table',
    styleUrls: ['file-table.component.css'],
    templateUrl: 'file-table.component.html',
})

export class FileTableComponent implements OnInit {
    constructor(client: HttpClient, auth: AuthorizeService) {
        this.httpClient = client;
        this.authService = auth;
    }

    public closeIcon: IconDefinition = faWindowClose;
    public currentFilter: string = "";
    public currentSortIcon: IconDefinition;
    public currentSortColumn: ColumnType = ColumnType.fileName;
    public currentSortType: SortType = SortType.none;

    public dataSource: Array<FileDescription> = new Array<FileDescription>();
    public fileViewerImageSource: string;
    public fileViewerVideoSource: string;
    public filteredData: Array<FileDescription> = new Array<FileDescription>();
    public isAuthenticated: boolean;
    public isFileViewerOpen:boolean;
    public uploads: Array<FileUpload> = new Array<FileUpload>();
    public userName: string;

    private authService: AuthorizeService;
    private httpClient: HttpClient;

    public applyFilter(filter: string) {
        this.filteredData.forEach(x => x.isSelected = false);
        this.dataSource.forEach(x => x.isSelected = false);
        this.filteredData = this.dataSource.filter(x => x.fileName.toLowerCase().includes(filter.toLowerCase()));
    }

    public closeFileViewer(){
        this.isFileViewerOpen = false;
    }

    public deleteAllSelectedFiles() {
        var selectedGuids = this.filteredData.filter(x => x.isSelected).map(x => x.guid);
        if (selectedGuids.length == 0) {
            return;
        }

        var result = confirm(`Are you sure you want to delete ${selectedGuids.length} files?`);

        if (result) {
            if (this.isAuthenticated) {
                var url = `api/File/DeleteMany/`;
                this.httpClient.post(url, selectedGuids).subscribe({
                    next: () => {
                        this.removeFilesFromDataSource(selectedGuids);
                    },
                    error: (error) => {
                        alert("Error deleting file.");
                        console.error(error);
                    }
                });
            }
            else {
                this.removeFilesFromDataSource(selectedGuids);
            }
        }
    }

    public deleteFile(fileGuid: string) {
        var result = confirm("Are you sure you want to delete this file?");
        if (result) {
            var dataIndex = this.dataSource.findIndex(x => x.guid == fileGuid);
            var filteredIndex = this.filteredData.findIndex(x => x.guid == fileGuid);


            if (this.isAuthenticated) {
                var url = `api/File/Delete/${fileGuid}`;
                this.httpClient.delete(url).subscribe({
                    next: () => {
                        this.dataSource.splice(dataIndex, 1);
                        this.filteredData.splice(filteredIndex, 1);
                    },
                    error: (error) => {
                        alert("Error deleting file.");
                        console.error(error);
                    }
                });
            }
            else {
                this.dataSource.splice(dataIndex, 1);
                this.filteredData.splice(filteredIndex, 1);
                localStorage["fileDescriptions"] = JSON.stringify(this.dataSource);
            }
        }
    }

    public loadFiles() {
        if (this.isAuthenticated) {
            this.httpClient.get<FileDescription[]>("/api/File/Descriptions").subscribe({
                next: (result) => {
                    if (result) {
                        this.dataSource = result;
                    }
                    if (localStorage['fileDescriptions']) {
                        var tempFiles = <FileDescription[]>JSON.parse(localStorage['fileDescriptions']);
                        if (tempFiles) {
                            tempFiles.forEach(x=> this.dataSource.push(x));
                            this.httpClient.post("/api/File/TransferFilesToAccount", tempFiles.map(x=>x.guid)).subscribe({
                                next: result => {
                                    console.log("Transfer of temp files completed.");
                                },
                                error: error => {
                                    console.error("Transfer of temp files failed.");
                                    console.error(error);
                                }
                            });
                        }
                        localStorage['fileDescriptions'] = null;
                    }
                    this.dataSource.forEach(element => {
                        element.dateUploaded = new Date(element.dateUploaded);
                    });
                    this.filteredData = this.dataSource.slice();
                },
                error: (error) => {
                    alert("Error retrieving files.");
                    console.error(error);
                }
            });
        }
        else {
            if (localStorage['fileDescriptions']) {
                var tempFiles = <FileDescription[]>JSON.parse(localStorage['fileDescriptions']);

                if (tempFiles){
                    this.dataSource = tempFiles;
                    this.dataSource.forEach(element => {
                        element.dateUploaded = new Date(element.dateUploaded);
                    });
                    this.filteredData = this.dataSource.slice();
                }
            }
        }
    }


    public ngOnInit(): void {
        this.authService.isAuthenticated().subscribe({
            next: (result) => {
                if (typeof this.isAuthenticated == "undefined"){
                    this.isAuthenticated = result;
                    if (result) {
                        this.authService.getUser().subscribe({
                            next: (user)=>{
                                this.userName = user.name;
                            }
                        });
                    }
                    this.loadFiles();
                }
            }
        });
    }

    public onDragOver(e: DragEvent) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
    }

    public onDrop(e: DragEvent) {
        e.preventDefault();
        if (e.dataTransfer.files.length < 1) {
            return;
        }
        this.uploadFiles(e.dataTransfer.files);
    }

    public onUploadInputChanged(e: HTMLInputElement) {
        this.uploadFiles(e.files);
        e.value = null;
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
                            if (a.fileName.toLowerCase() < b.fileName.toLowerCase()) {
                                return -1;
                            }
                            if (a.fileName.toLowerCase() > b.fileName.toLowerCase()) {
                                return 1
                            }
                            return 0;
                        });
                        break;
                    case SortType.descending:
                        this.filteredData.sort((a, b) => {
                            if (a.fileName.toLowerCase() > b.fileName.toLowerCase()) {
                                return -1;
                            }
                            if (a.fileName.toLowerCase() < b.fileName.toLowerCase()) {
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
                            if (a.dateUploaded < b.dateUploaded) {
                                return -1;
                            }
                            if (a.dateUploaded > b.dateUploaded) {
                                return 1;
                            }
                            return 0;
                        });
                        break;
                    case SortType.descending:
                        this.filteredData.sort((a, b) => {
                            if (a.dateUploaded > b.dateUploaded) {
                                return -1;
                            }
                            if (a.dateUploaded < b.dateUploaded) {
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

    public toggleFileSelected(fileGuid:string, isChecked:boolean) {
        this.filteredData.find(x=>x.guid == fileGuid).isSelected = isChecked;
    };

    public toggleSelectAll(checkAll: boolean) {
        this.filteredData.forEach(x => x.isSelected = checkAll);
    }


    public uploadFiles(files: FileList) {
        for (var i = 0; i < files.length; i++) {

            var fileUpload = new FileUpload(files[i].name);
            this.uploads.push(fileUpload);

            var formData = new FormData();
            formData.append("file", files[i]);
            var request = new HttpRequest("POST", "/api/File/Upload", formData, {
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

    public viewFile(fileGuid: string) {
        var fileDesc = this.dataSource.find(x=>x.guid == fileGuid);
        if (!fileDesc) {
            return;
        }
        this.fileViewerImageSource = null;
        this.fileViewerVideoSource = null;
        var url = `api/File/Display/${fileGuid}`;
        if (fileDesc.contentType.includes("image")){
            this.fileViewerImageSource = url;
            this.isFileViewerOpen = true;
        }
        else if (fileDesc.contentType.includes("video")){
            this.fileViewerVideoSource = url;
            this.isFileViewerOpen = true;
        }
    }

    private removeFilesFromDataSource(selectedGuids:string[]){
        selectedGuids.forEach(x => {
            var dataIndex = this.dataSource.findIndex(y => y.guid == x);
            var filteredIndex = this.filteredData.findIndex(y => y.guid == x);
            this.dataSource.splice(dataIndex, 1);
            this.filteredData.splice(filteredIndex, 1);
        });

        if (!this.isAuthenticated) {
            localStorage['fileDescriptions'] = JSON.stringify(this.dataSource);
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