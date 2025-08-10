import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-8">
          <h1 className="text-2xl font-bold text-neutral-800 mb-4">
            Post Detail
          </h1>
          <p className="text-neutral-600">
            Post ID: {id}
          </p>
          <p className="text-neutral-500 mt-4">
            This page is under development. Full post details will be implemented soon.
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default PostDetailPage;
