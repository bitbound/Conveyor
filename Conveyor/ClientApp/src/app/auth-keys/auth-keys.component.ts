import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthorizeService } from "src/api-authorization/authorize.service";
import { faSortAmountDownAlt, faSortAmountUp, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { AuthKey } from "../interfaces/AuthKey";

@Component({
    selector: 'app-auth-keys',
    templateUrl: 'auth-keys.component.html',
})
export class AuthKeysComponent implements OnInit {
    constructor(client: HttpClient, auth: AuthorizeService) {
        this.httpClient = client;
        this.authService = auth;
    }

    public currentFilter: string = "";
    public currentSortIcon: IconDefinition;
    public currentSortColumn: ColumnType = ColumnType.description;
    public currentSortType: SortType = SortType.none;

    public dataSource: AuthKey[] = new Array<AuthKey>();
    public fileViewerImageSource: string;
    public fileViewerVideoSource: string;
    public filteredData: Array<AuthKey> = new Array<AuthKey>();
    public isAuthenticated: boolean;
    public userName: string;

    private authService: AuthorizeService;
    private httpClient: HttpClient;

    public applyFilter(filter: string) {
        this.filteredData.forEach(x => x.isSelected = false);
        this.dataSource.forEach(x => x.isSelected = false);
        this.filteredData = this.dataSource.filter(x => x.description.toLowerCase().includes(filter.toLowerCase()));
    }

    public deleteAllSelectedKeys() {
        var selectedGuids = this.filteredData.filter(x => x.isSelected).map(x => x.guid);
        if (selectedGuids.length == 0) {
            return;
        }

        var result = confirm(`Are you sure you want to delete ${selectedGuids.length} files?`);

        if (result) {
            var url = `api/AuthKey/DeleteMany/`;
            this.httpClient.post(url, selectedGuids).subscribe({
                next: () => {
                    selectedGuids.forEach(x => {
                        var dataIndex = this.dataSource.findIndex(y => y.guid == x);
                        var filteredIndex = this.filteredData.findIndex(y => y.guid == x);
                        this.dataSource.splice(dataIndex, 1);
                        this.filteredData.splice(filteredIndex, 1);
                    });
                },
                error: (error) => {
                    alert("Error deleting file.");
                    console.error(error);
                }
            });
        }
    }

    public deleteKey(keyGuid: string) {
        var result = confirm("Are you sure you want to delete this file?");
        if (result) {
            var dataIndex = this.dataSource.findIndex(x => x.guid == keyGuid);
            var filteredIndex = this.filteredData.findIndex(x => x.guid == keyGuid);

            var url = `api/File/Delete/${keyGuid}`;
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
    }

    public getNewKey() {

    }

    public loadKeys() {
        this.httpClient.get<AuthKey[]>("/api/AuthKeys/").subscribe({
            next: (result) => {
                if (result) {
                    this.dataSource = result;
                    this.dataSource.forEach(key => {
                        key.dateCreated = new Date(key.dateCreated);
                        key.lastUsed = new Date(key.lastUsed);
                    });
                    this.filteredData = this.dataSource.slice();
                }
            },
            error: (error) => {
                alert("Error retrieving keys.");
                console.error(error);
            }
        });
    }


    public ngOnInit(): void {
        this.authService.isAuthenticated().subscribe({
            next: (result) => {
                if (typeof this.isAuthenticated == "undefined") {
                    this.isAuthenticated = result;
                    if (result) {
                        this.authService.getUser().subscribe({
                            next: (user) => {
                                this.userName = user.name;
                            }
                        });
                    }
                    this.loadKeys();
                }
            }
        });
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
            case ColumnType.description:
                switch (this.currentSortType) {
                    case SortType.ascending:
                        this.filteredData.sort((a, b) => {
                            if (a.description.toLowerCase() < b.description.toLowerCase()) {
                                return -1;
                            }
                            if (a.description.toLowerCase() > b.description.toLowerCase()) {
                                return 1
                            }
                            return 0;
                        });
                        break;
                    case SortType.descending:
                        this.filteredData.sort((a, b) => {
                            if (a.description.toLowerCase() > b.description.toLowerCase()) {
                                return -1;
                            }
                            if (a.description.toLowerCase() < b.description.toLowerCase()) {
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
            case ColumnType.guid:
                switch (this.currentSortType) {
                    case SortType.ascending:
                        this.filteredData.sort((a, b) => {
                            if (a.guid.toLowerCase() < b.guid.toLowerCase()) {
                                return -1;
                            }
                            if (a.guid.toLowerCase() > b.guid.toLowerCase()) {
                                return 1
                            }
                            return 0;
                        });
                        break;
                    case SortType.descending:
                        this.filteredData.sort((a, b) => {
                            if (a.guid.toLowerCase() > b.guid.toLowerCase()) {
                                return -1;
                            }
                            if (a.guid.toLowerCase() < b.guid.toLowerCase()) {
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
            case ColumnType.dateCreated:
                switch (this.currentSortType) {
                    case SortType.ascending:
                        this.filteredData.sort((a, b) => {
                            if (a.dateCreated < b.dateCreated) {
                                return -1;
                            }
                            if (a.dateCreated > b.dateCreated) {
                                return 1;
                            }
                            return 0;
                        });
                        break;
                    case SortType.descending:
                        this.filteredData.sort((a, b) => {
                            if (a.dateCreated > b.dateCreated) {
                                return -1;
                            }
                            if (a.dateCreated < b.dateCreated) {
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

            case ColumnType.lastUsed:
                switch (this.currentSortType) {
                    case SortType.ascending:
                        this.filteredData.sort((a, b) => {
                            if (a.lastUsed < b.lastUsed) {
                                return -1;
                            }
                            if (a.lastUsed > b.lastUsed) {
                                return 1;
                            }
                            return 0;
                        });
                        break;
                    case SortType.descending:
                        this.filteredData.sort((a, b) => {
                            if (a.lastUsed > b.lastUsed) {
                                return -1;
                            }
                            if (a.lastUsed < b.lastUsed) {
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

    public toggleKeySelected(keyGuid: string, isChecked: boolean) {
        this.filteredData.find(x => x.guid == keyGuid).isSelected = isChecked;
    };

    public toggleSelectAll(checkAll: boolean) {
        this.filteredData.forEach(x => x.isSelected = checkAll);
    }
}


enum ColumnType {
    description,
    guid,
    dateCreated,
    lastUsed
}

enum SortType {
    none,
    ascending,
    descending
}