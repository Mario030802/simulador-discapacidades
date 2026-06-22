type ViewerProps = {
  html: string;
};

export default function Viewer({ html }: ViewerProps) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}