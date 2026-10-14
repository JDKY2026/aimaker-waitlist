"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success"; position: number; total: number; alreadyJoined: boolean }
  | { state: "error"; message: string };

export default function JoinForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ state: "idle" });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.state === "submitting") return;
    setStatus({ state: "submitting" });
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus({
          state: "error",
          message: data.message ?? "出了点问题,请稍后再试。",
        });
      } else {
        setStatus({
          state: "success",
          position: data.position,
          total: data.total,
          alreadyJoined: data.alreadyJoined,
        });
      }
    } catch {
      setStatus({
        state: "error",
        message: "网络异常,请检查网络连接后重试。",
      });
    }
  }

  if (status.state === "success") {
    return (
      <Card className="animate-fade-up border-emerald-200 bg-emerald-50 text-left shadow-sm">
        <CardContent className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 shadow-sm">
            <CheckIcon className="h-4 w-4 text-white" />
          </span>
          <div>
            <p className="text-sm font-semibold text-emerald-700">
              提交成功,感谢加入!
            </p>
            <p className="mt-1 text-sm leading-relaxed text-emerald-900/70">
              {status.alreadyJoined
                ? "你之前已经加入过 — "
                : "你的邮箱已安全保存。"}
              当前排在第{" "}
              <span className="font-semibold text-emerald-800">
                {status.position}
              </span>{" "}
              位(共 {status.total} 人),轮到你时我们会邮件通知你。
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <Card className="shadow-sm shadow-indigo-950/5">
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="输入你的邮箱地址"
              aria-label="邮箱地址"
              className="h-11 text-sm"
            />
            <Button
              type="submit"
              disabled={status.state === "submitting"}
              className="h-11 w-full text-sm font-medium"
            >
              {status.state === "submitting" ? "提交中…" : "加入等待列表"}
            </Button>
          </form>
        </CardContent>
      </Card>
      {status.state === "error" && (
        <p className="mt-2 text-sm text-red-600">{status.message}</p>
      )}
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}
