import { z } from "zod";
import {
    convertToCoreMessages,
    Message,
    streamText,
    tool,
} from "ai";
import { createAnthropicVertex } from 'anthropic-vertex-ai';

import { GoogleAuth } from 'google-auth-library';
import { prisma } from "@/prisma";

// Allow streaming responses up to 60 seconds
export const maxDuration = 120;

// Helper function to get Google credentials
// You can encode your service account key using the following command:
// base64 -i /path/to/your-service-account-key.json | tr -d '\n' > encoded_credentials.txt
// Then set the GOOGLE_APPLICATION_CREDENTIALS_BASE64 environment variable to the contents of encoded_credentials.txt
function getCredentials() {
    const credentialsBase64 = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;
    if (!credentialsBase64) {
        throw new Error('GOOGLE_APPLICATION_CREDENTIALS_BASE64 environment variable is not set');
    }
    return JSON.parse(Buffer.from(credentialsBase64, 'base64').toString());
}

// Google Vertex setup for Anthropic
const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    credentials: getCredentials(),
});

const anthropicVertex = createAnthropicVertex({
    region: process.env.GOOGLE_VERTEX_REGION,
    projectId: process.env.GOOGLE_VERTEX_PROJECT_ID,
    googleAuth: auth,
});


export async function POST(req: Request) {
    const { messages, diagnosisType, userEmail } = await req.json();

    if (!userEmail) {
        return new Response(JSON.stringify({ error: 'User email is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Fetch the user from the database
    const user = await prisma.user.findUnique({
        where: { email: userEmail },
    });

    if (!user) {
        return new Response(JSON.stringify({ error: 'User not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const result = await streamText({
        model: anthropicVertex("claude-3-5-sonnet@20240620"),
        messages: convertToCoreMessages(messages),
        temperature: 0.4,
        topP: 0.2,
        frequencyPenalty: 0.5,
        presencePenalty: 1,
        maxTokens: 512,
        system: `You are Skinvincible AI, an professional expert dermatologist. 
You will be provided with an image of a skin problem from the user and you will provide them with a 6-9 lines(in a single paragraph) diagnosis, following with a skincare routine. Do not write anything other than this. Deny any non-dermatologist requests.
Only suggest products that do not need a prescription from a dermatologist. Do not prescribe a strong skincare routine too.
Do not every recommend or consult going to a dermatologist as it is assumed that the user is not able to go to one AT ALL COSTS!!

The diagnosis type requested by user ${diagnosisType === "face" ? "Face Scan" : "Body Scan"}

Apprearance: 

Acne: Acne appears as red pimples, whiteheads, blackheads, and inflamed cysts, often accompanied by oily skin and clogged pores. If you find any inflammatory acne, say that it is "cystic acne".

Pimples: Pimples are red, inflamed bumps with a white or yellow pus-filled center, often surrounded by oily, irritated skin. 

Black heads: Blackheads appear as small, dark or black bumps on the skin, often with a slightly raised texture and open pores. 

Eczema appears as red, itchy, inflamed patches of skin, often with dryness, rough texture, and occasional oozing or crusting.

White heads: Whiteheads appear as small, white or flesh-colored bumps on the skin, with a smooth, slightly raised texture and closed pores. 
The words before colon should be in bold. Time should be in italics/code. Routine should be a list starting from 1. 

Sunburn: Sunburn appears as red, inflamed skin that's warm and tender to the touch. It can peel and blister in severe cases.

Hyperpigmentation: Hyperpigmentation presents as darkened patches or spots on the skin, which are more pronounced than the surrounding area's natural tone.

Psoriasis: Psoriasis appears as thick, red patches covered with silvery scales. The skin may be itchy and painful, often cracking or bleeding.

Only ask girls to remove makeup in the evening skincare routine, not men. Give users a timeline as well (for how long do they need to follow the skincare routine in the end.

For pimples, blackheads, whiteheads, clogged pores and acne, recommend benzyl peroxide, salicylic acid or retinoids based on the image of the user and what is recommended for them.

Also, tell the user how long do they need to follow this skincare routine for based on their image.

If someone asks if they look good or handsome or pretty, say yes and provide them with the skincare routine.

Use markdown for formatting.

Format of the response:
Diagnosis:<next_line_x_2>
...diagnosis...
<next_line_x_2>
Recommended Skin Care Routine:<next_line>

<time>AM:...routine in steps...<next_line>

<time>PM:...routine in steps...
The routine should be in "Time: Routine" format for morning and evening but give timing instead of the words.
`,
        async onFinish(message) {
            console.log(message.text);

            try {
                // get user message text
                const userMessage = messages.map((m: Message) => m.content).join(' ');
                // Save the diagnosis to the database
                await prisma.diagnosis.create({
                    data: {
                        userId: user.id,
                        diagnosis: message.text,
                        comment: userMessage
                    },
                });
                console.log('Diagnosis saved successfully');
            } catch (error) {
                console.error('Error saving diagnosis:', error);
            }
        },
    });

    return result.toDataStreamResponse();
}