import LoginForm from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-4 text-center">
        <span className="cute-underline">Login to LogoAIPro</span>
      </h1>
      <p className="text-xl text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
        Welcome back! Log in to access your account and create amazing logos.
      </p>
      <LoginForm />
    </div>
  )
}

