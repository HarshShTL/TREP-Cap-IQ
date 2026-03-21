type Props = { params: { id: string } };

export default function ContactDetailPage({ params }: Props) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">Contact</h1>
      <p className="text-muted-foreground">
        Placeholder — profile for contact <span className="font-mono text-foreground">{params.id}</span>.
      </p>
    </div>
  );
}
