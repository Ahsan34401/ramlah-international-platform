import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateBlogPost } from "@/app/admin/actions";

type Props = { params: Promise<{ id: string }> };

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-3xl">
      <Link href="/admin/dashboard/blog" className="text-sm font-medium text-emerald-700 hover:underline">
        ← Back to blog
      </Link>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">Edit article</h1>
      <form action={updateBlogPost} className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <input type="hidden" name="id" value={post.id} />
        <div>
          <label className="text-xs font-medium text-slate-600">Title</label>
          <input name="title" required defaultValue={post.title} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Slug (URL)</label>
          <input
            name="slug"
            required
            defaultValue={post.slug}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Excerpt (optional)</label>
          <textarea name="excerpt" rows={2} defaultValue={post.excerpt ?? ""} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Body (Markdown)</label>
          <textarea name="content" required rows={14} defaultValue={post.content} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-slate-600">Meta title (optional)</label>
            <input name="metaTitle" defaultValue={post.metaTitle ?? ""} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Meta description (optional)</label>
            <input name="metaDescription" defaultValue={post.metaDescription ?? ""} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Status</label>
          <select name="status" defaultValue={post.status} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2">
            <option value="DRAFT">DRAFT</option>
            <option value="PUBLISHED">PUBLISHED</option>
          </select>
        </div>
        <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
          Update post
        </button>
      </form>
    </div>
  );
}
