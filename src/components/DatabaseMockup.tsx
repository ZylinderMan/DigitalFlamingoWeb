"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface TableDef {
  key: string;
  name: string;
  columns: string[];
  rows: (string | number)[][];
}

const TABLE_DOT_COLORS: Record<string, string> = {
  users: "var(--palette-pink-deep)",
  orders: "var(--palette-blue-deep)",
  payments: "var(--palette-green-deep)",
};

const TABLES: TableDef[] = [
  {
    key: "users",
    name: "users",
    columns: ["id", "name", "email"],
    rows: [
      [1, "Alice", "alice@acme.com"],
      [2, "Ben", "ben@acme.com"],
      [3, "Carla", "carla@acme.com"],
    ],
  },
  {
    key: "orders",
    name: "orders",
    columns: ["id", "user_id", "total"],
    rows: [
      [101, 1, "$42.00"],
      [102, 2, "$18.50"],
      [103, 1, "$76.20"],
    ],
  },
  {
    key: "payments",
    name: "payments",
    columns: ["id", "order_id", "status"],
    rows: [
      [9001, 101, "paid"],
      [9002, 102, "paid"],
      [9003, 103, "pending"],
    ],
  },
];

export default function DatabaseMockup() {
  const { t } = useLanguage();
  const [selectedKey, setSelectedKey] = useState(TABLES[0].key);
  const table = TABLES.find((tb) => tb.key === selectedKey)!;

  return (
    <div className="flex h-full text-xs">
      <div className="w-28 shrink-0 border-r border-[var(--border)] bg-[var(--panel-alt)] py-3 px-2">
        <p className="text-[10px] uppercase tracking-wide text-[var(--muted-strong)] px-1 mb-2">
          {t.showcase.database.sidebarTitle}
        </p>
        <div className="text-[var(--muted)] px-1 mb-1">📁 client_db</div>
        <div className="pl-3 flex flex-col gap-0.5">
          {TABLES.map((tb) => {
            const active = tb.key === selectedKey;
            return (
              <button
                key={tb.key}
                onClick={() => setSelectedKey(tb.key)}
                className={`flex items-center gap-2 text-left px-2 py-1 rounded transition-colors ${
                  active
                    ? "bg-[var(--accent)] text-[var(--accent-contrast)] shadow-[0_0_8px_var(--glow)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: active ? "currentColor" : TABLE_DOT_COLORS[tb.key] }}
                />
                {tb.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)]">
          <span className="text-[var(--muted)] truncate">SELECT * FROM {table.name};</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--palette-green-soft)] text-[var(--palette-green-text)]">
            {t.showcase.database.queryStatus}
          </span>
        </div>

        <div className="flex-1 overflow-hidden px-3 py-2">
          <AnimatePresence mode="wait">
            <motion.table
              key={table.key}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="w-full border-collapse"
            >
              <thead>
                <tr>
                  {table.columns.map((col) => (
                    <th key={col} className="text-left text-[var(--muted)] font-medium border-b border-[var(--border)] pb-1 pr-3">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, i) => (
                  <tr key={i} className="border-b border-[var(--border)]">
                    {row.map((cell, j) => (
                      <td key={j} className="text-[var(--foreground)] py-1 pr-3 whitespace-nowrap">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </motion.table>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}