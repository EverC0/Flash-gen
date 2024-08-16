import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getAuth } from "@clerk/nextjs/server"; 



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
7. Only generate a maximum of 8 flashcards.
Goals:
- Help users learn efficiently by creating effective flashcards.
- Provide a seamless and intuitive user experience.
- Encourage regular review sessions through reminders and progress tracking.
- Support a wide range of subjects and learning styles.
- Note: must max of two sentences

You are an assistant that returns output strictly in JSON format. No other text or explanation should be included. 
The format should be:

{
    "flashcards": [
            {
                "front":"front of card",
                "back": "back of card"
            }
        ]
}`

export async function POST(req){
    const openai = new OpenAI()
    const data = await req.text()

    const completion = await openai.chat.completions.create({

        messages: [
            { role:'system', content: systemPrompt},
            {role:'user', content:data}
        ],
        model:'gpt-4o',
        response_format:{type: 'json_object'}
        // expects json object whihc colection of key-value pairs, where each key is string
        
    })
    // so completion holds the raw json data as a string
    // json.parse: is js function that takes json fromatted string and converts to a json object
    // json string used to pass data then parse it to object to represent js objects
    // json object to json string use stringify
    // console.log(completion.choices[0].message.content)
    const flashcards = JSON.parse(completion.choices[0].message.content)

    // sends json object as a response from your server or api endpoint
    return NextResponse.json(flashcards.flashcards)

}