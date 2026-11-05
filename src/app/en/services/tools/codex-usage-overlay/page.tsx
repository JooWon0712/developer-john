import { DesktopToolPage } from "@/features/desktop-tools/tool-page";
import { getDesktopTool } from "@/features/desktop-tools/tools";
import { pageMetadata } from "@/lib/site";

const tool = getDesktopTool("codex-usage-overlay");
export const metadata = pageMetadata(tool.copy.en.name, tool.copy.en.cardDescription, `/en${tool.path}`);

export default function CodexUsageOverlay() {
  return <DesktopToolPage id="codex-usage-overlay" language="en" />;
}
