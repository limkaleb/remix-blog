import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPostsListings } from "~/models/post.server";
import { useOptionalAdminUser } from "~/utils";

type LoaderData = {
  posts: Awaited<ReturnType<typeof getPostsListings>>
}

export const loader: LoaderFunction = async () => {
  const posts = await getPostsListings();
  return json<LoaderData >({ posts });
};

export default function Posts() {
  const { posts } = useLoaderData() as LoaderData;
  const user = useOptionalAdminUser()
  const isAdmin = user?.email === ENV.ADMIN_EMAIL

  return (
    <main>
      <h1>Posts</h1>
      {isAdmin ? <Link to="admin" className="text-red-600 underline">Admin</Link> : null}
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              to={post.slug}
              prefetch="intent"
              className="text-blue-600 underline"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}