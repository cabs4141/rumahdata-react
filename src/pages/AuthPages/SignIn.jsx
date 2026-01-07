import AuthLayout from "./AuthPageLayout.jsx";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
