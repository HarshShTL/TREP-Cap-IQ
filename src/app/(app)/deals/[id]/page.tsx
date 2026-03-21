type Props = { params: { id: string } };

export default function DealDetailPage({ params }: Props) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">Deal</h1>
      <p className="text-muted-foreground">
        Placeholder — detail view for deal <span className="font-mono text-foreground">{params.id}</span>.
      </p>
    </div>
  );
}
