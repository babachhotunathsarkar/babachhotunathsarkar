import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Play, X, ChevronLeft, ChevronRight, Loader, Calendar, Eye } from 'lucide-react';
import { getAllVideos } from '../redux/videos/videoSlice';
import SEO from "../components/SEO";

const categoryLabels = {
  all: 'All',
  general: 'General',
  events: 'Events',
  ceremonies: 'Ceremonies',
  speeches: 'Speeches',
  devotional: 'Devotional',
  other: 'Other'
};

export default function Videos() {
  const dispatch = useDispatch();
  const { videos, isLoading, pagination } = useSelector((state) => state.videos);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeVideo, setActiveVideo] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const categories = ['all', 'general', 'events', 'ceremonies', 'speeches', 'devotional', 'other'];

  useEffect(() => {
    fetchVideos();
  }, [selectedCategory]);

  const fetchVideos = () => {
    if (selectedCategory === 'all') {
      dispatch(getAllVideos({ page: 1, limit: 20 }));
    } 
  };

  const openVideo = (video, index) => {
    setActiveVideo(video);
    setCurrentIndex(index);
  };

  const closeVideo = () => {
    setActiveVideo(null);
    setCurrentIndex(-1);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setActiveVideo(videos[currentIndex - 1]);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < videos.length - 1) {
      setActiveVideo(videos[currentIndex + 1]);
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Get YouTube video ID from URL
  const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeVideo) {
        if (e.key === 'ArrowLeft') handlePrevious();
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'Escape') closeVideo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeVideo, currentIndex]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Video Gallery | Devotional Videos"
        description="Watch divine moments, spiritual discourses, and event highlights from Shri Baba Chhotu Nath Temple, Badesra. Experience the spiritual atmosphere through our video collection."
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-500 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Video Gallery
          </h1>
          <p className="text-orange-100 max-w-2xl mx-auto">
            Watch divine moments from the temple
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white shadow-sm sticky top-28 z-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-orange-100'
                }`}
              >
                {categoryLabels[category] || category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader className="w-12 h-12 text-orange-500 animate-spin" />
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No videos found in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video, index) => {
                const youtubeId = getYoutubeId(video.videoUrl || video.url);
                const thumbnailUrl = video.thumbnail || `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
                
                return (
                  <div
                    key={video._id || video.id}
                    className="group relative bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all"
                    onClick={() => openVideo(video, index)}
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 text-white fill-white ml-1" />
                        </div>
                      </div>
                      {video.duration && (
                        <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 text-lg line-clamp-1 mb-1">
                        {video.title}
                      </h3>
                      {video.description && (
                        <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                          {video.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        {video.category && (
                          <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded">
                            {categoryLabels[video.category] || video.category}
                          </span>
                        )}
                        {video.createdAt && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(video.createdAt)}</span>
                          </div>
                        )}
                        {video.views && (
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{video.views}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => dispatch(getAllVideos({ page: pagination.currentPage - 1, limit: 20 }))}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => dispatch(getAllVideos({ page: pagination.currentPage + 1, limit: 20 }))}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Video Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeVideo}
        >
          <button
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors z-10"
            onClick={closeVideo}
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation */}
          {currentIndex > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/10 rounded-full transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {currentIndex < videos.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/10 rounded-full transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          <div
            className="w-full max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            {getYoutubeId(activeVideo.videoUrl || activeVideo.url) ? (
              <iframe
                src={`https://www.youtube.com/embed/${getYoutubeId(activeVideo.videoUrl || activeVideo.url)}?autoplay=1`}
                title={activeVideo.title}
                className="w-full h-full rounded-lg"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={activeVideo.videoUrl || activeVideo.url}
                controls
                autoPlay
                className="w-full h-full rounded-lg bg-black"
              />
            )}
          </div>

          <div className="absolute bottom-4 left-0 right-0 text-center bg-black/50 py-3">
            <h3 className="text-white font-semibold text-lg mb-1">{activeVideo.title}</h3>
            {activeVideo.description && (
              <p className="text-white/80 text-sm">{activeVideo.description}</p>
            )}
            <p className="text-white/60 text-sm mt-1">
              {currentIndex + 1} / {videos.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}