import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../services/auth';
import { postsAPI, commentsAPI, votesAPI } from '../services/content';
import { taxonomyAPI, searchAPI, usersAPI } from '../services/api';
import { 
  CreatePostRequest,
  CreateCommentRequest,
  VoteRequest
} from '../types';
import toast from 'react-hot-toast';

// Auth hooks
export const useAuth = () => {
  return useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: authAPI.getProfile,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authAPI.login(email, password),
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      queryClient.setQueryData(['auth', 'profile'], data.user);
      toast.success('Welcome back!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: authAPI.register,
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      toast.success('Account created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => {
      const refreshToken = localStorage.getItem('refreshToken');
      return refreshToken ? authAPI.logout(refreshToken) : Promise.resolve();
    },
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      queryClient.clear();
      toast.success('Logged out successfully');
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { levelId?: string; displayName?: string; bio?: string; avatarUrl?: string }) =>
      usersAPI.updateProfile(data),
    onSuccess: (data) => {
      console.log('useUpdateProfile - onSuccess - data received:', data);
      queryClient.setQueryData(['auth', 'profile'], data);
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });
      console.log('useUpdateProfile - cache updated and queries invalidated');
      toast.success('Profile updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });
};

// Posts hooks
export const usePosts = (params: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tag?: string;
  level?: string;
  skills?: string;
  sort?: 'hot' | 'new' | 'top';
} = {}) => {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => postsAPI.getPosts(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useFeed = (params: {
  page?: number;
  limit?: number;
  level?: string;
  skills?: string;
} = {}) => {
  return useQuery({
    queryKey: ['feed', params],
    queryFn: () => postsAPI.getFeed(params),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const usePost = (id: string) => {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: () => postsAPI.getPost(id),
    enabled: !!id,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePostRequest) => postsAPI.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      toast.success('Post created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create post');
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreatePostRequest> }) =>
      postsAPI.updatePost(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.setQueryData(['posts', data.id], data);
      toast.success('Post updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update post');
    },
  });
};

export const usePublishPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => postsAPI.publishPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post published successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to publish post');
    },
  });
};

// Comments hooks
export const useComments = (postId: string, params: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} = {}) => {
  return useQuery({
    queryKey: ['comments', postId, params],
    queryFn: () => commentsAPI.getComments(postId, params),
    enabled: !!postId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateCommentRequest) => commentsAPI.createComment(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comments', data.postId] });
      toast.success('Comment added successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add comment');
    },
  });
};

// Votes hooks
export const useVote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: VoteRequest) => votesAPI.vote(data),
    onMutate: async (data) => {
      // Optimistic update
      const queryKey = data.targetType === 'post' 
        ? ['posts', data.targetId] 
        : ['comments', data.targetId];
      
      await queryClient.cancelQueries({ queryKey });
      
      const previousData = queryClient.getQueryData(queryKey);
      
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        
        const isUpvote = data.voteType === 'upvote';
        return {
          ...old,
          upvotes: old.upvotes + (isUpvote ? 1 : 0),
          downvotes: old.downvotes + (isUpvote ? 0 : 1),
        };
      });
      
      return { previousData, queryKey };
    },
    onError: (error, data, context) => {
      // Rollback on error
      if (context) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }
      toast.error('Failed to vote');
    },
    onSettled: (data, error, variables) => {
      // Refresh data
      queryClient.invalidateQueries({ 
        queryKey: [variables.targetType === 'post' ? 'posts' : 'comments'] 
      });
    },
  });
};

// Taxonomy hooks
// Taxonomy hooks - Updated to match available APIs
export const useLevels = () => {
  // Since levels API doesn't exist, return mock data for UI that matches database
  const now = new Date().toISOString();
  const mockLevels = [
    { id: 'A1', name: 'Beginner (A1)', description: 'Just starting your English journey', order: 1, createdAt: now, updatedAt: now },
    { id: 'A2', name: 'Elementary (A2)', description: 'Basic English skills', order: 2, createdAt: now, updatedAt: now },
    { id: 'B1', name: 'Pre-Intermediate (B1)', description: 'Building confidence in English', order: 3, createdAt: now, updatedAt: now },
    { id: 'B2', name: 'Intermediate (B2)', description: 'Comfortable with everyday English', order: 4, createdAt: now, updatedAt: now },
    { id: 'C1', name: 'Upper-Intermediate (C1)', description: 'Advanced English skills', order: 5, createdAt: now, updatedAt: now },
    { id: 'C2', name: 'Advanced (C2)', description: 'Near-native proficiency', order: 6, createdAt: now, updatedAt: now },
  ];
  
  return useQuery({
    queryKey: ['levels'],
    queryFn: () => Promise.resolve(mockLevels),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSkills = () => {
  // Since skills API doesn't exist, return mock data for UI that matches database
  const now = new Date().toISOString();
  const mockSkills = [
    { id: 'reading', name: 'Reading', description: 'Text comprehension and reading skills', createdAt: now, updatedAt: now },
    { id: 'writing', name: 'Writing', description: 'Written communication skills', createdAt: now, updatedAt: now },
    { id: 'listening', name: 'Listening', description: 'Audio comprehension skills', createdAt: now, updatedAt: now },
    { id: 'speaking', name: 'Speaking', description: 'Oral communication skills', createdAt: now, updatedAt: now },
    { id: 'grammar', name: 'Grammar', description: 'English grammar rules and structures', createdAt: now, updatedAt: now },
    { id: 'vocab', name: 'Vocabulary', description: 'Building word knowledge and vocabulary', createdAt: now, updatedAt: now },
  ];
  
  return useQuery({
    queryKey: ['skills'],
    queryFn: () => Promise.resolve(mockSkills),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useTags = () => {
  return useQuery({
    queryKey: ['tags'],
    queryFn: taxonomyAPI.getTags,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCategories = () => {
  // Since categories API doesn't exist, return empty data
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => Promise.resolve([]),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Search hooks
export const useSearch = (params: {
  query: string;
  type?: 'all' | 'posts' | 'comments' | 'users' | 'tags';
  levelId?: string;
  skills?: string;
  tags?: string;
  sort?: 'hot' | 'new' | 'top';
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['search', params],
    queryFn: () => searchAPI.search(params),
    enabled: !!params.query && params.query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useSearchSuggestions = (query: string) => {
  return useQuery({
    queryKey: ['search', 'suggestions', query],
    queryFn: () => searchAPI.getSuggestions(query),
    enabled: !!query && query.length > 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
