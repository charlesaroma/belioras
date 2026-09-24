/* Page: Auth - atelierInvite */
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

import BrandMark from "../../../components/shared/BrandMark";
import { useToast } from "../../../context/ToastContext";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { acceptInvite, getInvite } from "../../../services/auth/authApi";

/**
 * Where an invitation link lands: the person sees who invited them and as
 * what, chooses their own password, and is sent to the atelier door to sign
 * in with it. The link works once.
 */
export default function AtelierInvite() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: invite, loading, error } = useAsyncData(() => getInvite(token), [token]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [problem, setProblem] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (password.length < 8) return setProblem("Choose a password of at least 8 characters.");
    if (password !== confirm) return setProblem("The two passwords don't match.");
    setProblem("");
    setSaving(true);
    try {
      await acceptInvite(token, password);
      toast("Your account is ready. Sign in with your new password.", "success");
      navigate("/atelier", { replace: true });
    } catch (err) {
      setProblem(err.message ?? "Could not finish setting up your account.");
    } finally {
      setSaving(false);
    }
  };

  const input =
    "w-full border-b border-ivory-50/25 bg-transparent px-0 py-3 text-sm text-ivory-50 placeholder:text-ivory-50/35 transition-colors focus:border-gold-500 focus:outline-none";
  const label = "mb-1 block text-[10px] font-semibold uppercase tracking-[0.22em] text-ivory-50/55";

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-espresso px-6 py-16">
      <div className="w-full max-w-sm">
        <BrandMark label="Belioras — storefront" wrapperClassName="mx-auto block w-fit" />
        <p className="eyebrow mt-8 text-center">Atelier</p>

        {loading ? (
          <p className="mt-10 flex justify-center text-ivory-50/60"><Loader2 className="size-5 animate-spin" aria-label="Loading" /></p>
        ) : error || !invite ? (
          <>
            <h1 className="mt-2 text-center font-display text-3xl tracking-wide text-ivory-50">Link not valid</h1>
            <p className="mt-4 text-center text-sm leading-relaxed text-ivory-50/60">
              {error?.message ?? "This invitation link has expired or was already used."} Ask whoever invited you for a new one.
            </p>
            <p className="mt-8 text-center">
              <Link to="/atelier" className="text-[11px] uppercase tracking-[0.18em] text-gold-400 underline underline-offset-4">Go to sign in</Link>
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-2 text-center font-display text-3xl tracking-wide text-ivory-50">Welcome, {invite.name.split(" ")[0]}</h1>
            <p className="mt-4 text-center text-sm leading-relaxed text-ivory-50/60">
              {invite.invitedBy ? `${invite.invitedBy} invited you` : "You're invited"} to the Belioras atelier as{" "}
              <strong className="font-medium text-gold-400">{invite.roleName}</strong>. Choose a password to finish.
            </p>

            <form onSubmit={submit} className="mt-10 space-y-6" noValidate>
              <div>
                <p className={label}>Email</p>
                <p className="py-3 text-sm text-ivory-50/80">{invite.email}</p>
              </div>
              <div>
                <label htmlFor="invite-password" className={label}>Password</label>
                <input id="invite-password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={input} />
              </div>
              <div>
                <label htmlFor="invite-confirm" className={label}>Type it again</label>
                <input id="invite-confirm" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={input} />
              </div>
              {problem && <p role="alert" className="text-[12px] text-error">{problem}</p>}
              <button type="submit" disabled={saving} className="btn btn-lg w-full border border-gold-500 bg-gold-500 text-espresso hover:bg-gold-400 disabled:opacity-60">
                {saving ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : "Finish setting up"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
