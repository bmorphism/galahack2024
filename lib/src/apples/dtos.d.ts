import { ChainCallDTO } from "@gala-chain/api";
import { AppleTree } from "./AppleTree";
import { Variety } from "./types";
export declare class AppleTreeDto extends ChainCallDTO {
    readonly variety: Variety;
    readonly index: number;
    constructor(variety: Variety, index: number);
}
export declare class AppleTreesDto extends ChainCallDTO {
    readonly trees: AppleTreeDto[];
    constructor(trees: AppleTreeDto[]);
}
export declare class PickAppleDto extends ChainCallDTO {
    readonly PlantedBy: string;
    readonly variety: Variety;
    readonly index: number;
    constructor(treePlantedBy: string, variety: Variety, index: number);
}
export declare class FetchTreesDto extends ChainCallDTO {
    readonly plantedBy?: string;
    readonly variety?: Variety;
    readonly index?: number;
    readonly bookmark?: string;
    readonly limit?: number;
    constructor(plantedBy?: string, variety?: Variety, index?: number, bookmark?: string, limit?: number);
}
export declare class PagedTreesDto {
    readonly trees: AppleTree[];
    readonly bookmark: string;
    constructor(trees: AppleTree[], bookmark: string);
}
