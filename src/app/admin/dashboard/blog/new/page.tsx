import Link from "next/link";
import { createBlogPost } from "@/app/admin/actions";

export default function NewBlogPostPage() {
  return (
    <div className="max-w-3xl">
      <Link href="/admin/dashboard/blog" className="text-sm font-medium text-emerald-700 hover:underline">
        ← Back to blog
      </Link>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">New article</h1>
      <form action={createBlogPost} className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="text-xs font-medium text-slate-600">Title</label>
          <input name="title" required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Slug (URL)</label>
          <input
            name="slug"
            required
            placeholder="verify-legitimate-offer"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Excerpt (optional)</label>
          <textarea name="excerpt" rows={2} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Body (Markdown)</label>
          <textarea name="content" required rows={14} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-slate-600">Meta title (optional)</label>
            <input name="metaTitle" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Meta description (optional)</label>
            <input name="metaDescription" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Status</label>
          <select name="status" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2">
            <option value="DRAFT">DRAFT</option>
            <option value="PUBLISHED">PUBLISHED</option>
          </select>
        </div>
        <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
          Save post
        </button>
      </form>
    </div>
  );
}
