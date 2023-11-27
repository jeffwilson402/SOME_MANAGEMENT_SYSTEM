export declare const RiskType: {
    Technology: string[];
    Process: string[];
    Data: string[];
    Asset: string[];
};
declare class Lookup {
    data: any[];
    quartile: number;
    keyData: string[];
    getData(): any[];
    vLookup(value: string, index: number): number;
}
export declare class Table_22 extends Lookup {
    data: {
        type: string;
        projNum: number;
        xpos: number;
        ypos: number;
    }[];
    constructor();
}
export declare const Table22: Table_22;
export declare class Table_223 extends Lookup {
    data: {
        type: string;
        projNum: number;
        xpos: number;
        ypos: number;
    }[];
    constructor();
}
export declare const Table223: Table_223;
export declare function degreesToRadians(degrees: number): number;
export {};
