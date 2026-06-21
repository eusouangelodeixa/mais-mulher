import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Rotas que exigem sessão.
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

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
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
