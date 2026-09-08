import React, { useState } from "react";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal, 
  Image as ImageIcon, 
  Send 
} from "lucide-react";

const Home = ({ posts = [], onLike, onComment, currentUser }) => {
  const [commentInputs, setCommentInputs] = useState({});

  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const handleCommentSubmit = (e, postId) => {
    e.preventDefault();
    const text = commentInputs[postId];
    if (text && text.trim()) {
      onComment(postId, text);
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
      {/* Create Post Banner / Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
          {currentUser?.name?.[0] || "U"}
        </div>
        <input
          type="text"
          placeholder="Share your latest shots or creative thoughts..."
          className="w-full bg-gray-50 border-none rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
          readOnly
        />
        <button className="p-2 text-gray-500 hover:text-indigo-600 transition">
          <ImageIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Feed Posts */}
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
          <p className="text-gray-500 font-medium">No posts in your feed yet.</p>
        </div>
      ) : (
        posts.map((post) => {
          const isLiked = post.likes?.includes(currentUser?._id);

          return (
            <article 
              key={post._id || post.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={post.photographer?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                    alt={post.photographer?.name || "User"}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-50"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                      {post.photographer?.name || "Anonymous Creator"}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Just now"}
                    </p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 p-1">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Post Image */}
              {post.imageUrl && (
                <div className="relative aspect-square sm:aspect-[4/3] bg-gray-100 overflow-hidden">
                  <img
                    src={post.imageUrl}
                    alt="Post visual"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => onLike(post._id)}
                      className={`flex items-center space-x-1.5 text-sm transition-colors ${
                        isLiked ? "text-rose-500 font-medium" : "text-gray-600 hover:text-rose-500"
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                      <span>{post.likes?.length || 0}</span>
                    </button>
                    <button className="flex items-center space-x-1.5 text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span>{post.comments?.length || 0}</span>
                    </button>
                    <button className="text-gray-600 hover:text-indigo-600 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>

                {/* Caption */}
                {post.caption && (
                  <p className="text-sm text-gray-800 leading-relaxed">
                    <span className="font-semibold text-gray-900 mr-2">
                      {post.photographer?.name || "Creator"}
                    </span>
                    {post.caption}
                  </p>
                )}

                {/* Comments List */}
                {post.comments && post.comments.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-gray-50">
                    {post.comments.slice(-2).map((comment, index) => (
                      <p key={index} className="text-xs text-gray-600">
                        <span className="font-semibold text-gray-800 mr-1.5">
                          {comment.user?.name || "User"}
                        </span>
                        {comment.text}
                      </p>
                    ))}
                  </div>
                )}

                {/* Comment Input Form */}
                <form 
                  onSubmit={(e) => handleCommentSubmit(e, post._id)} 
                  className="flex items-center space-x-2 pt-2"
                >
                  <input
                    type="text"
                    value={commentInputs[post._id] || ""}
                    onChange={(e) => handleCommentChange(post._id, e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-full px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition"
                  />
                  <button
                    type="submit"
                    disabled={!commentInputs[post._id]?.trim()}
                    className="text-indigo-600 hover:text-indigo-700 disabled:opacity-40 p-1 transition"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </article>
          );
        })
      )}
    </div>
  );
};

export default Home;