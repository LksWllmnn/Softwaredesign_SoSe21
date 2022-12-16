export class GameQuad {
    public _title: string;
    public _col: number;
    public _row: number;

    constructor(_title: string, _col: number, _row: number) {
        this._title = _title;
        this._col = _col;
        this._row = _row;
    }

    //#region getter
    public get title(): string {
        return this._title;
    }
    public get col(): number {
        return this._col;
    }
    public get row(): number {
        return this._row;
    }
    //#endregion
}