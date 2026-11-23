import { siteConfig } from "@/data/site";
import { absoluteUrl } from "@/lib/url";
import { getAllArticles } from "@/services/articleService";

const keyPages = [
  { title: "Produk", path: "/produk", description: "Kelompok kain tenun, rajut, dan kain jadi serta struktur kain umum." },
  { title: "Proses produksi", path: "/proses-produksi", description: "Tahapan umum produksi kain dari benang sampai pengiriman." },
  { title: "Tentang", path: "/tentang", description: "Profil perusahaan dan cara panduan disusun." },
  { title: "Kebijakan editorial", path: "/kebijakan-editorial", description: "Aturan sumber, pembaruan, dan koreksi artikel." },
  { title: "Kontak", path: "/kontak", description: "Permintaan sampel dan penawaran lewat WhatsApp." },
];

export async function GET(): Promise<Response> {
  const articles = await getAllArticles();
  const articleLines = articles.map(
    (article) => `- [${article.title}](${absoluteUrl(`/artikel/${article.slug}`)}): ${article.summary}`,
  );
  const pageLines = keyPages.map((page) => `- [${page.title}](${absoluteUrl(page.path)}): ${page.description}`);

  const content = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    "## Artikel",
    ...articleLines,
    "",
    "## Halaman penting",
    ...pageLines,
    "",
  ].join("\n");

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
