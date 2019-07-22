import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthorizeService } from "src/api-authorization/authorize.service";
import { faSortAmountDownAlt, faSortAmountUp, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { AuthToken } from "../interfaces/AuthToken";

@Component({
  selector: 'app-auth-tokens',
  templateUrl: 'auth-tokens.component.html',
})
export class AuthTokensComponent implements OnInit {
  constructor(client: HttpClient, auth: AuthorizeService) {
    this.httpClient = client;
    this.authService = auth;
  }

  public currentFilter: string = "";
  public currentSortIcon: IconDefinition;
  public currentSortColumn: ColumnType = ColumnType.description;
  public currentSortType: SortType = SortType.none;

  public dataSource: AuthToken[] = new Array<AuthToken>();
  public filteredData: Array<AuthToken> = new Array<AuthToken>();
  public isAuthenticated: boolean;
  public isLoaded: boolean;
  public userName: string;

  private authService: AuthorizeService;
  private httpClient: HttpClient;

  public applyFilter(filter: string) {
    this.filteredData.forEach(x => x.isSelected = false);
    this.dataSource.forEach(x => x.isSelected = false);
    this.filteredData = this.dataSource.filter(x => x.description.toLowerCase().includes(filter.toLowerCase()));
  }

  public deleteAllSelectedTokens() {
    var selectedGuids = this.filteredData.filter(x => x.isSelected).map(x => x.token);
    if (selectedGuids.length == 0) {
      return;
    }

    var result = confirm(`Are you sure you want to delete ${selectedGuids.length} tokens?`);

    if (result) {
      var url = `api/AuthToken/DeleteMany/`;
      this.httpClient.post(url, selectedGuids).subscribe({
        next: () => {
          selectedGuids.forEach(x => {
            var dataIndex = this.dataSource.findIndex(y => y.token == x);
            var filteredIndex = this.filteredData.findIndex(y => y.token == x);
            this.dataSource.splice(dataIndex, 1);
            this.filteredData.splice(filteredIndex, 1);
          });
        },
        error: (error) => {
          alert("Error deleting tokens.");
          console.error(error);
        }
      });
    }
  }

  public deleteToken(tokenGuid: string) {
    var result = confirm("Are you sure you want to delete this token?");
    if (result) {
      var dataIndex = this.dataSource.findIndex(x => x.token == tokenGuid);
      var filteredIndex = this.filteredData.findIndex(x => x.token == tokenGuid);

      var url = `/api/AuthToken/Delete/${tokenGuid}`;
      this.httpClient.delete(url).subscribe({
        next: () => {
          this.dataSource.splice(dataIndex, 1);
          this.filteredData.splice(filteredIndex, 1);
        },
        error: (error) => {
          console.error(error);
          alert("Error deleting token.");
        }
      });
    }
  }

  public getNewToken() {
    this.httpClient.get("/api/AuthToken/New").subscribe({
      next: result => {
        var newToken = result as AuthToken;
        newToken.dateCreated = new Date(newToken.dateCreated).toLocaleString();
        if (newToken.lastUsed){
          newToken.lastUsed = new Date(newToken.lastUsed).toLocaleString();
        }
        this.dataSource.push(newToken);
        this.filteredData.push(newToken);
      },
      error: error => {
        console.error(error);
        alert("Error getting new token.");
      }
    })
  }

  public loadTokens() {
    this.httpClient.get<AuthToken[]>("/api/AuthToken/").subscribe({
      next: (result) => {
        if (result) {
          this.dataSource = result;
          this.dataSource.forEach(token => {
            token.dateCreated = new Date(token.dateCreated).toLocaleString();
            if (token.lastUsed) {
              token.lastUsed = new Date(token.lastUsed).toLocaleString();
            }
          });
          this.filteredData = this.dataSource.slice();
        }
        this.isLoaded = true;
      },
      error: (error) => {
        this.isLoaded = true;
        alert("Error retrieving tokens.");
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
          this.loadTokens();
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
      case ColumnType.token:
        switch (this.currentSortType) {
          case SortType.ascending:
            this.filteredData.sort((a, b) => {
              if (a.token.toLowerCase() < b.token.toLowerCase()) {
                return -1;
              }
              if (a.token.toLowerCase() > b.token.toLowerCase()) {
                return 1
              }
              return 0;
            });
            break;
          case SortType.descending:
            this.filteredData.sort((a, b) => {
              if (a.token.toLowerCase() > b.token.toLowerCase()) {
                return -1;
              }
              if (a.token.toLowerCase() < b.token.toLowerCase()) {
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
              var dateA = new Date(a.dateCreated);
              var dateB = new Date(b.dateCreated);

              if (dateA < dateB) {
                return -1;
              }
              if (dateA > dateB) {
                return 1;
              }
              return 0;
            });
            break;
          case SortType.descending:
            this.filteredData.sort((a, b) => {
              var dateA = new Date(a.dateCreated);
              var dateB = new Date(b.dateCreated);

              if (dateA > dateB) {
                return -1;
              }
              if (dateA < dateB) {
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
              var dateA = new Date(a.lastUsed);
              var dateB = new Date(b.lastUsed);

              if (dateA < dateB) {
                return -1;
              }
              if (dateA > dateB) {
                return 1;
              }
              return 0;
            });
            break;
          case SortType.descending:
            this.filteredData.sort((a, b) => {
              var dateA = new Date(a.lastUsed);
              var dateB = new Date(b.lastUsed);

              if (dateA > dateB) {
                return -1;
              }
              if (dateA < dateB) {
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

  public toggleEditMode(tokenGuid: string) {
    var token = this.filteredData.find(x => x.token == tokenGuid);
    if (token) {
      this.filteredData
        .filter(x => x.isInEditMode)
        .forEach(x => x.isInEditMode = false);
      token.isInEditMode = true;
    }
  }

  public toggleTokenSelected(tokenGuid: string, isChecked: boolean) {
    this.filteredData.find(x => x.token == tokenGuid).isSelected = isChecked;
  };

  public toggleSelectAll(checkAll: boolean) {
    this.filteredData.forEach(x => x.isSelected = checkAll);
  }

  public updateTokenDescription(tokenGuid: string, newDescription: string) {
    var dataToken = this.dataSource.find(x=>x.token == tokenGuid);
    var filteredToken = this.filteredData.find(x=>x.token == tokenGuid);
    dataToken.isInEditMode = false;
    filteredToken.isInEditMode = false;

    this.httpClient.post("/api/AuthToken/UpdateDescription",
      <AuthToken>
      {
        description: newDescription,
        token: tokenGuid
      }).subscribe({
        next: result => {
          dataToken.description = newDescription;
          filteredToken.description = newDescription;
        },
        error: error => {
          console.error(error);
          alert("Error updating description.");
        }
      });
  }
}


enum ColumnType {
  description,
  token,
  dateCreated,
  lastUsed
}

enum SortType {
  none,
  ascending,
  descending
}