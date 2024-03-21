"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickApple = void 0;
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
async function pickApple(ctx, dto) {
    const keyParts = [dto.PlantedBy, dto.variety, dto.index.toString()];
    const key = ctx.stub.createCompositeKey(AppleTree_1.AppleTree.INDEX_KEY, keyParts);
    const tree = await (0, chaincode_1.getObjectByKey)(ctx, AppleTree_1.AppleTree, key);
    tree.ensureCanPick(ctx.txUnixTime).pick();
    await (0, chaincode_1.putChainObject)(ctx, tree);
}
exports.pickApple = pickApple;
