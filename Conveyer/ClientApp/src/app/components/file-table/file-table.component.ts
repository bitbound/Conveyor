import { OnInit, Component, Input } from "@angular/core";

@Component({
  selector: 'app-file-table',
  styleUrls: ['file-table.component.css'],
  templateUrl: 'file-table.component.html',
})
export class FileTableComponent<T> implements OnInit {

  constructor() {

  }

  public columnHeaders: string[];
  @Input() public dataSource: Array<T>;

  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }
}