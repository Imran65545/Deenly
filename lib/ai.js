import Groq from "groq-sdk";
import { HfInference } from "@huggingface/inference";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "dummy",
});

/**
 * Generates text using AI with fallback mechanism.
 * @param {string} systemPrompt - The system instruction.
 * @param {string} userPrompt - The user query.
 * @returns {Promise<string>} - The generated text.
 */
export async function generateText(systemPrompt, userPrompt) {
    try {
        console.log("Attempting Groq AI...");
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
        });

        return completion.choices[0]?.message?.content || "";
    } catch (groqError) {
        console.warn("Groq API failed, switching to Hugging Face fallback...", groqError.message);

        const hfKey = process.env.HUGGINGFACE_API_KEY;
        if (!hfKey) {
            console.error("No HUGGINGFACE_API_KEY found. Cannot fallback.");
            throw new Error(`AI Service Unavailable: Primary failed (${groqError.message}) and No HUGGINGFACE_API_KEY.`);
        }

        return await generateWithHuggingFace(systemPrompt, userPrompt, hfKey);
    }
}

async function generateWithHuggingFace(systemPrompt, userPrompt, apiKey) {
    try {
        const hf = new HfInference(apiKey);

        console.log("Attempting Hugging Face Chat Completion...");

        // Meta Llama 3 8B is widely supported and robust
        const result = await hf.chatCompletion({
            model: "meta-llama/Meta-Llama-3-8B-Instruct",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            max_tokens: 500,
            temperature: 0.5,
        });

        return result.choices[0]?.message?.content || "";

    } catch (hfError) {
        console.error("Hugging Face SDK failed:", hfError);
        // Expose status code if available
        const status = hfError.statusCode || hfError.status || "Unknown";
        throw new Error(`HF SDK Fail (${status}): ${hfError.message}`);
    }
}
