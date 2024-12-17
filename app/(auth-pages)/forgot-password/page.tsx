import ForgotPasswordForm from '@/components/auth/forgot-password-form'

export default function ForgotPasswordPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-4 text-center">
        <span className="cute-underline">Forgot Password</span>
      </h1>
      <p className="text-xl text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
        Don't worry, we'll help you reset your password and get back to creating logos.
      </p>
      <ForgotPasswordForm />
    </div>
  )
}

