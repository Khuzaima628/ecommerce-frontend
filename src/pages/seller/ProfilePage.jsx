import { useEffect, useState } from "react";
import { companyApi } from "../../lib/companyApi.js";
import { uploadFile } from "../../lib/mediaApi.js";
import { ApiError } from "../../lib/api.js";
import PaperHeader from "../../components/paper/PaperHeader.jsx";
import PaperPanel from "../../components/paper/PaperPanel.jsx";
import PaperButton from "../../components/paper/PaperButton.jsx";
import PaperModal from "../../components/paper/PaperModal.jsx";
import PaperInput, { PaperTextarea } from "../../components/paper/PaperInput.jsx";
import PaperSpinner from "../../components/paper/PaperSpinner.jsx";
import PaperEmptyState from "../../components/paper/PaperEmptyState.jsx";
import ImageUploadField from "../../components/common/ImageUploadField.jsx";

const blankForm = {
  companyName: "",
  bio: "",
  logo: "",
  street: "",
  city: "",
  state: "",
  country: "",
  zip: "",
  taxId: "",
};

export default function SellerProfilePage() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(blankForm);
  const [logoPreview, setLogoPreview] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    companyApi
      .getMine()
      .then((data) => setCompany(data))
      .catch((err) => {
        // No company created yet reads as 404 — that's a valid empty state, not an error.
        if (!(err instanceof ApiError && err.status === 404)) setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const openForm = () => {
    setError("");
    setLogoPreview("");
    setForm(
      company
        ? {
            companyName: company.companyName ?? "",
            bio: company.bio ?? "",
            logo: company.logo ?? "",
            street: company.address?.street ?? "",
            city: company.address?.city ?? "",
            state: company.address?.state ?? "",
            country: company.address?.country ?? "",
            zip: company.address?.zip ?? "",
            taxId: company.taxId ?? "",
          }
        : blankForm,
    );
    setOpen(true);
  };

  const handleLogoSelect = async (file, previewUrl) => {
    setLogoPreview(previewUrl);
    setUploadingLogo(true);
    setError("");
    try {
      const fileUrl = await uploadFile(file, "banner");
      setForm((f) => ({ ...f, logo: fileUrl }));
    } catch (err) {
      setError(err.message || "Could not upload that image.");
      setLogoPreview("");
    } finally {
      setUploadingLogo(false);
    }
  };

  const save = async () => {
    if (!form.companyName.trim()) {
      setError("The stall needs a name.");
      return;
    }
    if (uploadingLogo) {
      setError("Wait for the logo to finish uploading first.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const payload = {
        companyName: form.companyName.trim(),
        bio: form.bio.trim(),
        logo: form.logo,
        address: {
          street: form.street.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          country: form.country.trim(),
          zip: form.zip.trim(),
        },
        taxId: form.taxId.trim(),
      };
      const created = await companyApi.create(payload);
      setCompany(created);
      setOpen(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <PaperSpinner label="fetching the shop sign…" />
      </div>
    );
  }

  return (
    <div>
      <PaperHeader
        eyebrow="the shop sign"
        title="Shop profile"
        description="How customers see your stall."
        actions={
          company && (
            <PaperButton variant="stamp" onClick={openForm}>
              Edit profile
            </PaperButton>
          )
        }
      />

      {!company ? (
        <PaperEmptyState
          title="No shop sign hung yet"
          hint="Create your company profile so customers know who they're buying from."
          action={
            <PaperButton variant="stamp" onClick={openForm}>
              Create company profile
            </PaperButton>
          }
        />
      ) : (
        <PaperPanel torn>
          <div className="flex flex-wrap items-start gap-5">
            {company.logo ? (
              <img
                src={company.logo}
                alt=""
                className="h-20 w-20 shrink-0 rotate-[-2deg] border-2 border-double border-kraft object-cover shadow-sheet"
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex h-20 w-20 shrink-0 rotate-[-2deg] items-center justify-center border-2 border-double border-kraft bg-paper-2 font-hand text-5xl leading-none text-kraft shadow-sheet"
              >
                {company.companyName.charAt(0)}
              </span>
            )}
            <div>
              <h2 className="font-display text-2xl text-ink-1">{company.companyName}</h2>
              {company.taxId && (
                <p className="text-xs uppercase tracking-widest text-ink-faint">Tax ID {company.taxId}</p>
              )}
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-3">
                {company.bio || "No shop story written yet."}
              </p>
              {company.address && (
                <p className="mt-2 text-xs text-ink-faint">
                  {[company.address.street, company.address.city, company.address.state, company.address.country, company.address.zip]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
            </div>
          </div>
        </PaperPanel>
      )}

      <PaperModal
        open={open}
        onClose={() => !saving && setOpen(false)}
        title={company ? "Edit shop profile" : "Create shop profile"}
        description="Rewrite the sign above your stall."
        size="lg"
        footer={
          <>
            <PaperButton disabled={saving} onClick={() => setOpen(false)}>
              Discard
            </PaperButton>
            <PaperButton variant="stamp" disabled={saving || uploadingLogo} onClick={save}>
              {saving ? "Saving…" : "Save profile"}
            </PaperButton>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <PaperInput
              label="Shop name"
              required
              value={form.companyName}
              onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
            />
          </div>
          <div className="sm:col-span-2">
            <ImageUploadField
              label="Logo"
              value={form.logo}
              previewUrl={logoPreview}
              onChange={handleLogoSelect}
              hint={uploadingLogo ? "Uploading…" : undefined}
            />
          </div>
          <div className="sm:col-span-2">
            <PaperTextarea
              label="Bio"
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              hint="A couple of lines about what you make."
            />
          </div>
          <PaperInput
            label="Street"
            value={form.street}
            onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))}
          />
          <PaperInput
            label="City"
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
          />
          <PaperInput
            label="State"
            value={form.state}
            onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
          />
          <PaperInput
            label="Country"
            value={form.country}
            onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
          />
          <PaperInput
            label="Zip"
            value={form.zip}
            onChange={(e) => setForm((f) => ({ ...f, zip: e.target.value }))}
          />
          <PaperInput
            label="Tax ID"
            value={form.taxId}
            onChange={(e) => setForm((f) => ({ ...f, taxId: e.target.value }))}
          />
          {error && (
            <p role="alert" className="sm:col-span-2 font-hand text-lg leading-tight text-ink-red">
              ↳ {error}
            </p>
          )}
          {saving && (
            <div className="sm:col-span-2">
              <PaperSpinner label="drying the ink…" />
            </div>
          )}
        </div>
      </PaperModal>
    </div>
  );
}
