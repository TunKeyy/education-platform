import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, TrendingUp } from 'lucide-react';
import { usePosts } from '../hooks/useApi';
import { Post } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const FeedPage: React.FC = () => {
  const { data: posts, isLoading, error } = usePosts();
  const [filter, setFilter] = useState<'all' | 'following' | 'trending'>('all');

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-neutral-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-neutral-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-neutral-200 rounded w-1/6"></div>
                </div>
              </div>
              <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <div className="text-red-500 mb-4">Error loading posts</div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </Card>
    );
  }

  const filterButtons = [
    { key: 'all', label: 'All Posts', icon: null },
    { key: 'following', label: 'Following', icon: null },
    { key: 'trending', label: 'Trending', icon: TrendingUp }
  ] as const;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">
          Your Feed
        </h1>
        <p className="text-neutral-600">
          Discover and engage with the English learning community
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex space-x-1 mb-8 bg-white/60 backdrop-blur-lg rounded-lg p-1 border border-white/20"
      >
        {filterButtons.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
              filter === tab.key
                ? 'bg-primary-100 text-primary-700 shadow-sm'
                : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'
            }`}
          >
            {tab.icon && <tab.icon className="w-4 h-4 mr-2" />}
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Posts */}
      <div className="space-y-6">
        {posts?.data?.map((post: Post, index: number) => (
          <PostCard key={post.id} post={post} index={index} />
        ))}
      </div>

      {/* Load More */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-center"
      >
        <Button variant="outline">Load More Posts</Button>
      </motion.div>
    </div>
  );
};

interface PostCardProps {
  post: Post;
  index: number;
}

const PostCard: React.FC<PostCardProps> = ({ post, index }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="p-6 hover:shadow-lg transition-shadow">
        {/* Post Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={post.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}&background=random`}
              alt={post.author.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-medium text-neutral-800">{post.author.name}</h3>
              <p className="text-sm text-neutral-500">
                {post.author.profile?.level?.name || 'Student'} • {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
            <MoreHorizontal className="w-4 h-4 text-neutral-500" />
          </button>
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-neutral-800 mb-2">
            {post.title}
          </h2>
          <p className="text-neutral-600 line-clamp-3">
            {post.content}
          </p>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Post Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
          <div className="flex items-center space-x-6">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center space-x-2 transition-colors ${
                isLiked ? 'text-red-500' : 'text-neutral-500 hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{post.upvotes || 0}</span>
            </motion.button>

            <button className="flex items-center space-x-2 text-neutral-500 hover:text-primary-600 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">{post._count?.comments || 0}</span>
            </button>

            <button className="flex items-center space-x-2 text-neutral-500 hover:text-blue-600 transition-colors">
              <Share className="w-5 h-5" />
              <span className="text-sm">Share</span>
            </button>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2 rounded-full transition-colors ${
              isBookmarked 
                ? 'text-accent-600 bg-accent-100' 
                : 'text-neutral-500 hover:text-accent-600 hover:bg-accent-50'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
          </motion.button>
        </div>
      </Card>
    </motion.div>
  );
};

export default FeedPage;
