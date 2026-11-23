import { renderOgImage } from "@/components/og/renderOgImage";
import { homeContent } from "@/data/home";

export const alt = "Manufaktur tekstil Sandang Nusa Tekstil: kain tenun, rajut, dan kain jadi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({ title: homeContent.heading, subtitle: "Kain tenun, rajut, dan kain jadi" });
}
