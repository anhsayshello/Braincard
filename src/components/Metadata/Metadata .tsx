import { convert } from "html-to-text";

interface Props {
  title: string;
  content: string;
}

export default function Metadata({ title, content }: Props) {
  return (
    <article>
      <title>{title}</title>
      <meta
        name="description"
        content={convert(content, {
          limits: { ellipsis: "...", maxInputLength: 150 },
        })}
      />
    </article>
  );
}
