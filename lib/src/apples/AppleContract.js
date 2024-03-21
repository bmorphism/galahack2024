"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppleContract = void 0;
const tslib_1 = require("tslib");
/*
 * Copyright (c) Gala Games Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const chaincode_1 = require("@gala-chain/chaincode");
const package_json_1 = require("../../package.json");
const dtos_1 = require("./dtos");
const fetchTrees_1 = require("./fetchTrees");
const pickApple_1 = require("./pickApple");
const plantTrees_1 = require("./plantTrees");
class AppleContract extends chaincode_1.GalaContract {
    constructor() {
        super("AppleContract", package_json_1.version);
    }
    async PlantTree(ctx, dto) {
        await (0, plantTrees_1.plantTree)(ctx, dto);
    }
    async PlantTrees(ctx, dto) {
        await (0, plantTrees_1.plantTrees)(ctx, dto);
    }
    async FetchTrees(ctx, dto) {
        return await (0, fetchTrees_1.fetchTrees)(ctx, dto);
    }
    async PickApple(ctx, dto) {
        return await (0, pickApple_1.pickApple)(ctx, dto);
    }
}
exports.AppleContract = AppleContract;
tslib_1.__decorate([
    (0, chaincode_1.Submit)({
        in: dtos_1.AppleTreeDto
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [chaincode_1.GalaChainContext, dtos_1.AppleTreeDto]),
    tslib_1.__metadata("design:returntype", Promise)
], AppleContract.prototype, "PlantTree", null);
tslib_1.__decorate([
    (0, chaincode_1.Submit)({
        in: dtos_1.AppleTreesDto
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [chaincode_1.GalaChainContext, dtos_1.AppleTreesDto]),
    tslib_1.__metadata("design:returntype", Promise)
], AppleContract.prototype, "PlantTrees", null);
tslib_1.__decorate([
    (0, chaincode_1.Evaluate)({
        in: dtos_1.FetchTreesDto,
        out: dtos_1.PagedTreesDto
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [chaincode_1.GalaChainContext, dtos_1.FetchTreesDto]),
    tslib_1.__metadata("design:returntype", Promise)
], AppleContract.prototype, "FetchTrees", null);
tslib_1.__decorate([
    (0, chaincode_1.Submit)({
        in: dtos_1.PickAppleDto
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [chaincode_1.GalaChainContext, dtos_1.PickAppleDto]),
    tslib_1.__metadata("design:returntype", Promise)
], AppleContract.prototype, "PickApple", null);
