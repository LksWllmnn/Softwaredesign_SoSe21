import { DataLoader } from "./DataLoader";
import "colors";
import { RegisteredUser } from "./RegisteredUser";
import { User } from "./User";
import { GameField } from "./GameField";
import { PlayerRole } from "./PlayerRole";
import { GameStats } from "./GameStats";

export class Main {
    private static instance: Main;
    private _loggedIn: boolean = false;
    private _activeRegisteredUser: RegisteredUser;
    
    private _allRegisteredUsers: RegisteredUser[];
    private _allGameFields: GameField[];
    private _allGameStats: GameStats[];
    
    private _playing: boolean = false;
    private _activeField: GameField;
    

    constructor() {
        console.log("\r\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\r\n*Welcome to TextAdventures* \r\n !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\r\n".green); 
    }

    public static getInstance(): Main {
        if (Main.instance == null)
            Main.instance = new Main();
        return Main.instance;
    }

    //#region getter-setter
    public get loggedIn(): boolean {
        return this._loggedIn;
    }
    public set loggedIn(value: boolean) {
        this._loggedIn = value;
    }
    public get activeRegisteredUser(): RegisteredUser {
        return this._activeRegisteredUser;
    }
    public set activeRegisteredUser(value: RegisteredUser) {
        this._activeRegisteredUser = value;
    }
    public get allRegisteredUsers(): RegisteredUser[] {
        return this._allRegisteredUsers;
    }
    public set allRegisteredUsers(value: RegisteredUser[]) {
        this._allRegisteredUsers = value;
    }
    public get allGameFields(): GameField[] {
        return this._allGameFields;
    }
    public set allGameFields(value: GameField[]) {
        this._allGameFields = value;
    }
    public get allGameStats(): GameStats[] {
        return this._allGameStats;
    }
    public set allGameStats(value: GameStats[]) {
        this._allGameStats = value;
    }
    public get playing(): boolean {
        return this._playing;
    }
    public set playing(value: boolean) {
        this._playing = value;
    }
    public get activeField(): GameField {
        return this._activeField;
    }
    public set activeField(value: GameField) {
        this._activeField = value;
    }
    //#endregion

    async loadAllPropertys(): Promise<void> {
        this.allRegisteredUsers = await DataLoader.getInstance().loadAccounts();
        this.allGameFields = await DataLoader.getInstance().loadGameFields();
        this.allGameStats = await DataLoader.getInstance().loadGameStats();
        //await this.mainMenu();
    }
    
    async mainMenu(): Promise<void> {
        while (true) {
            while (!this.playing) {
                if (this.loggedIn) {
                    await this.activeRegisteredUser.mainMenu();
                } else {
                    let defaultUser: User = new User();
                    await defaultUser.mainMenu();
                }
            }
            let newPlay: PlayerRole;
            try {
                newPlay = new PlayerRole(this.activeField, this.activeField.quads[this.activeField.startingPointX][this.activeField.startingPointY]);
            } catch {
                newPlay = new PlayerRole(this.activeField, this.activeField.quads[0][0]);
            }
            
            while (this.playing) {
                await newPlay.playing();
            }
        }
    }
}

start();

async function start(): Promise<void> {
    await Main.getInstance().loadAllPropertys();
    Main.getInstance().mainMenu();
}
