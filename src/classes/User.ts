import * as bcrypt from "bcrypt"; 
import "colors";
import ConsoleHandling from "./ConsoleHandling";
import { FileHandler } from "./FileHandler";
import { RegisteredUser } from "./RegisteredUser";
import { Main } from "./Main";
import { v4 as uuidv4 } from "uuid";
import { GameField } from "./GameField";
import { MapsAccess } from "../enums/mapsAccess";
import { SearchFieldMapObj } from "../interfaces/searchFieldMapObj";

export class User {
    public async mainMenu(): Promise<void> {
        console.log("Main Menu\r\n".green);
        let answer: string;
        console.log("Using as guest!");
        answer = await ConsoleHandling.showPossibilities(["Search Title (T)", "Overview Maps (M)", "Sign in (S)", "Register (R)"], "What do you want to do?  ");

        switch (answer.toUpperCase()) {
            case "M":
                Main.getInstance().activeField = await this.selectMap(MapsAccess.AllFree);
                if (Main.getInstance().activeField == null || Main.getInstance().activeField == undefined) {
                    return;
                } else {
                    this.play();
                    return;
                }
            case "S":
                await this.signInMenu();
                break;
            case "R":
                await this.registerMenu();
                break;
            case "T":
                Main.getInstance().activeField = await this.searchMap(MapsAccess.AllFree);
                if (Main.getInstance().activeField == null || Main.getInstance().activeField == undefined) {
                    return;
                } else {
                    this.play();
                    return;
                }
            default:
                console.log("You can choose between (P), (S), (R), (T)");
                return;
        }
    }

    protected play(): void {
        Main.getInstance().playing = true;
    }

    protected activeSelection(_allAvailableMaps: GameField[], _activeBase: number): GameField[] {
        let activeSelection: GameField[] = [];

        if (_allAvailableMaps.length - _activeBase > 5) {
            for (let i: number = _activeBase; i < _activeBase + 5; i++) {
                activeSelection.push(_allAvailableMaps[i]);
            }
            
        } else {
            for (let i: number = _activeBase; i < _allAvailableMaps.length; i++) {
                activeSelection.push(_allAvailableMaps[i]);
            }
        }
        
        return activeSelection;
    }

    protected activeSelectionToString(_allFreeMaps: GameField[], _activeSelectionFields: GameField[], _activeBase: number, _select: boolean): string[] {
        let activeSelectionString: string[] = [];
        for (let i: number = 0; i < _activeSelectionFields.length; i++ ) {
            activeSelectionString.push(this.createActualString(_activeSelectionFields[i], activeSelectionString.length));  
        }
        activeSelectionString.push("__________");
        if (_allFreeMaps.length > _activeSelectionFields.length + _activeBase) {
            activeSelectionString.push("Next Page --> (6)");
        }
        if (_activeBase > 0) {
            activeSelectionString.push("<-- Page before (7)");
        }
        activeSelectionString.push("Quit process (X)");
        return activeSelectionString;
    }

    protected createActualString(_gameField: GameField, _number: number): string {
        let result: string;
        result = _gameField.title + ", (" + _gameField.rows + "|" + _gameField.cols + ") (" + (_number + 1) + ")";
        return result;
    }

    protected async getWantedField(_maps: GameField[]): Promise<GameField> {
        let wantedField: GameField;
        let base: number = 0;
        while (true) {
            let activeSelectionFields: GameField[] = this.activeSelection(_maps, base);
            let activeSelectionStrings: string[] = this.activeSelectionToString(_maps, activeSelectionFields, base, true);

            let answer: string = await ConsoleHandling.showPossibilities(activeSelectionStrings, "Which do you want to select? (number)  ");
            let regExNumber: RegExp = new RegExp("^[1-9]\d*$");
            if (regExNumber.test(answer)) {
                if (+answer < 6 && +answer >= 0 && activeSelectionFields[+answer - 1] != undefined) {
                    wantedField = activeSelectionFields[+answer - 1];
                    return wantedField;
                } else if (answer == "6" && base < _maps.length + 5) {
                    base += 5;
                } else if (answer == "7" && base > 0) {
                    base -= 5;
                }
            } else {
                if (answer.toUpperCase() == "X") {
                    return;
                }
                console.log("Not a number");
            }
        }     
    }

    protected async selectMap(_access: MapsAccess): Promise<GameField> {
        let wantedField: GameField;
        let allFreeMaps: GameField[] = this.getAllAvailableMaps(_access);
        wantedField = await this.getWantedField(allFreeMaps);
        return wantedField;
    }

    protected getAllAvailableMaps(_access: MapsAccess): GameField[] {
        let allFreeMaps: GameField[] = [];
        for (let i: number = 0; i < Main.getInstance().allGameFields.length; i++) {
            if (Main.getInstance().allGameFields[i].openAccess)
                allFreeMaps.push(Main.getInstance().allGameFields[i]);
        }
        return allFreeMaps;
    }

