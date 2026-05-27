"use client";
import { LayoutDashboard, Archive, Package, Users, FileText, Settings, LogOut, Shield } from "lucide-react";
import IconHorizontal from '@/assets/icons/icon_horizontal.png';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/DashboardIndustrial', icon: LayoutDashboard, label: "Dashboard" },
  { href: "/Deliveries",         icon: Package,         label: "Entregas" },
  { href: "/Residents",          icon: Users,           label: "Moradores" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] flex-shrink-0 bg-gradient-to-b via-black to-[#002134] border-r border-[#1e3050] flex flex-col h-screen">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-[#1e3050]">
        <Image src={IconHorizontal} alt="Logo" className="w-[100%]" />
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              href={href}
              key={label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group relative ${
                isActive
                  ? "bg-[#00aaff]/10 text-[#00aaff] font-medium"
                  : "text-[#7a9bbf] hover:bg-[#1a2d50] hover:text-[#e8f0ff]"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#00aaff] rounded-r" />
              )}
              <Icon size={16} />
              <span className="font-head tracking-wide">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-5 py-4 border-b border-[#1e3050] mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1a2d50] flex items-center justify-center text-[#7a9bbf] text-sm font-semibold">
            CS
          </div>
          <div>
            <div className="text-sm font-semibold text-[#e8f0ff]">Carlos Silva</div>
            <div className="text-[11px] text-[#7a9bbf]">Porteiro / Admin</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 pb-4 border-t border-[#1e3050] pt-3">
        <Link href="/General/LoginPage" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#7a9bbf] hover:bg-[#1a2d50] hover:text-[#ff4d6a] transition-all">
          <LogOut size={16} />
          <span className="font-head tracking-wide">Logout</span>
        </Link>
      </div>
    </aside>
  );
}