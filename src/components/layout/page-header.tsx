export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <header className="page-header">
      <div className="stack-sm reading-width">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="page-title display-type">{title}</h1>
        {description && <p className="body-large text-muted">{description}</p>}
      </div>
      {action}
    </header>
  );
}
