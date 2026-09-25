"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaimsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const claims_service_1 = require("../services/claims.service");
const assess_claim_dto_1 = require("../dto/assess-claim.dto");
const create_claim_dto_1 = require("../dto/create-claim.dto");
let ClaimsController = class ClaimsController {
    claimsService;
    constructor(claimsService) {
        this.claimsService = claimsService;
    }
    async findAll() {
        return this.claimsService.listClaims();
    }
    async create(dto) {
        return this.claimsService.createClaim(dto);
    }
    async assess(dto, file) {
        if (!file) {
            throw new common_1.BadRequestException('Evidence file is required');
        }
        return this.claimsService.assessClaim(dto.claimId, dto.uploadedBy, file);
    }
};
exports.ClaimsController = ClaimsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClaimsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_claim_dto_1.CreateClaimDto]),
    __metadata("design:returntype", Promise)
], ClaimsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('assess'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assess_claim_dto_1.AssessClaimDto, Object]),
    __metadata("design:returntype", Promise)
], ClaimsController.prototype, "assess", null);
exports.ClaimsController = ClaimsController = __decorate([
    (0, common_1.Controller)('api/claims'),
    __metadata("design:paramtypes", [claims_service_1.ClaimsService])
], ClaimsController);
//# sourceMappingURL=claims.controller.js.map