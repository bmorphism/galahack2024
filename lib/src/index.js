"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializers = exports.contracts = void 0;
// sort-imports-ignore
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
require("dotenv/config");
const chaincode_1 = require("@gala-chain/chaincode");
const apples_1 = require("./apples");
const token_1 = require("./token");
const pk_1 = require("./pk");
exports.contracts = [
    pk_1.PublicKeyContract,
    token_1.GalaChainTokenContract,
    apples_1.AppleContract
];
exports.serializers = {
    transaction: "galaJsonSerializer",
    serializers: {
        galaJsonSerializer: chaincode_1.GalaJSONSerializer
    }
};
