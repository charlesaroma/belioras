import Avatar from "../../../../components/account/Avatar";

/** Who you are, and three numbers that describe the account at a glance. */
export default function ProfileHeader({ user, orderCount, wishlistCount, loading }) {
  return (
    <section className="flex flex-wrap items-center gap-4 border-b border-umber-50 pb-6">
      <Avatar user={user} size="lg" />
      <div className="min-w-0 flex-1">
        <h2 className="font-display text-xl tracking-wide text-espresso">{user?.name}</h2>
        <p className="mt-0.5 text-[13px] text-espresso-soft">{user?.email}</p>
      </div>
      <dl className="flex gap-8">
        <Stat label="Orders" value={loading ? "—" : orderCount} />
        <Stat label="Saved" value={wishlistCount} />
        <Stat
          label="Member since"
          value={user?.createdAt ? new Date(user.createdAt).getFullYear() : "—"}
        />
      </dl>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.18em] text-espresso-soft">{label}</dt>
      <dd className="mt-1 font-display text-2xl tabular-nums text-espresso">{value}</dd>
    </div>
  );
}
