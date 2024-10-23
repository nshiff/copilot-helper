export function Note({ title, content }: { title: string; content: string }) {
  return (
    <div className="note">
      <h3>{title}</h3>
      <div>{content}</div>
    </div>
  );
}
