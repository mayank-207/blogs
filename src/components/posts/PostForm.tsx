import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client/react';
import { CREATE_POST, UPDATE_POST } from '../../graphql/mutations';
import { GET_POST, GET_MY_POSTS } from '../../graphql/queries';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PostForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(false);

  const { data: postData } = useQuery(GET_POST, {
    variables: { id },
    skip: !isEditing,
    onCompleted: (data) => {
      if (data.post) {
        setTitle(data.post.title);
        setContent(data.post.content);
        setExcerpt(data.post.excerpt || '');
        setPublished(data.post.published);
      }
    },
  });

  const [createPost] = useMutation(CREATE_POST, {
    refetchQueries: [{ query: GET_MY_POSTS }],
  });

  const [updatePost] = useMutation(UPDATE_POST);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        await updatePost({
          variables: {
            id,
            title,
            content,
            excerpt: excerpt || null,
            published,
          },
        });
        toast.success('Post updated successfully');
      } else {
        const { data } = await createPost({
          variables: {
            title,
            content,
            excerpt: excerpt || null,
            published,
          },
        });
        toast.success('Post created successfully');
        navigate(`/posts/${data.createPost.id}`);
        return;
      }

      navigate(`/posts/${id}`);
    } catch (error) {
      toast.error(isEditing ? 'Failed to update post' : 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-600 p-3 rounded-xl">
              <Save className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {isEditing ? 'Edit Post' : 'Create New Post'}
              </h1>
              <p className="text-slate-600 text-sm">
                {isEditing ? 'Update your blog post' : 'Share your thoughts with the community'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enter post title"
              />
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-slate-700 mb-2">
                Excerpt (Optional)
              </label>
              <input
                id="excerpt"
                type="text"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Brief summary of your post"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-2">
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={12}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                placeholder="Write your post content here..."
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                id="published"
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="published" className="text-sm font-medium text-slate-700">
                Publish immediately
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border-2 border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
