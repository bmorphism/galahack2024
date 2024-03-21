import { GalaChainContext, GalaContract } from "@gala-chain/chaincode";
import { AppleTreeDto, AppleTreesDto, FetchTreesDto, PagedTreesDto, PickAppleDto } from "./dtos";
export declare class AppleContract extends GalaContract {
    constructor();
    PlantTree(ctx: GalaChainContext, dto: AppleTreeDto): Promise<void>;
    PlantTrees(ctx: GalaChainContext, dto: AppleTreesDto): Promise<void>;
    FetchTrees(ctx: GalaChainContext, dto: FetchTreesDto): Promise<PagedTreesDto>;
    PickApple(ctx: GalaChainContext, dto: PickAppleDto): Promise<void>;
}
