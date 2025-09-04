"use client";

import { cn } from "@/lib/utils";
import { HistoryItem } from "@/types/recentRequest";
import Image from "next/image";

type Row = {
  id: string;
  thumb: string;
  location: string;
  status: "Pending" | "Matched" | "Completed" | "Cancelled";
};

type Props = {
  request?: HistoryItem[];
};

const STATUS_MAP: Record<string, Row["status"]> = {
  completed: "Completed",
  matched: "Matched",
  cancelled: "Cancelled",
  pending: "Pending",
};

function toRowStatus(apiStatus?: string): Row["status"] {
  return STATUS_MAP[apiStatus?.toLowerCase() || "pending"] ?? "Pending";
}

export default function RequestsTable({ request }: Props) {
  const rows: Row[] =
    request?.map((h) => ({
      id: h.id,
      thumb: h.problem?.imageUrl || "/placeholder.png",
      location: h.problem?.location || "—",
      status: toRowStatus(h.status),
    })) ?? [];

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50">
          <tr className="text-slate-700">
            <th className="px-4 py-3 font-semibold text-center">Request ID</th>
            <th className="px-4 py-3 font-semibold text-center">Photo</th>
            <th className="px-4 py-3 font-semibold text-center">Location</th>
            <th className="px-4 py-3 font-semibold text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                No history found.
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.id} className="border-t border-slate-200">
                <td className="px-4 py-3 text-center">{r.id.slice(0, 15)}</td>
                <td className="px-4 py-3">
                  <div className="h-10 w-16 overflow-hidden mx-auto rounded-md border border-slate-200 bg-slate-100">
                    <Image
                      src={r.thumb}
                      alt="Request thumbnail"
                      width={64}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 text-center">{r.location}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border border-slate-200 px-2.5 py-0.5 text-xs",
                      r.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : r.status === "Matched"
                        ? "bg-blue-100 text-blue-800"
                        : r.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    )}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
