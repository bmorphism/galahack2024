"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppleTree = void 0;
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
const api_1 = require("@gala-chain/api");
const bignumber_js_1 = tslib_1.__importDefault(require("bignumber.js"));
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const types_1 = require("./types");
class AppleTree extends api_1.ChainObject {
    constructor(plantedBy, variety, index, plantedAt) {
        super();
        this.plantedBy = plantedBy;
        this.variety = variety;
        this.index = index;
        this.plantedAt = plantedAt;
        this.applesPicked = new bignumber_js_1.default(0);
    }
    ageInYears(now) {
        if (this.plantedAt > now) {
            throw new api_1.DefaultError("Tree planted in the future", { plantedAt: this.plantedAt, now });
        }
        return new bignumber_js_1.default(now - this.plantedAt)
            .dividedBy(365 * 24 * 60 * 60 * 1000)
            .integerValue(bignumber_js_1.default.ROUND_FLOOR);
    }
    applesTotal(now) {
        const ageInYears = this.ageInYears(now);
        if (ageInYears.isLessThan(1)) {
            return new bignumber_js_1.default(0);
        }
        return new bignumber_js_1.default(2).pow(ageInYears.minus(1));
    }
    canPick(now) {
        return this.applesPicked.isLessThan(this.applesTotal(now));
    }
    ensureCanPick(now) {
        if (!this.canPick(now)) {
            throw new NoApplesLeftError(this.applesPicked, this.applesTotal(now));
        }
        const pick = () => {
            this.applesPicked = this.applesPicked.plus(1);
        };
        return { pick };
    }
}
exports.AppleTree = AppleTree;
AppleTree.INDEX_KEY = "GCAPPL";
tslib_1.__decorate([
    (0, api_1.ChainKey)({ position: 0 }),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], AppleTree.prototype, "plantedBy", void 0);
tslib_1.__decorate([
    (0, api_1.ChainKey)({ position: 1 }),
    (0, api_1.StringEnumProperty)(types_1.Variety),
    tslib_1.__metadata("design:type", String)
], AppleTree.prototype, "variety", void 0);
tslib_1.__decorate([
    (0, api_1.ChainKey)({ position: 2 }),
    tslib_1.__metadata("design:type", Number)
], AppleTree.prototype, "index", void 0);
tslib_1.__decorate([
    (0, api_1.BigNumberProperty)(),
    tslib_1.__metadata("design:type", bignumber_js_1.default)
], AppleTree.prototype, "applesPicked", void 0);
tslib_1.__decorate([
    (0, class_transformer_1.Exclude)(),
    tslib_1.__metadata("design:type", Object)
], AppleTree, "INDEX_KEY", void 0);
class NoApplesLeftError extends api_1.NotFoundError {
    constructor(total, picked) {
        super(`No apples left to pick. Total: ${total}, picked: ${picked}`);
    }
}
