import { DesktopToolPage } from "@/features/desktop-tools/tool-page";
import { getDesktopTool } from "@/features/desktop-tools/tools";
import { pageMetadata } from "@/lib/site";

const tool = getDesktopTool("nas-desktop-app");
export const metadata = pageMetadata(tool.copy.ko.name, tool.copy.ko.cardDescription, tool.path);

export default function NasDesktop() {
  return <DesktopToolPage id="nas-desktop-app" language="ko" />;
}
