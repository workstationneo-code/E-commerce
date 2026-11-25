import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/admin");

  const { data: role, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !role || !["admin", "manager", "catalog_editor"].includes(role.role)) {
    return (
      <main className="login-page">
        <section className="login-card">
          <span className="eyebrow">VOLT / ACCESS RESTRICTED</span>
          <h1>Admin access <em>required.</em></h1>
          <p>Your account is signed in, but it does not have a store management role.</p>
          <a className="button dark" href="/">Return to store</a>
        </section>
      </main>
    );
  }

  return children;
}
