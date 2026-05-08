"use client";

import { deleteJob } from "@/app/admin/actions";

type Props = { id: string };

export function DeleteJobButton({ id }: Props) {
  return (
    <form
      action={async (fd) => {
        if (!confirm("Delete this job permanently?")) {
          return;
        }
        await deleteJob(fd);
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-xs font-semibold text-red-600 hover:underline">
        Delete
      </button>
    </form>
  );
}
