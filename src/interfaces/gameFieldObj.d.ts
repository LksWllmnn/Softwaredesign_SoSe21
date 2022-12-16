import { GameQuad } from "../classes/GameQuad";

export interface GameFieldObj {
    _title: string;
    _openAccess: boolean;
    _regUserUuid: string;
    _startingPointX: number;
    _startingPointY: number;
    _cols: number;
    _rows: number;
    _uuid: string;
    _quads: GameQuad[][];
}