import Link from 'next/link'
import { Scale } from 'lucide-react'
import { SignUpForm } from '@/components/auth/SignUpForm'
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-background">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2.5 mb-6">
            <Scale className="w-5 h-5 text-accent" />
            <span className="font-serif text-xl font-medium text-foreground">PravnaAI</span>
          </div>
          <h1 className="text-lg font-medium text-foreground mb-1">
            Ustvari račun
          </h1>
          <p className="text-sm text-muted-foreground">
            Začnite z brezplačnim pravnim svetovanjem
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <GoogleSignInButton />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-4 text-muted-foreground">ali</span>
            </div>
          </div>

          <SignUpForm />

          <p className="text-center text-sm text-muted-foreground">
            Že imate račun?{' '}
            <Link href="/auth/login" className="text-accent hover:underline font-medium">
              Prijavite se
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
