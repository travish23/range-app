import type { MetaFunction } from "@remix-run/node";
import { Form, json, useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div>
      <h1>Welcome to Remix!</h1>
      <Form method="post">
        <label>
          <span>First Name</span>
          <input type="text" name="firstName" required />
        </label>
<br />
        <label>
          <span>Last Name</span>
          <input type="text" name="lastName" required />
        </label>
        <button type="submit">Submit</button>
        </Form>
    </div>
  );
}
