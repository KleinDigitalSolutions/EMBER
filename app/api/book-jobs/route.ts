import { NextResponse } from "next/server";
import { generateBookDraftJob, type BookJobProvider } from "@/lib/server/book-job-service";
import type { SceneContextPacket } from "@/lib/book-engine";
import type { StoryDocument } from "@/lib/story-schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      story?: StoryDocument;
      sceneId?: string;
      packet?: SceneContextPacket;
      provider?: BookJobProvider;
      targetSceneWordsMin?: number;
      targetSceneWordsMax?: number;
    };

    if (!body.sceneId || (!body.packet && !body.story)) {
      return NextResponse.json(
        {
          error: "sceneId and packet or story are required"
        },
        { status: 400 }
      );
    }

    const result = await generateBookDraftJob({
      story: body.story,
      sceneId: body.sceneId,
      packet: body.packet,
      provider: body.provider,
      targetSceneWordsMin: body.targetSceneWordsMin,
      targetSceneWordsMax: body.targetSceneWordsMax
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
