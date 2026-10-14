import { NextResponse } from "next/server";
import { ensureSchema, pool } from "@/lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let email: string;
  try {
    const body = await request.json();
    email = String(body?.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json(
      { ok: false, message: "请求格式有误。" },
      { status: 400 }
    );
  }

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json(
      { ok: false, message: "请输入有效的邮箱地址。" },
      { status: 400 }
    );
  }

  try {
    await ensureSchema();

    let alreadyJoined = false;
    try {
      await pool.query("INSERT INTO waitlist (email) VALUES ($1)", [email]);
    } catch (err) {
      if ((err as { code?: string }).code !== "23505") throw err;
      alreadyJoined = true;
    }

    const { rows } = await pool.query<{
      position: number;
      total: number;
    }>(
      `SELECT
         (SELECT count(*) FROM waitlist earlier WHERE earlier.id <= me.id)::int AS position,
         (SELECT count(*) FROM waitlist)::int AS total
       FROM waitlist me
       WHERE me.email = $1`,
      [email]
    );

    return NextResponse.json({
      ok: true,
      alreadyJoined,
      position: rows[0].position,
      total: rows[0].total,
    });
  } catch (err) {
    console.error("[waitlist] database error:", err);
    return NextResponse.json(
      { ok: false, message: "服务暂时不可用,请稍后再试。" },
      { status: 503 }
    );
  }
}
