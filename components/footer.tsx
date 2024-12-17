import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="py-12 px-4 bg-background border-t">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-start justify-start">
              <Image src="/logo.png" alt="Logo" width={36} height={36} className="mr-2" />
              <h3 className="font-bold text-2xl mb-4">LogoAIPro</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered logo generation for businesses of all sizes.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {['Home', 'About Us', 'Pricing', 'Contact'].map((item, index) => (
                <li key={index}>
                  <Link href="#" className="hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              {['Terms of Service', 'Privacy Policy', 'Cookie Policy'].map((item, index) => (
                <li key={index}>
                  <Link href="#" className="hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              {[Twitter, Facebook, Instagram, Linkedin].map((Icon, index) => (
                <Link key={index} href="#" className="hover:text-primary transition-colors">
                  <Icon size={24} />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} LogoAIPro. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

