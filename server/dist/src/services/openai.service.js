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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var OpenAiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAiService = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = __importDefault(require("openai"));
let OpenAiService = OpenAiService_1 = class OpenAiService {
    logger = new common_1.Logger(OpenAiService_1.name);
    client;
    MAX_RETRIES = 3;
    RETRY_DELAY_MS = 1000;
    constructor() {
        this.client = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
    }
    async assessClaim(claimText, evidenceSummary) {
        const systemPrompt = `You are a scientific claims evaluator for a cosmetics R&D lab.
Given a product claim and a summary of clinical study data, decide if the study justifies the claim.
Respond ONLY with valid JSON, no markdown, in this exact shape:
{"justified": boolean, "confidenceScore": number (0 to 1), "reasoning": string}`;
        const userPrompt = `Claim: ${claimText}\n\nEvidence summary:\n${evidenceSummary}`;
        for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
            try {
                const response = await this.client.chat.completions.create({
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt },
                    ],
                    response_format: { type: 'json_object' },
                });
                const raw = response.choices[0].message.content;
                if (!raw) {
                    throw new Error('OpenAI returned empty content');
                }
                const parsed = JSON.parse(raw);
                return { parsed, raw: response };
            }
            catch (err) {
                const message = err instanceof Error ? err.message : String(err);
                this.logger.warn(`OpenAI call failed (attempt ${attempt}/${this.MAX_RETRIES}): ${message}`);
                if (attempt === this.MAX_RETRIES) {
                    throw new Error(`OpenAI call failed after ${this.MAX_RETRIES} attempts: ${message}`);
                }
                await this.sleep(this.RETRY_DELAY_MS);
            }
        }
        throw new Error('OpenAI call failed unexpectedly');
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
};
exports.OpenAiService = OpenAiService;
exports.OpenAiService = OpenAiService = OpenAiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], OpenAiService);
//# sourceMappingURL=openai.service.js.map