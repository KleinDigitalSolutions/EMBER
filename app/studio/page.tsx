import { StudioWorkspace } from "@/components/studio/studio-workspace";
import { studioStory } from "@/lib/studio-fixture";

export default function StudioPage() {
  return <StudioWorkspace story={studioStory} />;
}
