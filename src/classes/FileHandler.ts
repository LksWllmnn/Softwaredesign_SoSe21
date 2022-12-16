import fs from "fs";
import path from "path";

export class FileHandler {
  private static instance: FileHandler;

  public static getInstance(): FileHandler {
    if (this.instance == null)
      this.instance = new FileHandler();

    return this.instance;
  }

  public readArrayFile(pathToFile: string): Array<any> {
    return this.readFile(pathToFile);
  }

  public readObjectFile(pathToFile: string): any {
    return this.readFile(pathToFile);
  }

  public writeFile(pathToFile: string, dataToWrite: any): void {
    fs.writeFileSync(path.resolve(__dirname, "../../data/" + pathToFile), JSON.stringify(dataToWrite));
  }

  public writeLine(pathToFile: string, dataToWrite: any): void {
    fs.appendFile(path.resolve(__dirname, "../../data/" + pathToFile), dataToWrite, function (err) {
      if (err) throw err;
      console.log("Saved!");
    });
  }

  private readFile(pathToFile: string): any {
    // tslint:disable-next-line: typedef
    let jsonRaw = fs.readFileSync(path.resolve(__dirname, "../../data/" + pathToFile));
    let json: any = JSON.parse(jsonRaw.toString());
    return json;
  }
}

export default FileHandler.getInstance();