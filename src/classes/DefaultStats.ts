export class DefaultStats implements AbstractStats {
    private _gameUuid: string;
    private _numberGameWasPlayed: number;
    private _allMoves: number;
    private _uuid: string;
    
    //#region getter-setter
    public get numberGameWasPlayed(): number {
        return this._numberGameWasPlayed;
    }
    public set numberGameWasPlayed(value: number) {
        this._numberGameWasPlayed = value;
    }
    public get gameUuid(): string {
        return this._gameUuid;
    }
    public set gameUuid(value: string) {
        this._gameUuid = value;
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
        return;
    }
    //#endregion
    
    public average(): number {
        return 0;
    }

    public addMoves(_moves: number): void {
        return;
    }

    public increaseNumberPlays(): void {
        return;
    }
}