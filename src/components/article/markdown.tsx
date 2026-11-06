import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { AmazonLink } from "@/components/product/amazon-link";
import { isAmazonUrl } from "@/lib/amazon";
import { slugify } from "@/lib/utils";

function textOf(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (node && typeof node === "object" && "props" in node) {
    return textOf((node as { props: { children?: React.ReactNode } }).props.children);
  }
  return "";
}

const components: Components = {
  h2: ({ children }) => <h2 id={slugify(textOf(children))}>{children}</h2>,
  h3: ({ children }) => <h3 id={slugify(textOf(children))}>{children}</h3>,
  a: ({ href = "", children }) => {
    if (href.startsWith("/") || href.startsWith("#")) return <Link href={href}>{children}</Link>;
    // Cualquier enlace a Amazon del Markdown recibe el tag y los atributos de afiliado
    if (isAmazonUrl(href)) return <AmazonLink href={href}>{children}</AmazonLink>;
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  },
  table: ({ children }) => (
    <div className="overflow-x-auto rounded-lg border">
      <table>{children}</table>
    </div>
  ),
  img: ({ src, alt }) =>
    // Imágenes del contenido editorial con lazy-loading nativo
    // eslint-disable-next-line @next/next/no-img-element
    typeof src === "string" ? <img src={src} alt={alt ?? ""} loading="lazy" decoding="async" className="rounded-lg" /> : null,
};

export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
}
