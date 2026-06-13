import { useSignIn } from "@clerk/clerk-react";

const SignInOAuthButtons = () => {
  const { signIn, isLoaded } = useSignIn();
  if (!isLoaded) return null;
  const signInWithGoogle = () => signIn.authenticateWithRedirect({
    strategy: "oauth_google",
    redirectUrl: "/sso-callback",
    redirectUrlComplete: "/auth-callback",
  });
  return (
    <button onClick={signInWithGoogle}
      className="glass border border-white/10 text-white/65 hover:text-white hover:border-purple-500/30 px-4 py-2 rounded-xl text-sm font-medium inline-flex items-center gap-2 transition-all">
      <img src="/google.png" alt="" className="size-4" />
      Sign in
    </button>
  );
};
export default SignInOAuthButtons;
