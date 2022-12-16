"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline"));
class ConsoleHandling {
    constructor() {
        // logger object with syslog levels as specified loglevels
        // logs into build_service.log in directory log and onto console of running node.js process
        this.consoleLine = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        if (ConsoleHandling.instance)
            throw new Error("Use ConsoleHandling.Instance() instead new ConsoleHandling()");
        ConsoleHandling.instance = this;
    }
    static getInstance() {
        return ConsoleHandling.instance;
    }
    question(question) {
        let answer = "";
        return new Promise((resolve) => {
            this.consoleLine.question(question.toString(), (_answer) => {
                answer = _answer;
                resolve(answer);
            });
        });
    }
    showPossibilities(showPossibilities, question) {
        this.consoleLine.write("\n");
        this.consoleLine.write("Functions you can use: ");
        this.consoleLine.write("\n\n");
        for (let possibility of showPossibilities) {
            this.consoleLine.write(possibility.toString());
            this.consoleLine.write("\n");
        }
        this.consoleLine.write("\n");
        return new Promise((resolve) => this.consoleLine.question(question.toString(), (answer) => {
            resolve(answer);
        }));
    }
    printInput(input) {
        this.consoleLine.write(input);
        this.consoleLine.write("\n");
    }
    closeConsole() {
        this.consoleLine.close();
    }
}
ConsoleHandling.instance = new ConsoleHandling();
exports.default = ConsoleHandling.getInstance();
//# sourceMappingURL=ConsoleHandling.js.map