import { ChainObject } from "@gala-chain/api";
import BigNumber from "bignumber.js";
import { Variety } from "./types";
export declare class AppleTree extends ChainObject {
    static INDEX_KEY: string;
    readonly plantedBy: string;
    readonly variety: Variety;
    readonly index: number;
    readonly plantedAt: number;
    applesPicked: BigNumber;
    constructor(plantedBy: string, variety: Variety, index: number, plantedAt: number);
    ageInYears(now: number): BigNumber;
    applesTotal(now: number): BigNumber;
    canPick(now: number): boolean;
    ensureCanPick(now: number): {
        pick(): void;
    };
}
