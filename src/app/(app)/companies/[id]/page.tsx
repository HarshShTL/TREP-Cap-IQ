type Props = { params: { id: string } };

export default function CompanyDetailPage({ params }: Props) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">Company</h1>
      <p className="text-muted-foreground">
        Placeholder — company <span className="font-mono text-foreground">{params.id}</span>.
      </p>
    </div>
  );
}
