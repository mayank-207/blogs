import { useQuery, useMutation } from '@apollo/client/react';
import { GET_MY_POSTS } from '../../graphql/queries';
import { DELETE_POST } from '../../graphql/mutations';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Edit2, Trash2, Plus, Calendar, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Post {
  id: string;
  title: string;
  excerpt?: string;
  published: boolean;
  createdAt: string;
  commentsCount: number;
}

export default function MyPosts() {
  const navigate = useNavigate();
  const { data, loading, refetch } = useQuery(GET_MY_POSTS);
  const [deletePost] = useMutation(DELETE_POST);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost({ variables: { id } });
        toast.success('Post deleted successfully');
        refetch();
      } catch (error) {
        toast.error('Failed to delete post');
      }
    }
  };

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">My Posts</h1>
            <p className="text-slate-600">Manage your blog posts</p>
          </div>

          <Link
            to="/posts/new"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition"
          >
            <Plus className="w-5 h-5" />
            <span>New Post</span>
          </Link>
        </div>

        <div className="space-y-4">
          {data?.myPosts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No posts yet</h3>
              <p className="text-slate-600 mb-6">Start sharing your thoughts with the community</p>
              <Link
                to="/posts/new"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition"
              >
                <Plus className="w-5 h-5" />
                <span>Create Your First Post</span>
              </Link>
            </div>
          ) : (
            data?.myPosts.map((post: Post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Link
                          to={`/posts/${post.id}`}
                          className="text-xl font-bold text-slate-900 hover:text-blue-600 transition"
                        >
                          {post.title}
                        </Link>
                        {!post.published && (
                          <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                            Draft
                          </span>
                        )}
                      </div>

                      {post.excerpt && (
                        <p className="text-slate-600 text-sm line-clamp-2">{post.excerpt}</p>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => navigate(`/posts/${post.id}/edit`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-slate-500">
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
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
