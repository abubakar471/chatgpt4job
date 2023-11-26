import { NextResponse } from "next/server";
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request) {
    try {
        const body = await request.json();
        const { messages } = body;

        if (!openai.apiKey) {
            return new NextResponse("openai api key not configured", { status: 500 });
        }

        if (!messages) {
            return new NextResponse("messages are required", { status: 400 });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages
        })


        return NextResponse.json(response.choices[0].message)
    } catch (error) {
        console.log("[converstation error] ", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}