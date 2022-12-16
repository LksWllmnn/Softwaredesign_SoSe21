import { FileHandler } from "./FileHandler";
import { RegisteredUser } from "./RegisteredUser";
import { GameField } from "./GameField";
import { RegisteredUserObj } from "../interfaces/registeredUserObj";
import { GameFieldObj } from "../interfaces/gameFieldObj";
import { GameQuad } from "./GameQuad";
import { GameQuadObj } from "../interfaces/gameQuad";
import { QuadFactory } from "./QuadFactory";
import { GameStats } from "./GameStats";
import { GameStatsObj } from "../interfaces/gameStatsObj";

export class DataLoader {

    private static instance: DataLoader;

    public static getInstance(): DataLoader {
        if (DataLoader.instance == null)
            DataLoader.instance = new DataLoader();

        return DataLoader.instance;
    }

    async loadAccounts(): Promise<RegisteredUser[]> {
        let allRegisteredUsers: RegisteredUser[] = [];
        let allAccountsObj: RegisteredUserObj[];
        try {
            allAccountsObj = FileHandler.getInstance().readArrayFile("registeredUsers.json");

            for (let obj of allAccountsObj) {
                let newAccountInst: RegisteredUser = new RegisteredUser(obj._uuID, obj._nameAcc, obj._password);
                allRegisteredUsers.push(newAccountInst);
            }
            
        } catch {
            console.log("RegisteredUsers: there is sth. wrong or there is no data right now");
            allRegisteredUsers = [];
        }
        return (allRegisteredUsers);
    }

    async loadGameFields(): Promise<GameField[]> {
        let allGameFields: GameField[] = [];
        let allGameFieldsObj: GameFieldObj[];

        try {
            allGameFieldsObj = FileHandler.getInstance().readArrayFile("gamefields.json");

            for (let obj of allGameFieldsObj) {
                let newGameFieldInst: GameField = new GameField(obj._title, obj._openAccess, obj._regUserUuid, obj._startingPointX, obj._startingPointY, obj._cols, obj._rows,  this.recognizeQuads(obj), obj._uuid);
                allGameFields.push(newGameFieldInst);
            }
            
        } catch {
            console.log("GameFields: there is sth. wrong or there is no data right now");
            allGameFields = [];
        }
        return (allGameFields);
    }

    async loadGameStats(): Promise<GameStats[]> {
        let allGameStats: GameStats[] = [];
        let allGameStatsObj: GameStatsObj[];

        try {
            allGameStatsObj = FileHandler.getInstance().readArrayFile("gameStats.json");

            for (let obj of allGameStatsObj) {
                let newGameStatsInst: GameStats = new GameStats(obj._gameUuid, obj._numberGameWasPlayed, obj._allMoves, obj._uuid);
                allGameStats.push(newGameStatsInst);
            }
            
        } catch {
            console.log("Stats: there is sth. wrong or there is no data right now");
            allGameStats = [];
        }
        return (allGameStats);
    }

    private recognizeQuads(_obj: GameFieldObj): GameQuad[][] {
        let allQuads: GameQuad[][] = [];
        for (let irows: number = 0; irows < _obj._quads.length; irows++) {
            allQuads.push([]);
        }
            
        for (let irows: number = 0; irows < _obj._quads.length; irows++) {
            for (let icols: number = 0; icols < _obj._quads[irows].length; icols++) {
                let quadObj: GameQuadObj = _obj._quads[irows][icols];
                let quad: GameQuad = QuadFactory.getInstance().createQuad(quadObj._title, quadObj._col, quadObj._row);
                allQuads[irows].push(quad);
            }   
        }
        return allQuads;
    }
}