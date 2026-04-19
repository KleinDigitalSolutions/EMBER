import { createUuid } from "@/lib/id";
import type {
  AssistantArtifact,
  AssistantContextSelection,
  AssistantMessage,
  AssistantOutputMode,
  AssistantProvider,
  AssistantThread,
  StoryDocument
} from "@/lib/story-schema";
import { createDefaultAssistantContextSelection } from "@/lib/story-schema";

export function createAssistantThread(
  title = "Neues Gespräch",
  context: AssistantContextSelection = createDefaultAssistantContextSelection()
): AssistantThread {
  const now = new Date().toISOString();

  return {
    id: createUuid(),
    title,
    summary: "",
    context,
    createdAt: now,
    updatedAt: now,
    messages: []
  };
}

export function createAssistantMessage(params: {
  role: AssistantMessage["role"];
  content: string;
  outputMode: AssistantOutputMode;
  provider: AssistantProvider;
  modelName?: string | null;
  context?: AssistantContextSelection;
  artifactId?: string | null;
}): AssistantMessage {
  return {
    id: createUuid(),
    role: params.role,
    content: params.content,
    createdAt: new Date().toISOString(),
    outputMode: params.outputMode,
    provider: params.provider,
    modelName: params.modelName ?? null,
    context: params.context ?? createDefaultAssistantContextSelection(),
    artifactId: params.artifactId ?? null
  };
}

export function createAssistantArtifact(params: {
  threadId: string;
  sourceMessageId?: string | null;
  title: string;
  kind: AssistantArtifact["kind"];
  summary: string;
  content: string;
  context?: AssistantContextSelection;
}): AssistantArtifact {
  const now = new Date().toISOString();

  return {
    id: createUuid(),
    threadId: params.threadId,
    sourceMessageId: params.sourceMessageId ?? null,
    title: params.title,
    kind: params.kind,
    format: "markdown",
    summary: params.summary,
    content: params.content,
    context: params.context ?? createDefaultAssistantContextSelection(),
    createdAt: now,
    updatedAt: now
  };
}

export function appendAssistantMessage(
  story: StoryDocument,
  threadId: string,
  message: AssistantMessage
): StoryDocument {
  return {
    ...story,
    assistant: {
      ...story.assistant,
      threads: story.assistant.threads.map(function (thread) {
        if (thread.id !== threadId) {
          return thread;
        }

        const messages = thread.messages.concat(message);

        return {
          ...thread,
          context:
            thread.context.scope === "project" && message.context.scope !== "project"
              ? message.context
              : thread.context,
          summary: buildThreadSummary(messages),
          updatedAt: message.createdAt,
          messages
        };
      })
    }
  };
}

export function appendAssistantArtifact(story: StoryDocument, artifact: AssistantArtifact): StoryDocument {
  return {
    ...story,
    assistant: {
      ...story.assistant,
      artifacts: [artifact].concat(
        story.assistant.artifacts.filter(function (entry) {
          return entry.id !== artifact.id;
        })
      ),
      threads: story.assistant.threads.map(function (thread) {
        if (thread.id !== artifact.threadId) {
          return thread;
        }

        return {
          ...thread,
          updatedAt: artifact.updatedAt
        };
      })
    }
  };
}

export function appendAssistantThread(story: StoryDocument, thread: AssistantThread): StoryDocument {
  return {
    ...story,
    assistant: {
      ...story.assistant,
      threads: [thread].concat(
        story.assistant.threads.filter(function (entry) {
          return entry.id !== thread.id;
        })
      )
    }
  };
}

export function updateAssistantThread(
  story: StoryDocument,
  threadId: string,
  updater: (thread: AssistantThread) => AssistantThread
): StoryDocument {
  return {
    ...story,
    assistant: {
      ...story.assistant,
      threads: story.assistant.threads.map(function (thread) {
        return thread.id === threadId ? updater(thread) : thread;
      })
    }
  };
}

export function updateAssistantPreferences(
  story: StoryDocument,
  updater: (preferences: StoryDocument["assistant"]["preferences"]) => StoryDocument["assistant"]["preferences"]
): StoryDocument {
  return {
    ...story,
    assistant: {
      ...story.assistant,
      preferences: updater(story.assistant.preferences)
    }
  };
}

export function getAssistantThread(story: StoryDocument, threadId: string) {
  return story.assistant.threads.find(function (thread) {
    return thread.id === threadId;
  }) ?? null;
}

export function getAssistantArtifact(story: StoryDocument, artifactId: string) {
  return story.assistant.artifacts.find(function (artifact) {
    return artifact.id === artifactId;
  }) ?? null;
}

export function deriveThreadTitleFromPrompt(prompt: string) {
  const cleaned = prompt
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.:!?]+$/g, "");

  if (!cleaned) {
    return "Neues Gespräch";
  }

  const compact = cleaned.split(" ").slice(0, 6).join(" ");

  return compact.length > 52 ? `${compact.slice(0, 49).trimEnd()}...` : compact;
}

export function buildThreadSummary(messages: AssistantMessage[]) {
  const lastAssistantMessage =
    [...messages].reverse().find(function (message) {
      return message.role === "assistant";
    }) ?? messages[messages.length - 1] ?? null;

  if (!lastAssistantMessage) {
    return "";
  }

  const compact = lastAssistantMessage.content.replace(/\s+/g, " ").trim();

  return compact.length > 120 ? `${compact.slice(0, 117).trimEnd()}...` : compact;
}
