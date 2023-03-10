import React from "react";
import type { ActionFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { verifyLogin } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { validateEmail } from "~/utils";

export const meta: MetaFunction = () => ({
  title: "Login",
});

interface ActionData {
  errors: {
    email?: string;
    password?: string;
  };
}

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = formData.get("redirectTo");
  const remember = formData.get("remember");

  if (!validateEmail(email)) {
    return json({ errors: { email: "Email is invalid." } }, { status: 400 });
  }

  if (typeof password !== "string") {
    return json(
      { errors: { password: "Valid password is required." } },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return json(
      { errors: { password: "Password is too short" } },
      { status: 400 }
    );
  }

  const user = await verifyLogin(email, password);

  if (!user) {
    return json(
      { errors: { email: "Invalid email or password" } },
      { status: 400 }
    );
  }

  return createUserSession({
    request,
    userId: user.id,
    remember: remember === "on" ? true : false,
    redirectTo: typeof redirectTo === "string" ? redirectTo : "/",
  });
};

export default function Login() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/";

  const actionData = useActionData() as ActionData;
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef?.current?.focus();
    }

    if (actionData?.errors?.password) {
      passwordRef?.current?.focus();
    }
  }, [actionData]);

  return (
    <div>
      <div>
        <Form method="post" noValidate>
          <div>
            <label htmlFor="email">
              <p className="form-label">Email Address</p>
              {actionData?.errors?.email && (
                <p className="form-error" id="email-error">
                  {actionData?.errors?.email}
                </p>
              )}
            </label>
            <input
              autoComplete="email"
              type="email"
              name="email"
              id="email"
              aria-invalid={actionData?.errors?.email ? true : undefined}
              aria-describedby="email-error"
              ref={emailRef}
            />
          </div>
          <div>
            <label htmlFor="password">
              <p className="form-label">Password</p>
              <p className="form-hint">Must have at least 6 characters.</p>
              {actionData?.errors?.password && (
                <p className="form-error" id="password-error">
                  {actionData?.errors?.password}
                </p>
              )}
            </label>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete=""
              aria-invalid={actionData?.errors?.password ? true : undefined}
              aria-describedby="password-error"
              ref={passwordRef}
            />
          </div>
          <button type="submit" style={{ margin: "1rem 0 0.5rem" }}>
            Log in
          </button>
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <div>
            <div>
              <input id="remember" name="remember" type="checkbox" />{" "}
              <label htmlFor="remember">Remember me</label>
            </div>
            <p>
              Don't have an account?{" "}
              <Link to={{ pathname: "/join" }}>Sign up</Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
}
