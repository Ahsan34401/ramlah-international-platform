import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { publishedBlogWhere } from "@/lib/blog-public";

export const metadata: Metadata = {
  title: "Blog | Ramlah International",
  description: "Guidance on overseas employment, compliance, and avoiding recruitment fraud.",
};

export default async function BlogIndexPage() {
  const posts = await prisma.blogPost.findMany({
    where: publishedBlogWhere(),
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
      <p className="mt-2 text-slate-600">
        Practical notes for job seekers and employers — licensing, safety, and how we work.
      </p>
      <ul className="mt-10 space-y-6">
        {posts.map((p) => (
          <li key={p.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <Link href={`/blog/${p.slug}`} className="text-xl font-bold text-slate-900 hover:text-emerald-800">
              {p.title}
            </Link>
            {p.excerpt ? <p className="mt-2 text-sm text-slate-600">{p.excerpt}</p> : null}
            {p.publishedAt ? (
              <p className="mt-3 text-xs text-slate-400">{p.publishedAt.toISOString().slice(0, 10)}</p>
            ) : null}
          </li>
        ))}
      </ul>
      {posts.length === 0 ? <p className="mt-12 text-center text-slate-500">No articles yet — check back soon.</p> : null}
    </div>
  );
}
