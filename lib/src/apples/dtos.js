"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagedTreesDto = exports.FetchTreesDto = exports.PickAppleDto = exports.AppleTreesDto = exports.AppleTreeDto = void 0;
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
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const AppleTree_1 = require("./AppleTree");
const types_1 = require("./types");
class AppleTreeDto extends api_1.ChainCallDTO {
    constructor(variety, index) {
        super();
        this.variety = variety;
        this.index = index;
    }
}
exports.AppleTreeDto = AppleTreeDto;
tslib_1.__decorate([
    (0, api_1.StringEnumProperty)(types_1.Variety),
    tslib_1.__metadata("design:type", String)
], AppleTreeDto.prototype, "variety", void 0);
class AppleTreesDto extends api_1.ChainCallDTO {
    constructor(trees) {
        super();
        this.trees = trees;
    }
}
exports.AppleTreesDto = AppleTreesDto;
tslib_1.__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => AppleTreeDto),
    (0, class_validator_1.ArrayNotEmpty)(),
    tslib_1.__metadata("design:type", Array)
], AppleTreesDto.prototype, "trees", void 0);
class PickAppleDto extends api_1.ChainCallDTO {
    constructor(treePlantedBy, variety, index) {
        super();
        this.PlantedBy = treePlantedBy;
        this.variety = variety;
        this.index = index;
    }
}
exports.PickAppleDto = PickAppleDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PickAppleDto.prototype, "PlantedBy", void 0);
tslib_1.__decorate([
    (0, api_1.StringEnumProperty)(types_1.Variety),
    tslib_1.__metadata("design:type", String)
], PickAppleDto.prototype, "variety", void 0);
class FetchTreesDto extends api_1.ChainCallDTO {
    constructor(plantedBy, variety, index, bookmark, limit) {
        super();
        this.plantedBy = plantedBy;
        this.variety = variety;
        this.index = index;
        this.bookmark = bookmark;
        this.limit = limit;
    }
}
exports.FetchTreesDto = FetchTreesDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.ValidateIf)((o) => o.plantedBy !== undefined || o.variety !== undefined),
    tslib_1.__metadata("design:type", String)
], FetchTreesDto.prototype, "plantedBy", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsIn)(Object.keys(types_1.Variety)),
    (0, class_validator_1.ValidateIf)((o) => o.variety !== undefined || o.index !== undefined),
    tslib_1.__metadata("design:type", String)
], FetchTreesDto.prototype, "variety", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Number)
], FetchTreesDto.prototype, "index", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], FetchTreesDto.prototype, "bookmark", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Number)
], FetchTreesDto.prototype, "limit", void 0);
class PagedTreesDto {
    constructor(trees, bookmark) {
        this.trees = trees;
        this.bookmark = bookmark;
    }
}
exports.PagedTreesDto = PagedTreesDto;
tslib_1.__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => AppleTree_1.AppleTree),
    tslib_1.__metadata("design:type", Array)
], PagedTreesDto.prototype, "trees", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PagedTreesDto.prototype, "bookmark", void 0);
