export default function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">{title}</h1>
        {description ? <p className="text-sm text-navy-500">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}
