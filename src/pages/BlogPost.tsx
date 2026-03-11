import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Calendar, ArrowLeft, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Markdown from 'react-markdown';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  created_at: string;
  author_id: string;
}

export function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${slug}`);
        if (!response.ok) {
          if (response.status === 404) throw new Error('Post not found');
          throw new Error('Failed to fetch post');
        }
        const data = await response.json();
        setPost(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {post && (
        <Helmet>
          <title>{post.title} | Arosoft Innovations</title>
          <meta name="description" content={post.excerpt || `Read ${post.title} on Arosoft Innovations blog.`} />
        </Helmet>
      )}
      
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center">
              <p>{error}</p>
            </div>
          ) : post ? (
            <article className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-8 sm:p-12">
                <header className="mb-10 text-center">
                  <div className="flex items-center justify-center gap-4 text-sm text-slate-500 mb-6">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
                    {post.title}
                  </h1>
                </header>

                <div className="prose prose-slate prose-blue max-w-none">
                  <Markdown>{post.content}</Markdown>
                </div>
              </div>
            </article>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}
