import { GalaChainContext } from "@gala-chain/chaincode";
import { AppleTree } from "./AppleTree";
import { AppleTreeDto, AppleTreesDto } from "./dtos";
export declare function plantTrees(ctx: GalaChainContext, dto: AppleTreesDto): Promise<AppleTree[]>;
export declare function plantTree(ctx: GalaChainContext, dto: AppleTreeDto): Promise<AppleTree>;
