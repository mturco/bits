import type { ActionFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { createUserSession, getUserId } from "~/session.server";
import { createUser, getProfileByEmail } from "~/models/user.server";
import { validateEmail } from "~/utils";
import * as React from "react";

export const meta: MetaFunction = () => {
  return {
    title: "Sign Up",
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

  // Ensure the email is valid
  if (!validateEmail(email)) {
    return json<ActionData>(
      { errors: { email: "Email is invalid." } },
      { status: 400 }
    );
  }

  // What if a user sends us a password through other means than our form?
  if (typeof password !== "string") {
    return json(
      { errors: { password: "Valid password is required." } },
      { status: 400 }
    );
  }

  // Enforce minimum password length
  if (password.length < 6) {
    return json<ActionData>(
      { errors: { password: "Password is too short." } },
      { status: 400 }
    );
  }

  // A user could potentially already exist within our system
  // and we should communicate that well
  const existingUser = await getProfileByEmail(email);
  if (existingUser) {
    return json<ActionData>(
      { errors: { email: "A user already exists with this email." } },
      { status: 400 }
    );
  }

  const user = await createUser(email, password);
  if (!user) return null;

  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo: typeof redirectTo === "string" ? redirectTo : "/",
  });
};

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;

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
              type="email"
              name="email"
              id="email"
              required
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
                <p className="form-error">{actionData?.errors?.password}</p>
              )}
            </label>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete="new-password"
              aria-invalid={actionData?.errors?.password ? true : undefined}
              aria-describedby="password-error"
              ref={passwordRef}
            />
          </div>
          <button type="submit" style={{ margin: "1rem 0 0.5rem" }}>
            Join
          </button>
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <div>
            <div>
              Already have an account?{" "}
              <Link
                to={{
                  pathname: "/login",
                  search: searchParams.toString(),
                }}
              >
                Log in
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
