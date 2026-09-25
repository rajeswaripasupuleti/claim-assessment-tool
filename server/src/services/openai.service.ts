import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAiService {
  private readonly logger = new Logger(OpenAiService.name);
  private readonly client: OpenAI;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY_MS = 1000;

  constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async assessClaim(claimText: string, evidenceSummary: string) {
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
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        this.logger.warn(`OpenAI call failed (attempt ${attempt}/${this.MAX_RETRIES}): ${message}`);

        if (attempt === this.MAX_RETRIES) {
          throw new Error(`OpenAI call failed after ${this.MAX_RETRIES} attempts: ${message}`);
        }

        await this.sleep(this.RETRY_DELAY_MS);
      }
    }

    // Unreachable, but keeps TypeScript happy about a guaranteed return type
    throw new Error('OpenAI call failed unexpectedly');
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}