import type { MetaFunction } from "@remix-run/node";
import { Form, json, useLoaderData } from "@remix-run/react";
import { Link } from "@remix-run/react";
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
      <div>
      <h1>Welcome to My Remix App</h1>
      <Link to="/camera">Go to Camera</Link>
    </div>
    </div>
  );
}
