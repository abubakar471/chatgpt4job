import { NextResponse } from "next/server";
import OpenAI from 'openai';
import { PassThrough } from 'stream';

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
});

export async function POST(request) {
    const body = await request.json();
    const { messages } = body;
    const myStream = new PassThrough();

    if (!openai.apiKey) {
        return new NextResponse("openai api key not configured", { status: 500 });
    }

    if (!messages) {
        return new NextResponse("messages are required", { status: 400 });
    }
    try {
        let result = '';
        const stream = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages,
            stream: true
        })

        
        for await (const chunk of stream) {
            result += chunk.choices[0]?.delta?.content || "";
            // myStream.write(chunk.choices[0]?.delta?.content || "");
            process.stdout.write(chunk.choices[0]?.delta?.content || "");
        }
        // return NextResponse.json({
        //     role : "assistant", 
        //     content : result
        // });

        // myStream.pipe(NextResponse)
        return NextResponse.json({
            role: "assistant",
            content: result
        });
    } catch (error) {
        console.log("[converstation error] ", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}