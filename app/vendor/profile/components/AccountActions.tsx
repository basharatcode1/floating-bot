"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ConfirmationDialog } from "@/app/components/ui/confirmation-dialog";
import {
  Lock,
  CreditCard,
  UserPlus,
  Star,
  Loader2,
  Eye,
  EyeOff,
  Pencil,
  SlidersHorizontal,
} from "lucide-react";
import { useFormik } from "formik";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { useVendorDashboardTheme } from "../../dashboard/VendorDashboardThemeContext";

const subUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.string().min(1, "Role is required"),
});

type SubUserData = z.infer<typeof subUserSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordData = z.infer<typeof passwordSchema>;

const validateWithZod =
  <T extends z.ZodTypeAny>(schema: T) =>
  (values: z.infer<T>) => {
    const result = schema.safeParse(values);
    if (result.success) return {};
    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join(".");
      errors[path] = issue.message;
    }
    return errors;
  };

export default function AccountActions({
  onEditClick,
  isEditing = false,
}: {
  onEditClick?: () => void;
  isEditing?: boolean;
}) {
  const { mode } = useVendorDashboardTheme();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [isSubUserModalOpen, setIsSubUserModalOpen] = useState(false);
  const [showSubUserPassword, setShowSubUserPassword] = useState(false);
  const [isSubUserLoading, setIsSubUserLoading] = useState(false);
  const [subUserSuccessMessage, setSubUserSuccessMessage] = useState<
    string | null
  >(null);

  const [subUsers, setSubUsers] = useState([
    { id: 1, email: "admin@company.com", role: "Admin" },
    { id: 2, email: "recruiter@company.com", role: "Recruiter" },
  ]);

  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "edit") {
      onEditClick?.();
      const params = new URLSearchParams(window.location.search);
      params.delete("action");
      const newPath =
        window.location.pathname +
        (params.toString() ? `?${params.toString()}` : "");
      router.replace(newPath, { scroll: false });
    } else if (action === "change-password") {
      setIsModalOpen(true);
      const params = new URLSearchParams(window.location.search);
      params.delete("action");
      const newPath =
        window.location.pathname +
        (params.toString() ? `?${params.toString()}` : "");
      router.replace(newPath, { scroll: false });
    } else if (action === "sub-user") {
      setIsSubUserModalOpen(true);
      const params = new URLSearchParams(window.location.search);
      params.delete("action");
      const newPath =
        window.location.pathname +
        (params.toString() ? `?${params.toString()}` : "");
      router.replace(newPath, { scroll: false });
    }
  }, [searchParams, router, onEditClick]);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [userToRemove, setUserToRemove] = useState<number | null>(null);

  const handleConfirmRemove = () => {
    if (userToRemove !== null) {
      setSubUsers((prev) => prev.filter((u) => u.id !== userToRemove));
      setUserToRemove(null);
    }
  };

  const formik = useFormik<PasswordData>({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validate: validateWithZod(passwordSchema),
    onSubmit: async (_, { resetForm }) => {
      setIsLoading(true);
      setSuccessMessage(null);

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsLoading(false);
      setSuccessMessage("Password successfully changed.");
      resetForm();
      setTimeout(() => {
        setSuccessMessage(null);
        setIsModalOpen(false);
      }, 2000);
    },
  });

  const handleClose = () => {
    setIsModalOpen(false);
    formik.resetForm();
    setSuccessMessage(null);
  };

  const subUserFormik = useFormik<SubUserData>({
    initialValues: {
      email: "",
      password: "",
      role: "",
    },
    validate: validateWithZod(subUserSchema),
    onSubmit: async (values, { resetForm }) => {
      setIsSubUserLoading(true);
      setSubUserSuccessMessage(null);

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubUsers((prev) => [
        ...prev,
        { id: Date.now(), email: values.email, role: values.role },
      ]);
      setIsSubUserLoading(false);
      setSubUserSuccessMessage("Sub user successfully added.");
      resetForm();
      setTimeout(() => {
        setSubUserSuccessMessage(null);
      }, 3000);
    },
  });

  const handleSubUserClose = () => {
    setIsSubUserModalOpen(false);
    subUserFormik.resetForm();
    setSubUserSuccessMessage(null);
  };

  return (
    <>
      <style>{`
        /* Fix for browser autofill background in dark mode */
        .sub-user-modal input:-webkit-autofill,
        .sub-user-modal input:-webkit-autofill:hover, 
        .sub-user-modal input:-webkit-autofill:focus, 
        .sub-user-modal input:-webkit-autofill:active {
          transition: background-color 5000s ease-in-out 0s !important;
          -webkit-text-fill-color: var(--dash-text-primary) !important;
        }
      `}</style>
      <div className="profile-section" id="account-actions-section">
        <div className="profile-section-title">
          <span className="profile-section-title-icon">
            <SlidersHorizontal size={18} />
          </span>
          Account Actions
        </div>
        <div className="profile-kv-list">
          {!isEditing && (
            <div
              className="profile-kv-row cursor-pointer hover:opacity-80 transition-opacity"
              onClick={onEditClick}
            >
              <span className="profile-kv-link flex items-center gap-2">
                <Pencil
                  size={15}
                  className="text-[var(--dash-text-muted)] shrink-0"
                />
                Edit Profile
              </span>
            </div>
          )}
          <div
            className="profile-kv-row cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="profile-kv-link flex items-center gap-2">
              <Lock
                size={15}
                className="text-[var(--dash-text-muted)] shrink-0"
              />
              Password
            </span>
          </div>
          <div
            className="profile-kv-row cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => router.push("/vendor/billing")}
          >
            <span className="profile-kv-link flex items-center gap-2">
              <CreditCard
                size={15}
                className="text-[var(--dash-text-muted)] shrink-0"
              />
              Billing &amp; Payment
            </span>
          </div>
          <div
            className="profile-kv-row cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setIsSubUserModalOpen(true)}
          >
            <span className="profile-kv-link flex items-center gap-2">
              <UserPlus
                size={15}
                className="text-[var(--dash-text-muted)] shrink-0"
              />
              Sub Users
            </span>
          </div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent
          data-dashboard-theme={mode}
          className="bg-[var(--dash-card-bg-solid)] border-[var(--dash-card-border)] text-[var(--dash-text-primary)] sm:max-w-[400px]"
        >
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              Change Password
            </DialogTitle>
            <DialogDescription className="text-xs text-[var(--dash-text-secondary)]">
              Update your password to keep your account secure.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={formik.handleSubmit} className="space-y-3 mt-2">
            {successMessage && (
              <div className="p-3 bg-[var(--dash-success-bg)] text-[var(--dash-success-text)] rounded-md text-xs">
                {successMessage}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-medium text-[var(--dash-text-primary)]">
                Current Password
              </label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  placeholder="Enter current password"
                  value={formik.values.currentPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`h-[var(--dash-input-height)] rounded-xl bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs px-3 pr-10 focus-visible:ring-1 focus-visible:ring-sky-500/60 ${
                    formik.touched.currentPassword &&
                    formik.errors.currentPassword
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--dash-text-muted)] hover:text-[var(--dash-text-primary)]"
                >
                  {showCurrentPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
              {formik.touched.currentPassword &&
                formik.errors.currentPassword && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.currentPassword}
                  </div>
                )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[var(--dash-text-primary)]">
                New Password
              </label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="Enter new password"
                  value={formik.values.newPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`h-[var(--dash-input-height)] rounded-xl bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs px-3 pr-10 focus-visible:ring-1 focus-visible:ring-sky-500/60 ${
                    formik.touched.newPassword && formik.errors.newPassword
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--dash-text-muted)] hover:text-[var(--dash-text-primary)]"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formik.touched.newPassword && formik.errors.newPassword && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.newPassword}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[var(--dash-text-primary)]">
                Confirm New Password
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`h-[var(--dash-input-height)] rounded-xl bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs px-3 pr-10 focus-visible:ring-1 focus-visible:ring-sky-500/60 ${
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--dash-text-muted)] hover:text-[var(--dash-text-primary)]"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.confirmPassword}
                  </div>
                )}
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClose}
                className="bg-transparent border-[var(--dash-card-border)] text-[var(--dash-text-primary)] hover:bg-[var(--dash-card-bg-hover)] text-xs h-9 px-4 rounded-lg font-medium"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isLoading}
                className="dash-btn-primary text-white border-0 text-xs h-9 px-4 rounded-lg font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Sub User Modal */}
      <Dialog open={isSubUserModalOpen} onOpenChange={handleSubUserClose}>
        <DialogContent
          data-dashboard-theme={mode}
          className="sub-user-modal bg-[var(--dash-card-bg-solid)] border-[var(--dash-card-border)] text-[var(--dash-text-primary)] sm:max-w-[550px] max-h-[85vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Manage Sub Users
            </DialogTitle>
            <DialogDescription className="text-[var(--dash-text-secondary)]">
              Create sub users and manage their permissions.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 space-y-6">
            {/* Create User Form */}
            <form
              onSubmit={subUserFormik.handleSubmit}
              className="space-y-4 p-4 rounded-lg bg-[var(--dash-bg)] border border-[var(--dash-card-border)]"
            >
              <h3 className="text-sm font-semibold text-[var(--dash-text-primary)]">
                Add New Sub User
              </h3>
              {subUserSuccessMessage && (
                <div className="p-3 bg-[var(--dash-success-bg)] text-[var(--dash-success-text)] rounded-md text-sm">
                  {subUserSuccessMessage}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-[var(--dash-text-primary)]">
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="user@example.com"
                    value={subUserFormik.values.email}
                    onChange={subUserFormik.handleChange}
                    onBlur={subUserFormik.handleBlur}
                    className={`h-[var(--dash-input-height)] w-full rounded-xl bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs px-3 focus-visible:ring-1 focus-visible:ring-sky-500/60 ${
                      subUserFormik.touched.email && subUserFormik.errors.email
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }`}
                  />
                  {subUserFormik.touched.email &&
                    subUserFormik.errors.email && (
                      <div className="text-red-500 text-xs mt-1">
                        {subUserFormik.errors.email}
                      </div>
                    )}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-[var(--dash-text-primary)]">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showSubUserPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      value={subUserFormik.values.password}
                      onChange={subUserFormik.handleChange}
                      onBlur={subUserFormik.handleBlur}
                      className={`h-[var(--dash-input-height)] w-full rounded-xl bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs px-3 pr-10 focus-visible:ring-1 focus-visible:ring-sky-500/60 ${
                        subUserFormik.touched.password &&
                        subUserFormik.errors.password
                          ? "border-red-500 focus-visible:ring-red-500"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowSubUserPassword(!showSubUserPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--dash-text-muted)] hover:text-[var(--dash-text-primary)]"
                    >
                      {showSubUserPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                  {subUserFormik.touched.password &&
                    subUserFormik.errors.password && (
                      <div className="text-red-500 text-xs mt-1">
                        {subUserFormik.errors.password}
                      </div>
                    )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--dash-text-primary)]">
                  Role & Permissions
                </label>
                <Select
                  value={subUserFormik.values.role}
                  onValueChange={(value) =>
                    subUserFormik.setFieldValue("role", value)
                  }
                >
                  <SelectTrigger
                    className={`h-[var(--dash-input-height)] w-full rounded-xl bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs px-3 focus:ring-1 focus:ring-sky-500/60 ${
                      subUserFormik.touched.role && subUserFormik.errors.role
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    onBlur={() => subUserFormik.setFieldTouched("role", true)}
                  >
                    <SelectValue placeholder="Select a role..." />
                  </SelectTrigger>
                  <SelectContent
                    data-dashboard-theme={mode}
                    className="bg-[var(--dash-card-bg-solid)] border-[var(--dash-card-border)] text-[var(--dash-text-primary)]"
                  >
                    <SelectItem value="Admin">Admin (Full Access)</SelectItem>
                    <SelectItem value="Recruiter">
                      Recruiter (Job Postings & Candidates)
                    </SelectItem>
                    <SelectItem value="Viewer">Viewer (Read Only)</SelectItem>
                  </SelectContent>
                </Select>
                {subUserFormik.touched.role && subUserFormik.errors.role && (
                  <div className="text-red-500 text-xs mt-1">
                    {subUserFormik.errors.role}
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubUserLoading}
                  className="dash-btn-primary text-white border-0 text-xs h-9 px-4 rounded-lg font-medium"
                >
                  {isSubUserLoading ? (
                    <>
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Sub User"
                  )}
                </Button>
              </div>
            </form>

            {/* Existing Sub Users */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[var(--dash-text-primary)]">
                Existing Sub Users
              </h3>
              {subUsers.length === 0 ? (
                <div className="text-sm text-[var(--dash-text-muted)] italic">
                  No sub users found.
                </div>
              ) : (
                <div className="border border-[var(--dash-card-border)] rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-[var(--dash-bg)] border-b border-[var(--dash-card-border)] text-[var(--dash-text-secondary)]">
                      <tr>
                        <th className="px-4 py-2 font-medium">Email</th>
                        <th className="px-4 py-2 font-medium">Role</th>
                        <th className="px-4 py-2 font-medium text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--dash-card-border)] bg-[var(--dash-card-bg)]">
                      {subUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="text-[var(--dash-text-primary)]"
                        >
                          <td className="px-4 py-3">{user.email}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[var(--dash-badge-bg)] text-[var(--dash-badge-text)]">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              className="text-red-500 hover:text-red-700 text-xs font-medium"
                              onClick={() => {
                                setUserToRemove(user.id);
                                setIsConfirmOpen(true);
                              }}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSubUserClose}
                className="bg-transparent border-[var(--dash-card-border)] text-[var(--dash-text-primary)] hover:bg-[var(--dash-card-bg-hover)] text-xs h-9 px-4 rounded-lg font-medium"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Remove Sub User"
        description="Are you sure you want to remove this sub user? This action will revoke their access immediately."
        confirmText="Remove"
        variant="destructive"
        theme={mode as "light" | "dark"}
        onConfirm={handleConfirmRemove}
      />
    </>
  );
}
