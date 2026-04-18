import { NextResponse } from "next/server";
import { generateBookDraftJob, type BookJobProvider } from "@/lib/server/book-job-service";
import type { StoryDocument } from "@/lib/story-schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      story?: StoryDocument;
      sceneId?: string;
      provider?: BookJobProvider;
    };

    if (!body.story || !body.sceneId) {
      return NextResponse.json(
        {
          error: "story and sceneId are required"
        },
        { status: 400 }
      );
    }

    const result = await generateBookDraftJob({
      story: body.story,
      sceneId: body.sceneId,
      provider: body.provider
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Book job generation failed."
      },
      { status: 500 }
    );
  }
}
