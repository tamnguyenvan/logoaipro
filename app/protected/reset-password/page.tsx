// import { resetPasswordAction } from "@/actions/auth";
// import { SubmitButton } from "@/components/auth/submit-button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// export default async function ResetPassword() {
//   return (
//     <form className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4">
//       <h1 className="text-2xl font-medium">Reset password</h1>
//       <p className="text-sm text-foreground/60">
//         Please enter your new password below.
//       </p>
//       <Label htmlFor="password">New password</Label>
//       <Input
//         type="password"
//         name="password"
//         placeholder="New password"
//         required
//       />
//       <Label htmlFor="confirmPassword">Confirm password</Label>
//       <Input
//         type="password"
//         name="confirmPassword"
//         placeholder="Confirm password"
//         required
//       />
//       <SubmitButton pendingText="Resetting password..." formAction={resetPasswordAction}>
//         Reset password
//       </SubmitButton>
//     </form>
//   );
// }

// import { resetPasswordAction } from "@/actions/auth";
import { SubmitButton } from "@/components/auth/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function ResetPassword() {

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-4 text-center">
        <span className="cute-underline">Reset Password</span>
      </h1>
      <p className="text-xl text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
        Don't worry, we'll help you reset your password and get back to creating logos.
      </p>
      <form className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4">
        <Label htmlFor="password">New password</Label>
        <Input
          type="password"
          name="password"
          placeholder="New password"
          required
        />
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          required
        />
        {/* TODO: */}
        <SubmitButton pendingText="Resetting password..." >
          Reset password
        </SubmitButton>
      </form>
    </div>
  );
}