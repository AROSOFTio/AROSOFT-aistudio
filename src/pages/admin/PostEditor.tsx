import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Loader2, Upload } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';
import 'tinymce/tinymce';
import 'tinymce/models/dom';
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/image';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/table';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/wordcount';
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/skins/content/default/content.min.css';

type EditorInstance = {
  insertContent: (html: string) => void;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function AdminPostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const editorRef = useRef<EditorInstance | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [status, setStatus] = useState('published');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditing);
  const [isUploadingAsset, setIsUploadingAsset] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      const fetchPost = async () => {
        try {
          const token = localStorage.getItem('adminToken');
          if (!token) {
            navigate('/login');
            return;
          }

          const response = await fetch(`/api/admin/posts/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('adminToken');
            navigate('/login');
            return;
          }

          if (!response.ok) throw new Error('Failed to fetch post');
          const post = await response.json();
          setTitle(post.title);
          setContent(post.content);
          setExcerpt(post.excerpt || '');
          setStatus(post.status);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsFetching(false);
        }
      };

      fetchPost();
    }
  }, [id, isEditing, navigate]);

  const uploadAsset = async (file: File, type: 'image' | 'file') => {
    setError('');
    setIsUploadingAsset(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const endpoint = type === 'image' ? '/api/admin/uploads/image' : '/api/admin/uploads/file';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('adminToken');
        navigate('/login');
        return;
      }

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      const safeUrl = String(data.url || '');
      const safeName = escapeHtml(String(data.fileName || file.name || 'attachment'));
      if (!safeUrl) {
        throw new Error('Upload did not return a file URL');
      }

      if (type === 'image') {
        editorRef.current?.insertContent(`<p><img src="${safeUrl}" alt="${safeName}" /></p>`);
      } else {
        editorRef.current?.insertContent(
          `<p><a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${safeName}</a></p>`
        );
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload asset');
    } finally {
      setIsUploadingAsset(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const normalizedContent = String(content || '').trim();
      if (!title.trim() || !normalizedContent) {
        throw new Error('Title and content are required');
      }

      const url = isEditing ? `/api/admin/posts/${id}` : '/api/admin/posts';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          content: normalizedContent,
          excerpt: excerpt.trim(),
          status,
        }),
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('adminToken');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save post');
      }

      navigate('/admin/posts');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) uploadAsset(file, 'image');
        }}
      />
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) uploadAsset(file, 'file');
        }}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/posts')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </button>
          <h2 className="text-2xl font-bold text-slate-900">
            {isEditing ? 'Edit Post' : 'New Post'}
          </h2>
        </div>
        <button
          onClick={() => void handleSubmit()}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Post
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}

      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
      >
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Post title"
            />
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-slate-700 mb-1">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief summary of the post"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-1">
              Content Editor
            </label>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={isUploadingAsset}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-60"
              >
                {isUploadingAsset ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Upload Image
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAsset}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-60"
              >
                {isUploadingAsset ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Attach File
              </button>
              <span className="text-xs text-slate-500">
                Supports rich formatting, HTML, embeds, media, tables, and code blocks.
              </span>
            </div>
            <Editor
              value={content}
              onInit={(_event, editor) => {
                editorRef.current = editor as unknown as EditorInstance;
              }}
              onEditorChange={(newValue) => setContent(newValue)}
              init={{
                height: 560,
                menubar: true,
                plugins:
                  'anchor autolink charmap code codesample fullscreen image insertdatetime link lists media preview searchreplace table visualblocks wordcount',
                toolbar:
                  'undo redo | blocks | bold italic underline strikethrough forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media table blockquote | codesample code fullscreen | removeformat',
                branding: false,
                automatic_uploads: false,
                convert_urls: false,
                link_default_target: '_blank',
                content_style:
                  'body { font-family: Inter, Arial, sans-serif; font-size: 16px; line-height: 1.6; } pre { background: #0f172a; color: #e2e8f0; padding: 12px; border-radius: 8px; }',
              }}
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  );
}
