import { GameQuad } from "./GameQuad";
import { v4 as uuidv4 } from "uuid";

export class GameField {
    private _title: string;
    private _openAccess: boolean;
    private _regUserUuid: string;
    private _startingPointX: number;
    private _startingPointY: number;
    private _cols: number;
    private _rows: number;
    private _uuid: string;
    private _quads: GameQuad[][];


    constructor(_title: string, _openAccess: boolean, _regUserUuid: string, _startingPointX: number, _startingPointY: number, _cols: number, _rows: number, _quads: GameQuad[][], _uuid?: string) {
        this.title = _title;
        this.openAccess = _openAccess;
        this.regUserUuid = _regUserUuid;
        this.cols = _cols;
        this.rows = _rows;
        this.startingPointX = _startingPointX;
        this.startingPointY = _startingPointY;
        this.uuid = _uuid;
        this.quads = _quads;
    }
    

    //#region getter-setter
    public get title(): string {
        return this._title;
    }
    public set title(value: string) {
        this._title = value;
    }
    public get openAccess(): boolean {
        return this._openAccess;
    }
    public set openAccess(value: boolean) {
        this._openAccess = value;
    }
    public get regUserUuid(): string {
        return this._regUserUuid;
    }
    public set regUserUuid(value: string) {
        this._regUserUuid = value;
    }
    public get quads(): GameQuad[][] {
        return this._quads;
    }
    public set quads(value: GameQuad[][]) {
        this._quads = value;
    }
    public get cols(): number {
        return this._cols;
    }
    public set cols(value: number) {
        this._cols = value;
    }
    public get rows(): number {
        return this._rows;
    }
    public set rows(value: number) {
        this._rows = value;
    }
    public get uuid(): string {
        return this._uuid;
    }
    public set uuid(value: string) {
        this._uuid = value;
    }
    public get startingPointX(): number {
        return this._startingPointX;
    }
    public set startingPointX(value: number) {
        this._startingPointX = value;
    }
    public get startingPointY(): number {
        return this._startingPointY;
    }
    public set startingPointY(value: number) {
        this._startingPointY = value;
    }
    public setUuid(): void {
        this._uuid = uuidv4();
    }
    //#endregion
}