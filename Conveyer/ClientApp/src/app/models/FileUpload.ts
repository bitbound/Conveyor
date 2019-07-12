export class FileUpload {
  constructor(fileName: string) {
    this.fileName = fileName;
  }
  fileName: string;
  percentLoaded: number;
}