import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { RiSettings3Line, RiUploadCloud2Line } from "react-icons/ri";
import { Spinner } from "../components/LoadingState";
import { updateProfile, uploadLogo } from "../api/authApi";
import { useAuth } from "../context/useAuth";
import usePageTitle from "../utils/usePageTitle";

const Settings = () => {
  usePageTitle("Settings");
  const { user, setUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      gstin: user?.gstin || "",
      address: user?.address || "",
      accountName: user?.bankDetails?.accountName || "",
      accountNumber: user?.bankDetails?.accountNumber || "",
      ifsc: user?.bankDetails?.ifsc || "",
      bankName: user?.bankDetails?.bankName || "",
      upiId: user?.bankDetails?.upiId || "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const { data } = await updateProfile(values);
      setUser(data.user);
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const onLogoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const { data } = await uploadLogo(file);
      setUser(data.user);
      toast.success("Logo uploaded");
    } catch {
      toast.error("Failed to upload logo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="shell-card p-5 sm:p-6">
      <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-(--ink)">
        <RiSettings3Line className="text-(--muted)" /> Your Billify Profile
      </h2>
      <p className="mt-1 text-sm text-(--muted)">Manage freelancer identity, GST details, and bank information.</p>
      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        <div>
          {user?.logoUrl ? (
            <img src={`${import.meta.env.VITE_SERVER_URL || "http://localhost:5000"}${user.logoUrl}`} alt="Billify logo" className="h-32 w-32 rounded-2xl border border-(--line) object-cover" />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-2xl border border-dashed border-(--line) text-(--muted)">No Logo</div>
          )}
          <label className="btn-muted mt-3 inline-flex cursor-pointer items-center">
            <RiUploadCloud2Line className="text-base" />
            <span className="ml-2 inline-flex items-center gap-2">
              {uploading ? <Spinner size={16} glow inline /> : null}
              <span>{uploading ? "Uploading..." : "Upload Logo"}</span>
            </span>
            <input type="file" accept="image/*" className="hidden" onChange={onLogoChange} />
          </label>
        </div>
        <form className="space-y-3 lg:col-span-2" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-3 md:grid-cols-2">
            <input {...register("name", { required: true })} placeholder="Name" className="field-input" />
            <input {...register("email", { required: true })} placeholder="Email" className="field-input" />
            <input {...register("phone")} placeholder="Phone" className="field-input" />
            <input {...register("gstin")} placeholder="GSTIN" className="field-input" />
          </div>
          <textarea {...register("address")} placeholder="Address" rows="2" className="field-input" />
          <div className="grid gap-3 md:grid-cols-2">
            <input {...register("accountName")} placeholder="Account Name" className="field-input" />
            <input {...register("accountNumber")} placeholder="Account Number" className="field-input" />
            <input {...register("ifsc")} placeholder="IFSC" className="field-input" />
            <input {...register("bankName")} placeholder="Bank Name" className="field-input" />
          </div>
          <input {...register("upiId")} placeholder="UPI ID" className="field-input" />
          <button type="submit" disabled={isSubmitting} className="btn-primary">Save Settings</button>
        </form>
      </div>
    </section>
  );
};

export default Settings;
