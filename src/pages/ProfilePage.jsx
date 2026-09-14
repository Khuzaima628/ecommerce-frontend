import { useEffect, useState } from "react";
import { useSession } from "../context/SessionContext.jsx";
import { ApiError } from "../lib/api.js";
import { authApi } from "../lib/authApi.js";
import PaperButton from "../components/paper/PaperButton.jsx";
import PaperModal from "../components/paper/PaperModal.jsx";
import PaperInput from "../components/paper/PaperInput.jsx";
import PaperSpinner from "../components/paper/PaperSpinner.jsx";
import PaperStamp from "../components/paper/PaperStamp.jsx";
import PaperBadge from "../components/paper/PaperBadge.jsx";
import ImageUploadField from "../components/common/ImageUploadField.jsx";

export default function ProfilePage() {
  const { currentUser, setCurrentUser } = useSession();
  const role = currentUser.role;

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", profilePicture: "" });

  useEffect(() => {
    if (!open) return;
    setError("");
    setForm({
      name: currentUser.name ?? "",
      profilePicture: currentUser.profilePicture ?? "",
    });
  }, [open, currentUser]);

  const save = async () => {
    if (!form.name.trim()) {
      setError("A name is needed on the file.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const updated = await authApi.updateMe({
        name: form.name.trim(),
        profilePicture: form.profilePicture,
      });
      setCurrentUser((u) => ({ ...u, ...updated }));
      setOpen(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2600);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const initial = (currentUser.name ?? "?").charAt(0);

  return (
    <div>
      <div className="torn-hero crumple-deep relative bg-paper-1 px-5 pb-16 pt-12 sm:px-12 sm:pt-14">
        <span aria-hidden="true" className="paper-grain opacity-55" />
        <span aria-hidden="true" className="aged-wash" />
        <span aria-hidden="true" className="fold-line absolute inset-y-0 left-1/2 w-10 opacity-45" />

        <div className="relative">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-body text-[11px] font-semibold uppercase tracking-[0.26em] text-kraft">
                personal file · {role}
              </p>
              <h1 className="font-hand text-5xl leading-none text-ink-1 sm:text-6xl">
                {currentUser.name}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {saved && (
                <PaperStamp tone="green" animate>
                  saved
                </PaperStamp>
              )}
              <PaperButton variant="stamp" onClick={() => setOpen(true)}>
                Edit details
              </PaperButton>
            </div>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-[auto_1fr]">
            <div className="relative w-fit">
              <div className="relative rotate-[-2deg] border border-paper-edge bg-paper-2 p-3 shadow-lift">
                {currentUser.profilePicture ? (
                  <img
                    src={currentUser.profilePicture}
                    alt=""
                    className="h-28 w-28 border-2 border-double border-kraft object-cover"
                  />
                ) : (
                  <span className="flex h-28 w-28 items-center justify-center border-2 border-double border-kraft bg-paper-1 font-hand text-7xl leading-none text-kraft">
                    {initial}
                  </span>
                )}
              </div>
              <p className="mt-3 text-center font-hand text-lg text-ink-faint">filed under {initial}</p>
            </div>

            <dl className="space-y-4">
              <div className="border-b border-dashed border-paper-edge pb-3">
                <dt className="font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
                  Name
                </dt>
                <dd className="font-display text-lg text-ink-1">{currentUser.name}</dd>
              </div>
              <div className="border-b border-dashed border-paper-edge pb-3">
                <dt className="font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
                  Email
                </dt>
                <dd className="font-display text-lg text-ink-1">{currentUser.email}</dd>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <PaperBadge tone="kraft">{role}</PaperBadge>
                <PaperBadge tone={currentUser.isVerified ? "green" : "red"}>
                  {currentUser.isVerified ? "verified" : "not verified"}
                </PaperBadge>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <PaperModal
        open={open}
        onClose={() => !saving && setOpen(false)}
        title="Edit your details"
        description="Rewrite the file in ink. Starred fields are required."
        footer={
          <>
            <PaperButton disabled={saving} onClick={() => setOpen(false)}>
              Discard
            </PaperButton>
            <PaperButton variant="stamp" disabled={saving} onClick={save}>
              {saving ? "Saving…" : "Save profile"}
            </PaperButton>
          </>
        }
      >
        <div className="grid gap-4">
          <PaperInput
            label="Name"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <ImageUploadField
            label="Profile picture"
            folder="profile"
            value={form.profilePicture}
            onChange={(fileUrl) => setForm((f) => ({ ...f, profilePicture: fileUrl }))}
          />
          {error && (
            <p role="alert" className="font-hand text-lg leading-tight text-ink-red">
              ↳ {error}
            </p>
          )}
          {saving && <PaperSpinner label="pressing the ink…" />}
        </div>
      </PaperModal>
    </div>
  );
}
