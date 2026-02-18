import { env } from "@orksys-survey/env/server";
import OpenAI from "openai";
import { z } from "zod";

// Initialize OpenAI client with Groq base URL
const createGroqClient = () => {
	if (!env.GROQ_API_KEY) {
		throw new Error("GROQ_API_KEY is not configured");
	}

	return new OpenAI({
		apiKey: env.GROQ_API_KEY,
		baseURL: "https://api.groq.com/openai/v1",
	});
};

// Get model to use
const getModel = () => env.GROQ_MODEL || "llama-3.3-70b-versatile";

// Response schemas for structured output
const TextSummarySchema = z.object({
	bullets: z.array(z.string()).length(3),
});

const SentimentSchema = z.object({
	positive: z.number().min(0).max(100),
	neutral: z.number().min(0).max(100),
	negative: z.number().min(0).max(100),
});

const KeywordsSchema = z.object({
	keywords: z.array(
		z.object({
			word: z.string(),
			count: z.number(),
		}),
	),
});

export type TextSummaryResponse = z.infer<typeof TextSummarySchema>;
export type SentimentResponse = z.infer<typeof SentimentSchema>;
export type KeywordsResponse = z.infer<typeof KeywordsSchema>;

// Extended type with calculated weight
export type KeywordsWithWeights = {
	keywords: Array<
		z.infer<typeof KeywordsSchema>["keywords"][number] & { weight: number }
	>;
};

/**
 * Generate a 3-bullet summary of text responses
 */
export async function generateTextSummary(
	responses: string[],
): Promise<{ data: TextSummaryResponse; tokensUsed: number }> {
	if (responses.length === 0) {
		return {
			data: { bullets: ["No responses to analyze"] },
			tokensUsed: 0,
		};
	}

	const client = createGroqClient();
	const model = getModel();

	// Combine responses, truncating if too long
	const combinedText = responses
		.slice(0, 100) // Limit to 100 responses
		.map((r) => r.substring(0, 500)) // Truncate each to 500 chars
		.join("\n\n---\n\n");

	const prompt = `Analyze the following survey responses and provide exactly 3 bullet points summarizing the key themes and insights. Each bullet should be concise (max 15 words) and capture a distinct insight.

Responses:
${combinedText}

Respond with a JSON object containing a "bullets" array with exactly 3 strings.`;

	const response = await client.chat.completions.create({
		model,
		messages: [
			{
				role: "system",
				content:
					"You are an expert at analyzing survey responses. Always respond with valid JSON containing a 'bullets' array with exactly 3 strings.",
			},
			{ role: "user", content: prompt },
		],
		temperature: 0.3,
		max_tokens: 500,
		response_format: { type: "json_object" },
	});

	const content = response.choices[0]?.message?.content;
	if (!content) {
		throw new Error("No response from LLM");
	}

	const parsed = TextSummarySchema.parse(JSON.parse(content));

	return {
		data: parsed,
		tokensUsed: response.usage?.total_tokens ?? 0,
	};
}

/**
 * Analyze sentiment of text responses
 */
export async function analyzeSentiment(
	responses: string[],
): Promise<{ data: SentimentResponse; tokensUsed: number }> {
	if (responses.length === 0) {
		return {
			data: { positive: 0, neutral: 100, negative: 0 },
			tokensUsed: 0,
		};
	}

	const client = createGroqClient();
	const model = getModel();

	const combinedText = responses
		.slice(0, 100)
		.map((r) => r.substring(0, 500))
		.join("\n\n---\n\n");

	const prompt = `Analyze the overall sentiment of these survey responses. Provide percentages (0-100) for positive, neutral, and negative sentiment that sum to 100.

Responses:
${combinedText}

Respond with a JSON object containing "positive", "neutral", and "negative" numbers that sum to 100.`;

	const response = await client.chat.completions.create({
		model,
		messages: [
			{
				role: "system",
				content:
					"You are a sentiment analysis expert. Always respond with valid JSON containing 'positive', 'neutral', and 'negative' numbers that sum to 100.",
			},
			{ role: "user", content: prompt },
		],
		temperature: 0.3,
		max_tokens: 100,
		response_format: { type: "json_object" },
	});

	const content = response.choices[0]?.message?.content;
	if (!content) {
		throw new Error("No response from LLM");
	}

	const parsed = SentimentSchema.parse(JSON.parse(content));

	// Normalize to sum to 100
	const total = parsed.positive + parsed.neutral + parsed.negative;
	const normalized = {
		positive: Math.round((parsed.positive / total) * 100),
		neutral: Math.round((parsed.neutral / total) * 100),
		negative:
			100 -
			Math.round((parsed.positive / total) * 100) -
			Math.round((parsed.neutral / total) * 100),
	};

	return {
		data: normalized,
		tokensUsed: response.usage?.total_tokens ?? 0,
	};
}

/**
 * Extract keywords from text responses
 */
export async function extractKeywords(
	responses: string[],
): Promise<{ data: KeywordsWithWeights; tokensUsed: number }> {
	if (responses.length === 0) {
		return {
			data: { keywords: [] },
			tokensUsed: 0,
		};
	}

	const client = createGroqClient();
	const model = getModel();

	const combinedText = responses
		.slice(0, 100)
		.map((r) => r.substring(0, 500))
		.join("\n\n---\n\n");

	const prompt = `Extract the top 15 most important keywords or phrases from these survey responses. Focus on meaningful terms that represent key themes, not common words.

Responses:
${combinedText}

Respond with a JSON object containing a "keywords" array. Each item should have "word" (string) and "count" (number).`;

	const response = await client.chat.completions.create({
		model,
		messages: [
			{
				role: "system",
				content:
					"You are a text analysis expert specializing in keyword extraction. Always respond with valid JSON containing a 'keywords' array with objects having 'word' and 'count' properties.",
			},
			{ role: "user", content: prompt },
		],
		temperature: 0.3,
		max_tokens: 500,
		response_format: { type: "json_object" },
	});

	const content = response.choices[0]?.message?.content;
	if (!content) {
		throw new Error("No response from LLM");
	}

	const parsed = KeywordsSchema.parse(JSON.parse(content));

	// Calculate weights based on counts
	const maxCount = Math.max(...parsed.keywords.map((k) => k.count), 1);
	const keywordsWithWeights = parsed.keywords.map((k) => ({
		word: k.word,
		count: k.count,
		weight: Math.max(0.1, k.count / maxCount),
	}));

	return {
		data: { keywords: keywordsWithWeights },
		tokensUsed: response.usage?.total_tokens ?? 0,
	};
}

/**
 * Check if Groq is configured
 */
export function isGroqConfigured(): boolean {
	return !!env.GROQ_API_KEY;
}
