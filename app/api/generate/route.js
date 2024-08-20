import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getAuth, clerkClient } from "@clerk/nextjs/server"; // Import clerkClient for user retrieval

export async function POST(req) {
    // Get the authenticated user
    const { userId } = getAuth(req);

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Fetch the user object using the 
        // const startTime = performance.now(); // Start timing

        const client = clerkClient();
        const user = await client.users.getUser(userId);
        const isPaidUser = user?.publicMetadata?.isPaidUser || false; // Check if the user is a paid user
        const maxFlashcards = isPaidUser ? 100 : 8; // Set the max number of flashcards based on user type
        

        // const startTime = performance.now();
        const systemPrompt = `
        you are a flashcard creator designed to help users learn and memorize concepts efficiently. 
        Your main objective is to generate flashcards based on the input provided by the user. 
        Each flashcard should include a question or term on one side and an answer or explanation on the other.

        Features you should include:
        1. **Ease of Use**: Users should be able to input topics or terms easily, and you should generate flashcards that are clear and concise.
        2. **Customization**: Allow users to customize flashcards, including adding images, multiple-choice options, or additional hints if needed.
        3. **Review System**: Implement a spaced repetition system to help users review flashcards at optimal intervals for long-term retention.
        4. **Category Organization**: Flashcards should be categorized by topic, difficulty level, or user preference to make studying more organized.
        5. **Progress Tracking**: Track the user's progress, showing how well they are doing with each set of flashcards, and suggest which ones to review more frequently.
        6. **Accessibility**: Ensure that the flashcards are accessible on various devices, with a focus on responsive design and user-friendly navigation.
        7. Only generate a maximum of ${maxFlashcards} flashcards.
        Goals:
        - Help users learn efficiently by creating effective flashcards.
        - Provide a seamless and intuitive user experience.
        - Encourage regular review sessions through reminders and progress tracking.
        - Support a wide range of subjects and learning styles.
        - Provided input generate c
        - Note: must max of two sentences

        Return in the following JSON format always:

        {
            "flashcards": [
                    {
                        "front":"front of card",
                        "back": "back of card"
                    }
                ]
        }`;

        const openai = new OpenAI();
        const data = await req.text();

        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: data }
            ],
            model: 'gpt-4o-mini', // Assuming 'gpt-4o' was a typo, it should be 'gpt-4'
        });

        const flashcards = JSON.parse(completion.choices[0].message.content);
        // const endTime = performance.now(); 
        // console.log(`API chat request took ${(endTime - startTime) / 1000} seconds`);

        return NextResponse.json(flashcards.flashcards);
    } catch (error) {
        console.error("Error generating flashcards:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
