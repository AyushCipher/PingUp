import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import Loading from '../components/Loading';
import StoriesBar from '../components/StoriesBar';
import PostCard from '../components/PostCard';
import RecentMessages from '../components/RecentMessages';
import { useAuth } from '@clerk/clerk-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Feed = () => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  const { getToken } = useAuth();

  // Function to fetch posts from the server
  const fetchFeeds = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      // Call API to get feed data
      const { data } = await api.get('/api/post/feed', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // If successful and posts exist
      if (data.success) {
        setFeeds(data.posts);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false); 
    }
  };

  // Fetch posts when component mounts
  useEffect(() => {
    fetchFeeds();
  }, []);

  // Render
  return !loading ? (
    <div className="h-full overflow-y-scroll no-scroller py-10 xl:pr-5 flex items-start justify-center xl:gap-8">
      {/* Left side: Stories and post list */}
      <div>
        <StoriesBar />
        <div className="p-4 space-y-6">
          {feeds.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>

      {/* Right side: Sponsored + messages */}
      <div className="max-xl:hidden sticky top-0">
        <div className="max-w-xs bg-white text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow">
          <h3 className="text-slate-800 font-semibold">Sponsored</h3>
          <img
            src={assets.sponsored_img}
            className="w-75 h-50 rounded-md"
            alt="Sponsored"
          />
          <p className="text-slate-600">Email Marketing</p>
          <p className="text-slate-400">
            Supercharge your marketing with a powerful, easy-to-use platform built for results.
          </p>
        </div>
        <RecentMessages />
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Feed;
