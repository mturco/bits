import React from "react";
import type { ActionFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { verifyLogin } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { validateEmail } from "~/utils";
import { FormField } from "~/components/FormField";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { Link } from "~/components/Link";
import { Checkbox } from "~/components/Checkbox";

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
    <div className="flex h-full items-center justify-center">
      <Form method="post" noValidate className="flex w-64 flex-col gap-6">
        <FormField error={actionData?.errors?.email} label="Email Address">
          <Input
            autoComplete="email"
            type="email"
            name="email"
            aria-invalid={actionData?.errors?.email ? true : undefined}
            aria-describedby="email-error"
            ref={emailRef}
          />
        </FormField>
        <FormField error={actionData?.errors?.password} label="Password">
          <Input
            type="password"
            name="password"
            autoComplete=""
            aria-invalid={actionData?.errors?.password ? true : undefined}
            aria-describedby="password-error"
            ref={passwordRef}
          />
        </FormField>

        <div>
          <Checkbox name="remember" label="Remember me" />

          <Button type="submit" className="mt-2">
            Log in
          </Button>
        </div>

        <input type="hidden" name="redirectTo" value={redirectTo} />
        <p>
          Don't have an account?{" "}
          <Link to="/join" className="hover:underline">
            Sign up
          </Link>
        </p>
      </Form>
    </div>
  );
}
