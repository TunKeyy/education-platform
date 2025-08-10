import apiClient from './auth';
import { 
  Post, 
  Comment, 
  PaginatedResponse, 
  CreatePostRequest, 
  UpdatePostRequest, 
  CreateCommentRequest,
  VoteRequest,
  Vote
} from '../types';

// Posts API
export const postsAPI = {
  // Get posts with filters
  getPosts: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    tag?: string;
    level?: string;
    skills?: string;
    sort?: 'hot' | 'new' | 'top';
  }): Promise<PaginatedResponse<Post>> => {
    const response = await apiClient.get('/v1/posts', { params });
    return response.data;
  },

  // Get feed (personalized posts)
  getFeed: async (params: {
    page?: number;
    limit?: number;
    level?: string;
    skills?: string;
  }): Promise<PaginatedResponse<Post>> => {
    const response = await apiClient.get('/v1/posts', { params });
    return response.data;
  },

  // Get single post
  getPost: async (id: string): Promise<Post> => {
    const response = await apiClient.get(`/v1/posts/${id}`);
    return response.data;
  },

  // Create post
  createPost: async (data: CreatePostRequest): Promise<Post> => {
    const response = await apiClient.post('/v1/posts', data);
    return response.data;
  },

  // Update post
  updatePost: async (id: string, data: UpdatePostRequest): Promise<Post> => {
    const response = await apiClient.patch(`/v1/posts/${id}`, data);
    return response.data;
  },

  // Delete post
  deletePost: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/posts/${id}`);
  },

  // Publish post
  publishPost: async (id: string): Promise<Post> => {
    const response = await apiClient.post(`/v1/posts/${id}/publish`);
    return response.data;
  },

  // Get posts by user - This endpoint doesn't exist in backend, removing it
  // getPostsByUser: async (userId: string): Promise<Post[]> => {
  //   const response = await apiClient.get(`/v1/posts/user/${userId}`);
  //   return response.data;
  // },
};

// Comments API
export const commentsAPI = {
  // Get comments for post
  getComments: async (postId: string, params: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Comment>> => {
    const response = await apiClient.get(`/v1/comments`, { 
      params: { postId, ...params }
    });
    return response.data;
  },

  // Create comment
  createComment: async (data: CreateCommentRequest): Promise<Comment> => {
    const response = await apiClient.post('/v1/comments', data);
    return response.data;
  },

  // Update comment
  updateComment: async (id: string, content: string): Promise<Comment> => {
    const response = await apiClient.patch(`/v1/comments/${id}`, { content });
    return response.data;
  },

  // Delete comment
  deleteComment: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/comments/${id}`);
  },
};

// Votes API
export const votesAPI = {
  // Vote on post or comment
  vote: async (data: VoteRequest): Promise<Vote> => {
    const response = await apiClient.post('/v1/votes', data);
    return response.data;
  },

  // Remove vote
  removeVote: async (targetId: string, targetType: 'post' | 'comment'): Promise<void> => {
    await apiClient.delete(`/v1/votes/${targetType}/${targetId}`);
  },

  // Get vote counts
  getVoteCounts: async (targetId: string, targetType: 'post' | 'comment'): Promise<{
    upvotes: number;
    downvotes: number;
    userVote?: 'upvote' | 'downvote';
  }> => {
    const response = await apiClient.get(`/v1/votes/stats/${targetType}/${targetId}`);
    return response.data;
  },

  // Get user votes
  getUserVotes: async (targetId: string, targetType: 'post' | 'comment'): Promise<Vote> => {
    const response = await apiClient.get(`/v1/votes/user/${targetType}/${targetId}`);
    return response.data;
  },
};
