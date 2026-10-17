import Link from 'next/link';
import { tr } from '@/lib/i18n-inline';
import {
  Gauge,
  Globe2,
  GraduationCap,
  Megaphone,
  Network,
  ShieldCheck,
  Sparkles,
  Ship,
} from 'lucide-react';

export function Footer({ locale }: { locale: string }) {
  const t = (en: string, ar: string) => tr(locale, en, ar);

  return (
    <footer className="border-t bg-slate-950 text-slate-300 mt-16 print:hidden">
      <div className="container mx-auto px-4 py-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Column 1: Platform Identity */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xl font-extrabold text-white">
              {t('El-Mahalla Industrial Textile Cluster', 'منصة تجمع المحلة الكبرى لصناعة الغزل والنسيج')}
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              {t(
                'Integrated B2B industrial ecosystem powered by Multi-Provider Free LLMs, 9-Pillar Toyota Production System (TPS) & Lean Six Sigma tools, Global Export Intelligence, AI Brand Studio, and EU Digital Product Passports.',
                'المنظومة الرقمية الصناعية المتكاملة لتجمع المحلة الكبرى: ١٧ وحدة للتعاون والتحديث، ٩ ركائز للتصنيع الرشيق ولين 6 سيجما، ذكاء التصدير والمشترين، استوديو الهوية والتسويق، والأكاديمية الذكية.'
              )}
            </p>
            <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
              <span className="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 font-bold text-emerald-300">
                17 Cluster Modules
              </span>
              <span className="rounded-full border border-sky-500/40 bg-sky-500/15 px-3 py-1 font-bold text-sky-300">
                9-Pillar Lean Six Sigma
              </span>
              <span className="rounded-full border border-amber-500/40 bg-amber-500/15 px-3 py-1 font-bold text-amber-300">
                7 Free LLM Models
              </span>
            </div>
          </div>

          {/* Column 2: Flagship AI & Operational Excellence Studios */}
          <div className="space-y-2.5 text-xs sm:text-sm">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-xs">
              {t('AI Studios & Excellence Hubs', 'مراكز التميز والذكاء الاصطناعي')}
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link
                  href={`/${locale}/cluster/lean-manufacturing`}
                  className="hover:text-emerald-400 inline-flex items-center gap-1.5"
                >
                  <Gauge className="h-3.5 w-3.5 text-emerald-400" />
                  {t('Lean Six Sigma Hub (9 Pillars)', 'مركز التصنيع الرشيق ولين 6 سيجما')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/cluster/export-intelligence`}
                  className="hover:text-emerald-400 inline-flex items-center gap-1.5"
                >
                  <Globe2 className="h-3.5 w-3.5 text-sky-400" />
                  {t('Export Intelligence & Buyers', 'ذكاء التصدير والمشترين الدوليين')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/cluster/brand-studio`}
                  className="hover:text-emerald-400 inline-flex items-center gap-1.5"
                >
                  <Megaphone className="h-3.5 w-3.5 text-amber-400" />
                  {t('AI Brand & Marketing Studio', 'استوديو الهوية والتسويق الآلي')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/cluster/academy/studio`}
                  className="hover:text-emerald-400 inline-flex items-center gap-1.5"
                >
                  <GraduationCap className="h-3.5 w-3.5 text-emerald-400" />
                  {t('AI Course Studio & Certificates', 'استوديو بناء الدورات والشهادات')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/ai`}
                  className="hover:text-emerald-400 inline-flex items-center gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                  {t('Multi-LLM AI Command Center', 'مركز قيادة النماذج الذكية المجانية')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Collaboration & Modernization */}
          <div className="space-y-2.5 text-xs sm:text-sm">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-xs">
              {t('Cluster Collaboration', 'وحدات التعاون والتحديث')}
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href={`/${locale}/cluster`} className="hover:text-white inline-flex items-center gap-1.5">
                  <Network className="h-3.5 w-3.5 text-emerald-400" />
                  {t('Cluster Collaboration Hub', 'مركز التجمع الصناعي الشامل')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/cluster/procurement`} className="hover:text-white">
                  {t('Joint Procurement Pools', 'الشراء الموحّد للخامات')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/cluster/capacity`} className="hover:text-white">
                  {t('Idle Capacity Exchange', 'بورصة الطاقات الإنتاجية')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/cluster/consortia`} className="hover:text-white">
                  {t('Export Consortia', 'التحالفات التصديرية')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/cluster/sustainability`} className="hover:text-white">
                  {t('Sustainability, ESG & CBAM', 'الاستدامة والبصمة الكربونية CBAM')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/cluster/observatory`} className="hover:text-white">
                  {t('Cluster Macro Observatory', 'مرصد التجمع والمؤشرات')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: B2B Marketplaces, DPP & Logistics */}
          <div className="space-y-2.5 text-xs sm:text-sm">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-xs">
              {t('Marketplaces & Trade Tools', 'الأسواق وأدوات التجارة')}
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href={`/${locale}/factories`} className="hover:text-white">
                  {t('Verified Factories Directory', 'دليل المصانع المعتمدة')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/marketplaces/products`} className="hover:text-white">
                  {t('Finished Products & Fabrics', 'كتالوج الأقمشة والمنتجات')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/marketplaces/waste`} className="hover:text-white">
                  {t('Circular Waste Exchange', 'بورصة العوادم والرواكد')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/dpp/demo-giza86-sateen`}
                  className="hover:text-emerald-400 inline-flex items-center gap-1.5"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  {t('EU Digital Product Passport', 'جواز المنتج الرقمي الأوروبي DPP')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/services/logistics`}
                  className="hover:text-sky-400 inline-flex items-center gap-1.5"
                >
                  <Ship className="h-3.5 w-3.5 text-sky-400" />
                  {t('Freight & Incoterms Calculator', 'حاسبة الشحن والإنكوتيرمز')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()}{' '}
            {t(
              'El-Mahalla Industrial Textile Cluster — Supported by TIGARA / UNIDO / EU & Ministry of Industry',
              'تجمع المحلة الكبرى لصناعة الغزل والنسيج — بدعم مشروع تيجارا (TIGARA) واليونيدو والاتحاد الأوروبي ووزارة الصناعة'
            )}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/api/health" className="hover:text-emerald-400 font-mono">
              {t('● System & Multi-LLM Telemetry: OK', '● حالة النظام والذكاء الاصطناعي: نشط')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
