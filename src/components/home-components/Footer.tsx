import React from 'react';
import { Shield, Github, Linkedin, Twitter, Mail, Heart } from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: 'Projeto',
    links: [
      { label: 'Simulador', href: '#' },
      { label: 'Documentação', href: '#' },
      { label: 'API Reference', href: '#' },
      { label: 'Exemplos', href: '#' }
    ]
  },
  {
    title: 'Recursos',
    links: [
      { label: 'Blog', href: '#' },
      { label: 'Tutoriais', href: '#' },
      { label: 'FAQ', href: '#' },
      { label: 'Suporte', href: '#' }
    ]
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacidade', href: '#' },
      { label: 'Termos de Uso', href: '#' },
      { label: 'Licença MIT', href: '#' },
      { label: 'Cookies', href: '#' }
    ]
  }
];

const Footer: React.FC = () => {
  return (
    <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-emerald-800/15">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center border border-emerald-600/30">
                <Shield className="w-5 h-5 text-emerald-200" />
              </div>
              <span className="text-xl font-bold text-emerald-50/90">
                AntiFraude
              </span>
            </div>

            {/* Description */}
            <p className="text-emerald-200/50 text-sm leading-relaxed mb-6 max-w-sm">
              Sistema de simulação de detecção de fraudes em cartões de crédito utilizando técnicas avançadas de Machine Learning e análise de dados em tempo real.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-emerald-950/40 border border-emerald-800/20 flex items-center justify-center text-emerald-400/60 hover:text-emerald-400 hover:border-emerald-700/40 transition-all duration-300 hover:scale-110"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-emerald-950/40 border border-emerald-800/20 flex items-center justify-center text-emerald-400/60 hover:text-emerald-400 hover:border-emerald-700/40 transition-all duration-300 hover:scale-110"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-emerald-950/40 border border-emerald-800/20 flex items-center justify-center text-emerald-400/60 hover:text-emerald-400 hover:border-emerald-700/40 transition-all duration-300 hover:scale-110"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-emerald-950/40 border border-emerald-800/20 flex items-center justify-center text-emerald-400/60 hover:text-emerald-400 hover:border-emerald-700/40 transition-all duration-300 hover:scale-110"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Link Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-emerald-50/80 font-semibold mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-emerald-200/50 hover:text-emerald-400 transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

    
        

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-emerald-800/10">
          <div className="text-sm text-emerald-200/40">
            © 2024 Sistema Antifraude. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-1 text-sm text-emerald-200/40">
            Feito com <Heart className="w-4 h-4 text-emerald-500 mx-1" /> para fins educacionais
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;