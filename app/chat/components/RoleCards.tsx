"use client";

import { JOB_ROLES } from "@/lib/constants";

type RoleCardsProps = {
  onSubmit: (role: string) => void;
};

export default function RoleCards({
  onSubmit,
}: RoleCardsProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {JOB_ROLES.map((role) => (
        <button
          key={role.id}
          type="button"
          onClick={() => onSubmit(role.label)}
          className="group flex flex-col items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/60 px-4 py-4 text-center transition hover:border-violet-500 hover:bg-violet-600/10"
        >
          <span className="text-2xl">{role.icon}</span>
          <span className="text-xs font-medium text-zinc-200 group-hover:text-violet-200">
            {role.label}
          </span>
        </button>
      ))}
    </div>
  );
}
