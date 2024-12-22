'use client'

import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

const footerLinks = {
  followUs: [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" }
  ],
  freeTools: [
    { name: "AI Logo Generator", href: "/logo-generator" },
    { name: "Logo Editor", href: "/logo-editor", isNew: true },
  ],
  apps: [
    { name: "Web Editor", href: "#" },
    { name: "iPhone app", href: "#" },
    { name: "Android app", href: "#" },
    { name: "API (developers)", href: "#" }
  ],
  company: [
    { name: "About us", href: "#" },
    { name: "Pricing", href: "#" },
    { name: "Press Kit", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Contact sales", href: "#" }
  ],
  legal: [
    { name: "Help center", href: "#" },
    { name: "Terms & conditions", href: "#" },
    { name: "Privacy policy", href: "#" },
    { name: "Cookie policy", href: "#" }
  ]
}

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Follow Us */}
          <div>
            <h3 className="font-bold mb-6">Follow us</h3>
            <div className="flex gap-4">
              {footerLinks.followUs.map((social, index) => (
                <Link 
                  key={index} 
                  href={social.href}
                  className="hover:opacity-80 transition-opacity"
                  aria-label={social.label}
                >
                  <social.icon className="w-6 h-6" />
                </Link>
              ))}
            </div>
          </div>

          {/* Free Tools */}
          <div>
            <h3 className="font-bold mb-6">Free tools</h3>
            <ul className="space-y-3">
              {footerLinks.freeTools.map((tool, index) => (
                <li key={index}>
                  <Link href={tool.href} className="hover:opacity-80 transition-opacity inline-flex items-center gap-2">
                    {tool.name}
                    {tool.isNew && (
                      <Badge variant="outline" className="text-[10px] h-4 border-white text-white">
                        New
                      </Badge>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Apps */}
          <div>
            <h3 className="font-bold mb-6">Free apps</h3>
            <ul className="space-y-3">
              {footerLinks.apps.map((app, index) => (
                <li key={index}>
                  <Link href={app.href} className="hover:opacity-80 transition-opacity">
                    {app.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold mb-6">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((item, index) => (
                <li key={index}>
                  <Link href={item.href} className="hover:opacity-80 transition-opacity">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & Legal */}
          <div>
            <h3 className="font-bold mb-6">Help & legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((item, index) => (
                <li key={index}>
                  <Link href={item.href} className="hover:opacity-80 transition-opacity">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/20">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Image src="/logo.png" alt="LogoAIPro" width={24} height={24} />
            <p className="text-sm">© {new Date().getFullYear()} LogoAIPro, Inc.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              English
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

