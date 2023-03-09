import React from "react";
import type { ActionFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { verifyLogin } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { validateEmail } from "~/utils";

export const meta: MetaFunction = () => {
  return {
    title: "Login",
  };
};

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
    redirectTo: typeof redirectTo === "string" ? redirectTo : "/notes",
  });
};

export default function Login() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/notes";

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
              <span>Email Address</span>
              {actionData?.errors?.email && (
                <span id="email-error">{actionData?.errors?.email}</span>
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
              <span>Password</span>
              <span>Must have at least 6 characters.</span>
              {actionData?.errors?.password && (
                <span id="password-error">{actionData?.errors?.password}</span>
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
          <button type="submit">Log in</button>
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <div>
            <div>
              <input id="remember" name="remember" type="checkbox" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <div>
              Don't have an account?{" "}
              <Link to={{ pathname: "/join" }}>Sign up</Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
