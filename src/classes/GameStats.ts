import { v4 as uuidv4 } from "uuid";

export class GameStats implements AbstractStats {
    private _gameUuid: string;
    private _numberGameWasPlayed: number;
    private _allMoves: number;
    private _uuid: string;
    

    constructor(_gameUuid: string, _numberGameWasPlayed: number = 0, _allMoves: number = 0, _uuid?: string) {
        this.gameUuid = _gameUuid;
        this.numberGameWasPlayed = _numberGameWasPlayed;
        this.allMoves = _allMoves;
        this.uuid = _uuid;
    }

    //#region getter-setter
    public get gameUuid(): string {
        return this._gameUuid;
    }
    public set gameUuid(value: string) {
        this._gameUuid = value;
    }
    public get numberGameWasPlayed(): number {
        return this._numberGameWasPlayed;
    }
    public set numberGameWasPlayed(value: number) {
        this._numberGameWasPlayed = value;
    }
    public get allMoves(): number {
        return this._allMoves;
    }
    public set allMoves(value: number) {
        this._allMoves = value;
    }
    public get uuid(): string {
        return this._uuid;
    }
    public set uuid(value: string) {
        this._uuid = value;
    }

    public setUuid(): void {
        this._uuid = uuidv4();
    }
    //#endregion

    public average(): number {
        return this.allMoves / this.numberGameWasPlayed;
    }

    public addMoves(_moves: number): void {
        this.allMoves += _moves;
    }

    public increaseNumberPlays(): void {
        this.numberGameWasPlayed++;
    }
}