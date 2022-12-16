import "colors";
import ConsoleHandling from "./ConsoleHandling";
import { FileHandler } from "./FileHandler";
import { GameField } from "./GameField";
import { GameQuad } from "./GameQuad";
import { GameStats } from "./GameStats";
import { Main } from "./Main";
import { QuadFactory } from "./QuadFactory";

export class GameFieldFactory {
    private static instance: GameFieldFactory;

    public static getInstance(): GameFieldFactory {
        if (GameFieldFactory.instance == null)
            GameFieldFactory.instance = new GameFieldFactory();
        return GameFieldFactory.instance;
    }

    public async buildMenu(_userUuid: string): Promise<GameField> { 
        let newGameField: GameField;
        let gameTitle: string;
        let openForAll: boolean;
        let startingPointX: number;
        let startingPointY: number;
        let regUserUuid: string;
        let cols: number;
        let rows: number;

        gameTitle = await this.gameFieldTitle();
        if (gameTitle == "x") {
            return;
        } else {
            gameTitle = gameTitle;
        }

        switch (await this.gameFieldOpen()) {
            case "X":
                return;
            case "Y":
                openForAll = true;
                regUserUuid = _userUuid;
                break;
            case "N":
                openForAll = false;
                regUserUuid = _userUuid;
                break;
            default:
                console.log("sth went wrong in the GamefieldFactory");
        }

        cols = await this.gameFieldColsRows("c");
        if (cols == -1) {
            return;
        } else {
            cols = cols;
        }

        rows = await this.gameFieldColsRows("r");
        if (rows == -1) {
            return;
        } else {
            rows = rows;
        }

        startingPointY = await this.startPoint("x", rows, cols);
        if (startingPointY == -1) {
            return;
        } else {
            startingPointX = startingPointX;
        }

        startingPointX = await this.startPoint("y", rows, cols);
        if (startingPointX == -1) {
            return;
        } else {
            startingPointX = startingPointX;
        }

        

        newGameField = new GameField(gameTitle, openForAll, regUserUuid, startingPointX, startingPointY, cols, rows, await this.gameQuadMenu(rows, cols));
        newGameField.setUuid();
        this.generateStat(newGameField);
        return newGameField;
    }

    private async gameFieldTitle(): Promise<string> {
        let answer: string = await ConsoleHandling.showPossibilities(["Give any title for the Game", "aboard (X)"], "Give a title for the Name: ");
        switch (answer) {
            case "X":
                return "x";
            case "x":
                return "x";
            default:
                return answer;
        }
    }

    private async gameFieldOpen(): Promise<string> {
        while (true) {
            let answer: string = await ConsoleHandling.showPossibilities(["No, just for me (N)", "Yes, for everybody (Y)", "aboard process (X)"], "is the Game open for all?   ");
            switch (answer.toUpperCase()) {
                case "X":
                    return "X";
                case "Y":
                    return "Y";
                case "N":
                    return "N";
                default:
                    console.log(" Your Options: (X), (Y), (N)");
                    break;
            }
        }
    }

    private async gameFieldColsRows(_rowOrCol: string): Promise<number> {
        while (true) {
            let answer: string;
            if (_rowOrCol == "r") {
                answer = await ConsoleHandling.question("How much Rows should the map be? (just numbers)    ");
            } else if (_rowOrCol == "c") {
                answer = await ConsoleHandling.question("How much Columns should the map be? (just numbers)    ");
            }
            
            let regExNumber: RegExp = new RegExp("^[1-9]\d*$");
            if (regExNumber.test(answer)) {
                return +answer;
            } else if (answer == "X" || answer == "x") {
                return -1;
            } else {
                console.log("not a valid number");
            }
        }
    }

    private async startPoint(_xOrY: string, _rows: number, _cols: number): Promise<number> {
        while (true) {
            let answer: string;
            let question: string;
            
            if (_xOrY == "x") {
                question = "Where should the starting Y-coordinate be? (just numbers)    ";
            } else if (_xOrY == "y") {
                question = "Where should the starting X-coordinate be? (just numbers)    ";
            }
            answer = await ConsoleHandling.question(question);
            
            let regExNumber: RegExp = new RegExp("^[0-9]\d*$");
            if (regExNumber.test(answer)) {
                if (_xOrY == "x") {
                    if (+answer >= _rows || +answer < 0) {
                        console.log("Startpoint not in range: " + 0 + " - " + (_rows - 1) + "".red);
                    } else {
                        return +answer;
                    }
                } else {
                    if (+answer >= _cols || +answer < 0) {
                        console.log("Startpoint not in range: " + 0 + " - " + (_cols - 1 + "".red));
                    } else {
                        return +answer;
                    }
                }
            } else if (answer == "X" || answer == "x") {
                return -1;
            } else {
                console.log("not a valid number");
            }
        }
    }

    private async gameQuadMenu(_rows: number, _cols: number): Promise<GameQuad[][]> {
        let allQuads: GameQuad[][] = [];
        for (let irows: number = 0; irows < _rows; irows++) {
            allQuads.push([]);
        }
        
        for (let irows: number = 0; irows < _rows; irows++) {
            for (let icols: number = 0; icols < _cols; icols++) {
                let answer: string = await ConsoleHandling.question("What is the title of GameQuad (" + irows + " | " + icols + ") ?    ");
                let newQuad: GameQuad = QuadFactory.getInstance().createQuad(answer, icols, irows);
                allQuads[irows].push(newQuad);
            }
        }
        return allQuads;
    }

    private generateStat(_gameField: GameField): void {
        let newGameFieldStat: GameStats = new GameStats(_gameField.uuid);
        newGameFieldStat.setUuid();
        Main.getInstance().allGameStats.push(newGameFieldStat);
        FileHandler.getInstance().writeFile("gameStats.json", Main.getInstance().allGameStats);
        console.log("GameStats saved");
    }
}