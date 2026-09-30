"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const navigation = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: "grid",
  },
  {
    name: "Requests",
    href: "/dashboard/requests",
    icon: "inbox",
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: "chart",
  },
  {
    name: "Escalations",
    href: "/dashboard/escalations",
    icon: "alert",
  },
  {
    name: "Activity",
    href: "/dashboard/activity",
    icon: "activity",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#080B0F] text-[#F1F5F9]">

      {/* ====================================================== */}
      {/* SIDEBAR */}
      {/* ====================================================== */}

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-[#1D2933] bg-[#0A0F14] lg:flex lg:flex-col">

        {/* Logo */}
        <div className="flex h-20 items-center px-6">

          <Link
            href="/"
            className="flex items-center gap-3"
          >

            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">

              <div className="h-2.5 w-2.5 rounded-full bg-[#14B8A6] shadow-[0_0_14px_#14B8A6]" />

            </div>

            <div>

              <div className="text-sm font-semibold tracking-wide text-white">
                AutoOps
              </div>

              <div className="mt-0.5 text-[9px] uppercase tracking-[0.16em] text-[#475569]">
                Operations
              </div>

            </div>

          </Link>

        </div>


        {/* Navigation */}
        <nav className="flex-1 px-3 py-5">

          <p className="mb-3 px-3 text-[9px] font-medium uppercase tracking-[0.18em] text-[#475569]">
            Workspace
          </p>

          <div className="space-y-1">

            {navigation.map((item) => {

              const active =
                pathname === item.href ||
                (
                  item.href !== "/dashboard" &&
                  pathname.startsWith(`${item.href}/`)
                );

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                    active
                      ? "bg-[#14B8A6]/10 text-[#14B8A6]"
                      : "text-[#64748B] hover:bg-white/[0.03] hover:text-[#CBD5E1]"
                  }`}
                >

                  <NavIcon
                    type={item.icon}
                    active={active}
                  />

                  <span>
                    {item.name}
                  </span>

                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#14B8A6]" />
                  )}

                </Link>
              );

            })}

          </div>

        </nav>


        {/* ==================================================== */}
        {/* AGENT STATUS */}
        {/* ==================================================== */}

        <div className="p-4">

          <div className="rounded-2xl border border-[#1D2933] bg-[#0F141A] p-4">

            <div className="flex items-center gap-2">

              <span className="h-2 w-2 rounded-full bg-[#14B8A6] shadow-[0_0_10px_#14B8A6]" />

              <span className="text-xs font-medium text-[#CBD5E1]">
                Autonomous Agent
              </span>

            </div>

            <p className="mt-2 text-[10px] leading-5 text-[#475569]">
              AI operations engine is ready to process incoming requests.
            </p>

            <div className="mt-3 flex items-center justify-between border-t border-[#1D2933] pt-3">

              <span className="text-[9px] uppercase tracking-wider text-[#475569]">
                Status
              </span>

              <span className="text-[9px] font-medium text-[#14B8A6]">
                Operational
              </span>

            </div>

          </div>

        </div>

      </aside>


      {/* ====================================================== */}
      {/* MOBILE HEADER */}
      {/* ====================================================== */}

      <header className="sticky top-0 z-30 flex h-16 items-center border-b border-[#1D2933] bg-[#080B0F]/95 px-5 backdrop-blur lg:hidden">

        <Link
          href="/"
          className="flex items-center gap-3"
        >

          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">

            <div className="h-2.5 w-2.5 rounded-full bg-[#14B8A6] shadow-[0_0_14px_#14B8A6]" />

          </div>

          <div>

            <div className="text-sm font-semibold tracking-wide text-white">
              AutoOps
            </div>

            <div className="mt-0.5 text-[9px] uppercase tracking-[0.16em] text-[#475569]">
              Operations
            </div>

          </div>

        </Link>

      </header>


      {/* ====================================================== */}
      {/* MAIN CONTENT */}
      {/* ====================================================== */}

      <div className="lg:pl-64">


        {/* Desktop Topbar */}
        <header className="hidden h-20 items-center justify-between border-b border-[#1D2933] bg-[#080B0F]/80 px-8 backdrop-blur lg:flex">

          <div>

            <p className="text-[9px] uppercase tracking-[0.2em] text-[#475569]">
              Autonomous Operations
            </p>

            <p className="mt-1 text-sm text-[#94A3B8]">
              AI-powered workflow control center
            </p>

          </div>


          <div className="flex items-center gap-4">

            <div className="flex items-center gap-2 rounded-full border border-[#1D2933] bg-[#0F141A] px-3 py-2">

              <span className="h-1.5 w-1.5 rounded-full bg-[#14B8A6]" />

              <span className="text-[10px] text-[#64748B]">
                System operational
              </span>

            </div>

          </div>

        </header>


        {/* Page */}
        <main>
          {children}
        </main>

      </div>

    </div>
  );
}


/* ====================================================== */
/* NAVIGATION ICON */
/* ====================================================== */

function NavIcon({
  type,
  active,
}: {
  type: string;
  active: boolean;
}) {

  const color = active
    ? "#14B8A6"
    : "currentColor";


  /* Grid */
  if (type === "grid") {
    return (
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.7"
      >

        <rect
          x="3"
          y="3"
          width="7"
          height="7"
          rx="1"
        />

        <rect
          x="14"
          y="3"
          width="7"
          height="7"
          rx="1"
        />

        <rect
          x="3"
          y="14"
          width="7"
          height="7"
          rx="1"
        />

        <rect
          x="14"
          y="14"
          width="7"
          height="7"
          rx="1"
        />

      </svg>
    );
  }


  /* Inbox */
  if (type === "inbox") {
    return (
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.7"
      >

        <path d="M4 4h16v12H4z" />

        <path d="M4 13h4l2 3h4l2-3h4" />

      </svg>
    );
  }


  /* Chart */
  if (type === "chart") {
    return (
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.7"
      >

        <path d="M4 19V5" />

        <path d="M4 19h16" />

        <path d="m7 15 4-5 3 3 5-7" />

      </svg>
    );
  }


  /* Alert */
  if (type === "alert") {
    return (
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.7"
      >

        <path d="M12 3 21 20H3L12 3Z" />

        <path d="M12 9v4" />

        <circle
          cx="12"
          cy="17"
          r=".7"
          fill={color}
          stroke="none"
        />

      </svg>
    );
  }


  /* Activity */
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.7"
    >

      <path d="M4 12h3l2-7 4 14 2-7h5" />

    </svg>
  );
}