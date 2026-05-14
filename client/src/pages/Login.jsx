import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { RiLockPasswordLine, RiMailLine } from "react-icons/ri";
import { useAuth } from "../context/useAuth";
import usePageTitle from "../utils/usePageTitle";

const Login = () => {
  usePageTitle("Login");
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (values) => {
    try {
      await login(values);
      toast.success("Logged in successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-5 text-center">
          <img
            src="/billifylogo.png"
            alt="Billify logo"
            className="mx-auto mb-3 h-16 w-auto max-w-30 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-2)] object-contain px-2"
          />
          <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--ink)]"><span className="brand-word">Billify</span></h1>
          <p className="text-sm text-[color:var(--muted)]">Invoicing made simple for Indian freelancers</p>
        </div>
        <div className="shell-card p-6 sm:p-7">
          <h2 className="mb-5 text-xl font-semibold tracking-tight text-[color:var(--ink)]">Login</h2>
          <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="field-label">Email</label>
              <div className="relative">
                <RiMailLine className="pointer-events-none absolute left-3 top-3 text-[color:var(--muted)]" />
              <input
                {...register("email", { required: "Email is required" })}
                type="email"
                placeholder="Email"
                className="field-input pl-10"
              />
              </div>
              {errors.email && <p className="text-xs text-[color:var(--danger)]">{errors.email.message}</p>}
            </div>
            <div>
              <label className="field-label">Password</label>
              <div className="relative">
                <RiLockPasswordLine className="pointer-events-none absolute left-3 top-3 text-[color:var(--muted)]" />
              <input
                {...register("password", { required: "Password is required" })}
                type="password"
                placeholder="Password"
                className="field-input pl-10"
              />
              </div>
              {errors.password && <p className="text-xs text-[color:var(--danger)]">{errors.password.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full"
            >
              {isSubmitting ? "Please wait..." : "Login"}
            </button>
          </form>
          <p className="mt-4 text-sm text-[color:var(--muted)]">
            No account? <Link to="/register" className="font-medium text-[color:var(--accent)] underline decoration-[color:var(--accent)] underline-offset-4">Register</Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;
