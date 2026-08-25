import { Mail, Phone, MapPin, Github, Linkedin } from "lucide-react";
import { personalInfo } from "../data";
import WhatsAppIcon from "./WhatsAppIcon";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="main-footer" className="bg-bg2 border-t border-white/5 py-12 relative overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[150px] bg-purple-glow/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Column 1: Info and Bio */}
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2">
              <span className="font-display font-bold text-lg text-text-main">
                Ijlal Hussain
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-bright animate-pulse-subtle" />
            </div>
            <p className="font-sans text-xs text-text-muted leading-relaxed max-w-sm">
              Software Engineering Graduate from NUML Islamabad specializing in Generative AI pipelines, 
              custom agent workflows, high-performance web backends, and responsive Android applications.
            </p>
          </div>

          {/* Column 2: Contact info */}
          <div className="flex flex-col space-y-3">
            <span className="font-display font-semibold text-sm text-text-sub uppercase tracking-wider">
              Get in Touch
            </span>
            <ul className="space-y-2.5 font-mono text-xs text-text-muted">
              <li className="flex items-center space-x-2 hover:text-cyan-bright transition-colors duration-200">
                <Mail className="w-4 h-4 text-cyan-bright flex-shrink-0" />
                <a href={`mailto:${personalInfo.email}`}>Email</a>
              </li>
              <li className="flex items-center space-x-2 hover:text-purple-bright transition-colors duration-200">
                <Phone className="w-4 h-4 text-purple-bright flex-shrink-0" />
                <a href={`tel:${personalInfo.phone.replace(/\s+/g, "")}`}>{personalInfo.phone}</a>
              </li>
              <li className="flex items-center space-x-2 text-text-muted">
                <MapPin className="w-4 h-4 text-green-accent flex-shrink-0" />
                <span>{personalInfo.location}</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Navigation and Socials */}
          <div className="flex flex-col space-y-4 items-start md:items-end">
            <span className="font-display font-semibold text-sm text-text-sub uppercase tracking-wider">
              Social Channels
            </span>
            <div className="flex space-x-3">
              <a
                id="footer-github"
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-card border border-white/5 text-text-sub hover:text-cyan-bright hover:border-cyan-glow/30 transition-all duration-200"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                id="footer-linkedin"
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-card border border-white/5 text-text-sub hover:text-purple-bright hover:border-purple-glow/30 transition-all duration-200"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                id="footer-whatsapp"
                href={`https://wa.me/${personalInfo.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-card border border-white/5 text-text-sub hover:text-emerald-400 hover:border-emerald-500/30 transition-all duration-200"
                title="WhatsApp Chat"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
              <a
                id="footer-mail"
                href={`mailto:${personalInfo.email}`}
                className="p-2.5 rounded-xl bg-card border border-white/5 text-text-sub hover:text-cyan-bright hover:border-cyan-glow/30 transition-all duration-200"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
            
            {/* Status Badge - Responsively aligned */}
            <div className="w-full flex items-center justify-start md:justify-end pt-1">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-subtle" />
                <span>Available for Global Remote Work</span>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between font-mono text-[10px] text-text-muted">
          <p>© {currentYear} Ijlal Hussain. All Rights Reserved.</p>
          <p className="mt-2 sm:mt-0 text-text-muted/60">Designed & Engineered with Precision</p>
        </div>
      </div>
    </footer>
  );
}
