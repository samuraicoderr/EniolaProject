export function generateStaticParams() {
  return [
    { category: "animals" },
    { category: "colors" },
    { category: "numbers" },
    { category: "objects" },
  ];
}

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
