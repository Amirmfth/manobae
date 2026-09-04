export function FoldedNote({ eyebrow, children, footer }: { eyebrow: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <article className="folded-note">
      <span className="folded-note__corner" aria-hidden="true" />
      <p className="eyebrow">{eyebrow}</p>
      <div className="folded-note__content">{children}</div>
      {footer && <footer className="folded-note__footer">{footer}</footer>}
    </article>
  );
}