    protected async searchMap(_access: MapsAccess): Promise<GameField> {
        let answer: string = await ConsoleHandling.question("What title are you searching for?");
        let searchResults: GameField[] = this.searchResults(answer, _access);
        let wantedField: GameField = await this.getWantedField(searchResults);
        return wantedField;
    }

    protected searchResults(_answer: string, _access: MapsAccess): GameField[] {
        let results: GameField[] = [];
        let resultsMap: SearchFieldMapObj[] = [];
        let allAvailableFields: GameField[] =  this.getAllAvailableMaps(_access);
        let regString: string = _answer;
        let regAnswer: RegExp = new RegExp(regString, "i");
        

        for (let i: number = 0; i < allAvailableFields.length; i++) {
            
            let stringPos: number = allAvailableFields[i].title.search(regAnswer);
            if (stringPos > -1) {
                let newResultMapInst: SearchFieldMapObj = {_stringPos: stringPos, _gameField: allAvailableFields[i]};
                
                resultsMap.push(newResultMapInst);
            }
        }

        resultsMap.sort(this.sortNumber);
        for (let obj of resultsMap) {
            
            results.push(obj._gameField) ;
        }
        
        return results;
    }

    protected sortNumber(a: SearchFieldMapObj, b: SearchFieldMapObj): number {
        return a._stringPos - b._stringPos;
    }

    //#region SignIn and Register
    private async signInMenu(): Promise<void> {
        let inputName: string = await ConsoleHandling.question("type in username:   ");
        let inputPassword: string = await ConsoleHandling.question("type in password:   ");
        if (this.checkSignIn(inputName, inputPassword) != null) {
            console.log("You are logged in");
            Main.getInstance().loggedIn = true;
            Main.getInstance().activeRegisteredUser = this.checkSignIn(inputName, inputPassword);
            return;
        } else {
            console.log("Name or passwort not correct!");
            let answer: string;
            answer = await ConsoleHandling.showPossibilities(["Quit (Q)", "Try Again (T)"], "What do you want to do?    ");
            switch (answer.toUpperCase()) {
                case "Q":
                    console.log("Process aborded");
                    return;
                case "T":
                    await this.signInMenu();
                    break;
                default:
                    console.log("Process aborded");
                    return;
            }
        }
    }
    
    private checkSignIn(_inputName: string, _inputPassword: string): RegisteredUser {
        for (let iAccounts: number = 0; iAccounts < Main.getInstance().allRegisteredUsers.length; iAccounts++) {
            if (Main.getInstance().allRegisteredUsers[iAccounts].nameAcc == _inputName && bcrypt.compareSync(_inputPassword, Main.getInstance().allRegisteredUsers[iAccounts].password)) {
                return Main.getInstance().allRegisteredUsers[iAccounts];  
            }    
        }
        return null;
    }
    
    private async registerMenu(): Promise<void> {
        while (true) {
            console.log("Quit with X");
            let inputName: string = await ConsoleHandling.question("type in username:   ");
            if (inputName.toUpperCase() == "X") {
                return;
            }
            let inputPassword: string = await ConsoleHandling.question("type in password:   ");
            if (inputPassword.toUpperCase() == "X") {
                return;
            }
        
            const hash: string = bcrypt.hashSync(inputPassword, 10);
            let newUuid: string = uuidv4();
            let newAccount: RegisteredUser = new RegisteredUser(newUuid, inputName, hash);
            
            if (await this.register(newAccount)) {
                ConsoleHandling.printInput("congratulations! You got registered!".rainbow);
                console.log("You can sign in with your new account now");
                await Main.getInstance().loadAllPropertys();
                return;
            } else {
                let answer: string;
                answer = await ConsoleHandling.showPossibilities(["Quit (anything)", "Try Again (T)"], "What do you want to do?    ");
                switch (answer.toUpperCase()) {
                    case "T":
                        break;
                    default:
                        console.log("Quit process".red);
                        return;
                }
            }
        }
    }

    private register(_newAccount: RegisteredUser): boolean {
        if (!this.testAccountName(_newAccount.nameAcc)) {
            console.log("Just letters and numbers. Accountname has to have 4 - 12 charakters".red);
            return false;
        }
        for (let iAccounts: number = 0; iAccounts < Main.getInstance().allRegisteredUsers.length; iAccounts++) {
            if (Main.getInstance().allRegisteredUsers[iAccounts].nameAcc == _newAccount.nameAcc) {
                console.log("Account already exists!".red);
                return false;
            }   
        }
        Main.getInstance().allRegisteredUsers.push(_newAccount);
        FileHandler.getInstance().writeFile("registeredUsers.json", Main.getInstance().allRegisteredUsers);
        return true;
    } 

    private testAccountName(_name: string): boolean {
        let contRegEx: RegExp = new RegExp(/^[a-zA-Z0-9]\w{3,11}$/);
        return contRegEx.test(_name);
    }
    //#endregion
}