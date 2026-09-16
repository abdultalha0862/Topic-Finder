import { NavLink } from "react-router-dom";
import {
  Search,
  Shield,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";
import { cn } from "@/lib/utils";
import { useRequests } from "@/context/RequestsContext";

interface NavItem {
  to: string;
  label: string;
  icon: ComponentType<LucideProps>;
  end?: boolean;
}

const MAIN_NAV: NavItem[] = [
  { to: "/topics/check", label: "Topic Finder", icon: Search },
];

function NavRow({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )
      }
    >
      <Icon className="size-4" />
      {item.label}
    </NavLink>
  );
}

export function Sidebar() {
  const { currentUserName } = useRequests();
  const initials = currentUserName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-background">
      <div className="flex items-center gap-2.5 px-5 py-4">
        <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Search className="size-4" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold">Topic Finder</div>
          <div className="text-xs text-muted-foreground">Creator Program</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        <p className="px-3 pb-1 pt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
          Workspace
        </p>
        {MAIN_NAV.map((item) => (
          <NavRow key={item.to} item={item} />
        ))}

        <p className="px-3 pb-1 pt-5 text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
          Team
        </p>
        <NavRow item={{ to: "/admin/topics", label: "Admin View", icon: Shield }} />
      </nav>

      <div className="space-y-1 px-3 py-3">
        <div className="mt-1 flex items-center gap-3 rounded-md px-3 py-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
            {initials}
          </div>
          <div className="min-w-0 leading-tight">
            <div className="truncate text-sm font-medium">{currentUserName}</div>
            <div className="truncate text-xs text-muted-foreground">Creator</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
