"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTrees = void 0;
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
const AppleTree_1 = require("./AppleTree");
const dtos_1 = require("./dtos");
async function fetchTrees(ctx, dto) {
    var _a;
    const keyParts = (0, chaincode_1.takeUntilUndefined)(dto.plantedBy, dto.variety, (_a = dto.index) === null || _a === void 0 ? void 0 : _a.toString());
    const { results, metadata } = await (0, chaincode_1.getObjectsByPartialCompositeKeyWithPagination)(ctx, AppleTree_1.AppleTree.INDEX_KEY, keyParts, AppleTree_1.AppleTree, dto.bookmark, dto.limit);
    return new dtos_1.PagedTreesDto(results, metadata.bookmark);
}
exports.fetchTrees = fetchTrees;
