import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your investor relations pipeline.</p>
      </div>
      <Card className="rounded-[12px] border-border">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>This is a placeholder dashboard. Connect Supabase and your data layer to populate metrics.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Use the sidebar to navigate to deals, contacts, companies, and more.
        </CardContent>
      </Card>
    </div>
  );
}
