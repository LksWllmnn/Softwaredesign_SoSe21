import { GameQuad } from "./GameQuad";

export class QuadFactory {
    private static instance: QuadFactory;

    public static getInstance(): QuadFactory {
        if (QuadFactory.instance == null)
            QuadFactory.instance = new QuadFactory();
        return QuadFactory.instance;
    }

    public createQuad(_title: string, _col: number, _row: number): GameQuad {
        return new GameQuad(_title, _col, _row);
    }
}