// Author: Zeday | https://join.co.id
// Renderer teks kaya yang sangat sederhana untuk konten yang diedit admin
// lewat textarea polos (mis. Kebijakan Privasi) - BUKAN parser Markdown
// penuh, sengaja dibatasi ke 3 pola supaya mudah diketik admin tanpa
// menambah dependency baru: baris diawali "## " jadi judul bagian, baris
// diawali "- " jadi item daftar (baris "- " berurutan dikelompokkan jadi
// satu daftar), sisanya jadi paragraf (dipisah baris kosong).
export default function RichTextContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let paragraphBuffer: string[] = [];
  let listBuffer: string[] = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length > 0) {
      blocks.push(
        <p key={`p-${blocks.length}`} className="mt-3 first:mt-0">
          {paragraphBuffer.join(" ")}
        </p>
      );
      paragraphBuffer = [];
    }
  };

  const flushList = () => {
    if (listBuffer.length > 0) {
      blocks.push(
        <ul key={`ul-${blocks.length}`} className="mt-3 ml-5 list-disc space-y-1 first:mt-0">
          {listBuffer.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
      listBuffer = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push(
        <h2
          key={`h-${blocks.length}`}
          className="mt-8 font-heading text-xl font-bold text-ink first:mt-0 dark:text-ink-dark"
        >
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("- ")) {
      flushParagraph();
      listBuffer.push(line.slice(2));
    } else if (line === "") {
      flushParagraph();
      flushList();
    } else {
      flushList();
      paragraphBuffer.push(line);
    }
  }
  flushParagraph();
  flushList();

  return <div className="text-sm leading-relaxed text-ink/80 dark:text-ink-dark/80">{blocks}</div>;
}
