import { useQuery } from '@apollo/client/react';
import { GET_POSTS } from '../../graphql/queries';
import { Link } from 'react-router-dom';
import { FileText, Calendar, User, MessageCircle } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  commentsCount: number;
}

export default function PostList() {
  const { data, loading } = useQuery(GET_POSTS, {
    variables: { limit: 50, offset: 0 },
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Blog Posts</h1>
          <p className="text-slate-600">Explore articles from our community</p>
        </div>

        <div className="space-y-6">
          {data?.posts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No posts yet</h3>
              <p className="text-slate-600">Be the first to create a post!</p>
            </div>
          ) : (
            data?.posts.map((post: Post) => (
              <Link
                key={post.id}
                to={`/posts/${post.id}`}
                className="block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition">
                    {post.title}
                  </h2>

                  {post.excerpt && (
                    <p className="text-slate-600 mb-4 line-clamp-2">{post.excerpt}</p>
                  )}

                  <div className="flex items-center gap-6 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{post.author.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.commentsCount} comments</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
