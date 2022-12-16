import "colors";
import ConsoleHandling from "./ConsoleHandling";
import { FileHandler } from "./FileHandler";
import { GameField } from "./GameField";
import { GameFieldFactory } from "./GameFieldFactory";
import { GameStats } from "./GameStats";
import { Main } from "./Main";
import { User } from "./User";
import { MapsAccess } from "../enums/mapsAccess";


export class RegisteredUser extends User {
    private _uuID: string;
    private _nameAcc: string;
    private _password: string;

    constructor(_uuID: string, _nameAcc: string, _password: string ) {
        super();
        this.uuID = _uuID;
        this.nameAcc = _nameAcc;
        this.password = _password;
    }



    //#region getter-setter
    public get password(): string {
        return this._password;
    }
    public set password(value: string) {
        this._password = value;
    }

    public get nameAcc(): string {
        return this._nameAcc;
    }
    public set nameAcc(value: string) {
        this._nameAcc = value;
    }

    public get uuID(): string {
        return this._uuID;
    }
    public set uuID(value: string) {
        this._uuID = value;
    }
    //#endregion

    public async mainMenu(): Promise<void> {
        let answer: string;
    
        console.log("Main Menu\r\n".green);
    
        console.log("logged in as " + Main.getInstance().activeRegisteredUser.nameAcc);
        answer = await ConsoleHandling.showPossibilities(["Search Title (T)", "Overview Maps (M)", "Sign out (S)", "Build Game (B)", "Watch Own Game Stats (D)"], "What do you want to do?   ");

        switch (answer.toUpperCase()) {
            case "M":
                Main.getInstance().activeField = await this.selectMap(MapsAccess.FreeAndOwn);
                if (Main.getInstance().activeField == null || Main.getInstance().activeField == undefined) {
                    return;
                } else {
                    this.play();
                    return;
                }
            case "S":
                await this.signOutMenu();
                break;
            case "B":
                await this.buildMenu();
                break;
            case "T":
                Main.getInstance().activeField = await this.searchMap(MapsAccess.FreeAndOwn);
                if (Main.getInstance().activeField == null || Main.getInstance().activeField == undefined) {
                    return;
                } else {
                    this.play();
                    return;
                }
            case "D":
                let wantedMap: GameField = await this.selectMap(MapsAccess.Own);
                if (wantedMap == null)
                    return;
                let wantedStats: GameStats = await this.getGameStats(wantedMap);
                if (wantedStats != undefined) {
                    await this.showGameStats(wantedMap, wantedStats);
                } else {
                    console.log("the GameField has no Stats".red);
                }
                break;
            default:
                console.log("You can choose between (Q), (S)");
                return;
        } 
    }

    protected createActualString(_gameField: GameField, _number: number): string {
        let result: string;

        if (_gameField.regUserUuid == this.uuID && !_gameField.openAccess) 
            result = (_gameField.title + ", (" + _gameField.rows + "|" + _gameField.cols + "), (private Map) (" + (_number + 1) + ")").blue;
        else if (_gameField.regUserUuid == this.uuID && _gameField.openAccess)
            result = _gameField.title + ", (" + _gameField.rows + "|" + _gameField.cols + "), (creator), (" + (_number + 1) + ")";
        else if (_gameField.regUserUuid != this.uuID && _gameField.openAccess)
            result = _gameField.title + ", (" + _gameField.rows + "|" + _gameField.cols + "), (" + (_number + 1) + ")";
        return result;
    }

    protected getAllAvailableMaps(_access: MapsAccess): GameField[] {
        let allFreeMaps: GameField[] = [];
        for (let i: number = 0; i < Main.getInstance().allGameFields.length; i++) {
            switch (_access) {
                case (MapsAccess.FreeAndOwn):
                    if (Main.getInstance().allGameFields[i].openAccess || Main.getInstance().allGameFields[i].regUserUuid == this.uuID)
                        allFreeMaps.push(Main.getInstance().allGameFields[i]);
                    break;
                case (MapsAccess.Own):
                    if (Main.getInstance().allGameFields[i].regUserUuid == this.uuID)
                        allFreeMaps.push(Main.getInstance().allGameFields[i]);
                    break;

            }
            
        }
        return allFreeMaps;
    }

    protected getAllOwnMaps(): GameField[] {
        let allFreeMaps: GameField[] = [];
        for (let i: number = 0; i < Main.getInstance().allGameFields.length; i++) {
            if (Main.getInstance().allGameFields[i].regUserUuid == this.uuID)
                allFreeMaps.push(Main.getInstance().allGameFields[i]);
        }
        return allFreeMaps;
    }

    private async signOutMenu(): Promise<void> {
        while (true) {
            let answer: string  = await ConsoleHandling.showPossibilities(["Yes (Y)", "No (N)"], "Are you sure you want to sign out? ");
            switch (answer.toUpperCase()) {
                case "Y":
                    Main.getInstance().loggedIn = false;
                    Main.getInstance().activeRegisteredUser = null;
                    return;
                case "N":
                    return;
                default:
                    console.log("You can choose between (Y) or (N)");
                    break;
            }
        }
    }

    private async buildMenu(): Promise<void> {
        let newGameField: GameField = await GameFieldFactory.getInstance().buildMenu(this.uuID);
        if (newGameField != null && newGameField != undefined)
            this.saveGameField(newGameField);
        else
            return;
    }

    private saveGameField(_gameField: GameField): void {
        Main.getInstance().allGameFields.push(_gameField);
        FileHandler.getInstance().writeFile("gameFields.json", Main.getInstance().allGameFields);
        console.log("saved Gamefield");
    }

    private getGameStats(_gameField: GameField): GameStats {
        let wantedGameStats: GameStats;
        let allGameStats: GameStats[] = Main.getInstance().allGameStats;
        for (let i: number = 0; i < allGameStats.length; i++) {
            if (allGameStats[i].gameUuid == _gameField.uuid)
                wantedGameStats = allGameStats[i];
        }
        return wantedGameStats;
    }

    private async showGameStats(_gameField: GameField, _gameStats: GameStats): Promise<void> {
        console.log(("Game Title: " + _gameField.title).green);
        console.log("All Plays: " + _gameStats.numberGameWasPlayed);
        console.log("Average Moves: " + _gameStats.average());
        console.log("All Moves: " + _gameStats.allMoves);
        await ConsoleHandling.question("Press anything to return    ");
    }
}