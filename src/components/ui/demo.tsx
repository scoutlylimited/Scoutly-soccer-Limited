import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Linkedin,
  Music2,
  X,
} from "lucide-react";
import { FooterBackgroundGradient, TextHoverEffect } from "./hover-footer";

function HoverFooter() {
  const currentYear = new Date().getFullYear();

  // Footer link data
  const footerLinks = [
    {
      title: "For Players",
      links: [
        { label: "Create Profile", href: "/signup" },
        { label: "Player Login", href: "/login" },
        { label: "Early Access", href: "#early-access" },
        { label: "How It Works", href: "#how-it-works" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Profile Tips", href: "#how-it-works" },
        { label: "Terms of Service", href: "#" },
        { label: "Privacy Policy", href: "#" },
        {
          label: "Support Desk",
          href: "#",
          pulse: true,
        },
      ],
    },
  ];

  // Contact info data
  const contactInfo = [
    {
      icon: <Mail size={16} className="text-[#22C55E]" />,
      text: "hello@scoutly.co",
      href: "mailto:hello@scoutly.co",
    },
    {
      icon: <Phone size={16} className="text-[#22C55E]" />,
      text: "Partnerships and support",
      href: "mailto:hello@scoutly.co",
    },
    {
      icon: <MapPin size={16} className="text-[#22C55E]" />,
      text: "Remote-first football network",
    },
  ];

  // Social media icons
  const socialLinks = [
    { icon: <Linkedin size={18} />, label: "LinkedIn", href: "https://linkedin.com" },
    { icon: <Music2 size={18} />, label: "TikTok", href: "https://tiktok.com" },
    { icon: <X size={18} />, label: "X", href: "https://x.com" },
    { icon: <Instagram size={18} />, label: "Instagram", href: "https://instagram.com" },
  ];

  return (
    <footer className="bg-slate-950 text-white relative h-fit rounded-[2rem] overflow-hidden mt-12 border border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-12 sm:px-10 sm:py-16 z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 lg:gap-12 pb-12 border-b border-white/5">
          {/* Brand section */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-[#22C55E] to-[#10B981] text-base font-black text-slate-950">
                S
              </span>
              <span className="text-white text-lg font-black tracking-tight font-display">Scoutly</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 font-medium">
              A digital football scouting platform for serious players ready to organize their profile, stats, and highlights.
            </p>
          </div>

          {/* Footer link sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-white text-xs font-black uppercase tracking-wider mb-5 font-display">
                {section.title}
              </h4>
              <ul className="space-y-3 text-xs font-semibold text-slate-400">
                {section.links.map((link) => (
                  <li key={link.label} className="relative w-fit">
                    {link.href.startsWith("/") ? (
                      <Link
                        to={link.href}
                        className="hover:text-[#22C55E] transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="hover:text-[#22C55E] transition-colors"
                      >
                        {link.label}
                      </a>
                    )}
                    {link.pulse && (
                      <span className="absolute top-1 right-[-10px] w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse"></span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact section */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-wider mb-5 font-display">
              Contact Us
            </h4>
            <ul className="space-y-3.5 text-xs font-semibold text-slate-400">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-center space-x-3.5">
                  {item.icon}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="hover:text-[#22C55E] transition-colors"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="hover:text-[#22C55E] transition-colors">
                      {item.text}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs space-y-4 sm:space-y-0 pt-8 text-slate-400 font-semibold">
          {/* Social icons */}
          <div className="flex space-x-5 text-slate-400">
            {socialLinks.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="hover:text-[#22C55E] transition-colors hover:scale-105 transform"
              >
                {icon}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-center sm:text-right">
            &copy; {currentYear} Scoutly. Built for players ready to be seen.
          </p>
        </div>
      </div>

      {/* Text hover effect */}
      <div className="lg:flex hidden h-[22rem] -mt-40 -mb-28 justify-center items-center pointer-events-none">
        <TextHoverEffect text="SCOUTLY" className="z-10" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}

export default HoverFooter;
