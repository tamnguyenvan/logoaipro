import SignUpForm from '@/components/auth/sign-up-form'

export default function SignUpPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-4 text-center">
        <span className="cute-underline">Sign Up for LogoAIPro</span>
      </h1>
      <p className="text-xl text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
        Join LogoAIPro today and start creating stunning logos with AI technology.
      </p>
      <SignUpForm />
    </div>
  )
}

