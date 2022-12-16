import "colors";
import ConsoleHandling from "./ConsoleHandling";
import { DefaultStats } from "./DefaultStats";
import { FileHandler } from "./FileHandler";
import { GameField } from "./GameField";
import { GameQuad } from "./GameQuad";
import { GameStats } from "./GameStats";
import { Main } from "./Main";

export class PlayerRole {

    private _activeGameField: GameField;
    private _activeQuad: GameQuad;
    private _activeGameStats: GameStats;
    private _activeMoves: number;

    constructor(_activeGameField: GameField, _activeQuad: GameQuad) {
        this.activeGameField = _activeGameField;
        this.activeQuad = _activeQuad;
        this.activeGameStats = this.getFieldStats();
    }

    //#region getter-setter
    public get activeGameField(): GameField {
        return this._activeGameField;
    }
    public set activeGameField(value: GameField) {
        this._activeGameField = value;
    }
    
    public get activeQuad(): GameQuad {
        return this._activeQuad;
    }
    public set activeQuad(value: GameQuad) {
        this._activeQuad = value;
    }
    public get activeGameStats(): GameStats {
        return this._activeGameStats;
    }
    public set activeGameStats(value: GameStats) {
        this._activeGameStats = value;
    }
    public get activeMoves(): number {
        return this._activeMoves;
    }
    public set activeMoves(value: number) {
        this._activeMoves = value;
    }
    //#endregion

    
    async playing(): Promise<void> {
        console.log("");
        console.log("");
        console.log(("Walking in: " + this.activeGameField.title + "").green);
        console.log("");
        console.log(this.visualizeField());
        let answer: string = await ConsoleHandling.showPossibilities(["Go North (N)", "Go West (W)", "Go South (S)", "Go East (E)", "Quit Game(X)"], "What do you want to do?  ");
        switch (answer.toUpperCase()) {
            case ("N"):
                this.goNorth();
                break;
            case ("W"):
                this.goWest();
                break;
            case ("S"):
                this.goSouth();
                break;
            case ("E"):
                this.goEast();
                break;
            case ("X"):
                this.finish();
                if (this.activeMoves != null)
                    this.activeGameStats.addMoves(this.activeMoves);
                this.activeGameStats.increaseNumberPlays();
                FileHandler.getInstance().writeFile("gameStats.json", Main.getInstance().allGameStats);
                return;
            default:
                console.log("Choose between: (N)|(W)|(S)|(E)|(X)");
                return;
        }
    }

    private finish(): void {
        Main.getInstance().playing = false;
    }

    private goNorth(): void {
        if (this.activeQuad.row > 0) {
            this.activeQuad = this.activeGameField.quads[this.activeQuad.row - 1][this.activeQuad.col];
            if (this.activeMoves == null)
                this.activeMoves = 0;
            this.activeMoves++;
            console.log("You went North".green);
        } else {
            console.log("Cant go further North".red);
            console.log("");
        }  
    }

    private goWest(): void {
        if (this.activeQuad.col > 0) {
            this.activeQuad = this.activeGameField.quads[this.activeQuad.row][this.activeQuad.col - 1];
            if (this.activeMoves == null)
                this.activeMoves = 0;
            this.activeMoves++;
            console.log("You went West".green);
        } else {
            console.log("Cant go further West".red);
            console.log("");
        }   
    }

    private goSouth(): void {
        if (this.activeQuad.row < this.activeGameField.quads.length - 1) {
            this.activeQuad = this.activeGameField.quads[this.activeQuad.row + 1][this.activeQuad.col];
            if (this.activeMoves == null)
                this.activeMoves = 0;
            this.activeMoves++;
            console.log("You went South".green);
        } else {
            console.log("Cant go further South".red);
            console.log("");
        }   
    }

    private goEast(): void {
        if (this.activeQuad.col < this.activeGameField.quads[0].length - 1) {
            this.activeQuad = this.activeGameField.quads[this.activeQuad.row][this.activeQuad.col + 1];
            if (this.activeMoves == null)
                this.activeMoves = 0;
            this.activeMoves++;
            console.log("You went East".green);
        } else {
            console.log("Cant go further East".red);
            console.log("");
        }   
    }

    private visualizeField(): string {
        console.log("location:  " + this.activeQuad.title);
        let mapString: string = "";
        let rowLength: number;
        for (let irows: number = 0; irows < this.activeGameField.quads.length; irows++) {
            let rowString: string = "||||   ";
            for (let icols: number = 0; icols < this.activeGameField.quads[irows].length; icols++) {
                if (icols == this.activeQuad.col && irows == this.activeQuad.row) {
                    rowString += ("|(" + irows + " | " + icols + ")| ").yellow;
                } else {
                    rowString += "|(" + irows + " | " + icols + ")| ";
                }
                
            }
            rowString += "  ||||\r\n";
            rowLength = rowString.length;
            mapString += rowString;
        }
        
        
        let topBorder: string = "";
        for (let i: number = 0; i < Math.round(rowLength * 0.95); i++) {
            topBorder += "_";
        }

        mapString += topBorder;
        return topBorder + "\r\n" + "\r\n" + mapString;
    }

    private getFieldStats(): GameStats {
        let allStats: GameStats[] = Main.getInstance().allGameStats;

        for (let stats of allStats) {
            if (stats.gameUuid == this.activeGameField.uuid) {
                return stats;
            }
        }
        return <GameStats><unknown>new DefaultStats();
    }
}