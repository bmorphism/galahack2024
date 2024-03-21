import { GalaChainContext } from "@gala-chain/chaincode";
import { FetchTreesDto, PagedTreesDto } from "./dtos";
export declare function fetchTrees(ctx: GalaChainContext, dto: FetchTreesDto): Promise<PagedTreesDto>;
