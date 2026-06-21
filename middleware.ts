import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Rotas que exigem sessão de usuária.
const PROTECTED = [
  "/dashboard",
  "/registrar",
  "/historico",
  "/conteudo",
  "/configuracoes",
  "/assinatura",
  "/onboarding",
];

// Rotas de autenticação (não acessíveis quando já logada).
const AUTH_PAGES = ["/login", "/cadastro", "/recuperar"];

const ADMIN_LOGIN = "/admin/login";

function secretKey(): Uint8Array {
  return new TextEncoder().encode(process.env.AUTH_SECRET ?? "");
}

async function hasValidSession(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("session")?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, secretKey());
    return true;
  } catch {
    return false;
  }
}

async function isAdmin(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Painel admin (sessão própria) ──
  if (pathname.startsWith("/admin")) {
    const admin = await isAdmin(req);
    const isLogin =
      pathname === ADMIN_LOGIN || pathname.startsWith(ADMIN_LOGIN + "/");
    if (!admin && !isLogin) {
      const url = req.nextUrl.clone();
      url.pathname = ADMIN_LOGIN;
      return NextResponse.redirect(url);
    }
    if (admin && isLogin) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // ── App de usuária ──
  const loggedIn = await hasValidSession(req);

  const isProtected = PROTECTED.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
  const isAuthPage = AUTH_PAGES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );

  if (isProtected && !loggedIn) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (isAuthPage && loggedIn) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Aplica a todas as rotas, exceto assets estáticos e APIs.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
