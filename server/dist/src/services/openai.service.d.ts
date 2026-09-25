import OpenAI from 'openai';
export declare class OpenAiService {
    private readonly logger;
    private readonly client;
    private readonly MAX_RETRIES;
    private readonly RETRY_DELAY_MS;
    constructor();
    assessClaim(claimText: string, evidenceSummary: string): Promise<{
        parsed: any;
        raw: OpenAI.Chat.Completions.ChatCompletion & {
            _request_id?: string | null;
        };
    }>;
    private sleep;
}
