"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plantTree = exports.plantTrees = void 0;
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
const api_1 = require("@gala-chain/api");
const chaincode_1 = require("@gala-chain/chaincode");
const AppleTree_1 = require("./AppleTree");
async function plantTrees(ctx, dto) {
    const ops = dto.trees.map((tree) => plantTree(ctx, tree));
    return await Promise.all(ops);
}
exports.plantTrees = plantTrees;
async function plantTree(ctx, dto) {
    const tree = new AppleTree_1.AppleTree(ctx.callingUser, dto.variety, dto.index, ctx.txUnixTime);
    const existingTree = await (0, chaincode_1.getObjectByKey)(ctx, AppleTree_1.AppleTree, tree.getCompositeKey()).catch(() => undefined);
    if (existingTree !== undefined) {
        throw new api_1.ConflictError("Tree already exists on chain", existingTree.toPlainObject());
    }
    await (0, chaincode_1.putChainObject)(ctx, tree);
    return tree;
}
exports.plantTree = plantTree;
