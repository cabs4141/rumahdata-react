import AuthLayout from "@/pages/AuthPages/AuthPageLayout.jsx";
import SignInForm from "@/features/auth/components/SignInForm";

export default function SignIn() {
  return (
    <>
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
