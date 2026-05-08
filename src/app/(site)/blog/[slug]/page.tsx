import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { prisma } from "@/lib/prisma";
import { publishedBlogWhere } from "@/lib/blog-public";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findFirst({
    where: { slug, ...publishedBlogWhere() },
  });
  if (!post) {
    return { title: "Article" };
  }
  return {
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt ?? undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.blogPost.findFirst({
    where: { slug, ...publishedBlogWhere() },
  });
  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/blog" className="text-sm font-semibold text-emerald-700 hover:underline">
        ← All articles
      </Link>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">{post.title}</h1>
      {post.publishedAt ? (
        <p className="mt-2 text-sm text-slate-500">{post.publishedAt.toISOString().slice(0, 10)}</p>
      ) : null}
      {post.excerpt ? <p className="mt-6 text-lg text-slate-600">{post.excerpt}</p> : null}
      <div
        className="mt-10 space-y-4 text-slate-700 [&_a]:font-medium [&_a]:text-emerald-700 [&_a]:underline [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:mt-1 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:leading-relaxed [&_strong]:text-slate-900 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6"
      >
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}
