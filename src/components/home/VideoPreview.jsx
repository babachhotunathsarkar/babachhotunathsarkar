import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowRight, Play, X, Loader as LucideLoader } from 'lucide-react';
import Loader from '../Loader';
import { getAllVideos } from '../../redux/videos/videoSlice';

export default function VideoPreview() {
  const dispatch = useDispatch();
  const [activeVideo, setActiveVideo] = useState(null);
  const { videos, isLoading } = useSelector((state) => state.videos);

  useEffect(() => {
    dispatch(getAllVideos({ page: 1, limit: 3 }));
  }, [dispatch]);

  const previewVideos = videos.slice(0, 3);

  const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <Loader fullScreen={false} />
      </section>
    );
  }

  if (previewVideos.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <span className="inline-block text-orange-600 font-semibold mb-2 sm:mb-3 text-xs sm:text-sm uppercase tracking-wider">
              Videos
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Video Gallery
            </h2>
          </div>
          <Link
            to="/videos"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold text-sm sm:text-base group"
          >
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Videos Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {previewVideos.map((video) => {
            const youtubeId = getYoutubeId(video.videoUrl || video.url);
            const thumbnailUrl = video.thumbnail || `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
            
            return (
              <div
                key={video._id || video.id}
                className="group relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg cursor-pointer"
                onClick={() => setActiveVideo(video)}
              >
                <div className="relative">
                  <img
                    src={thumbnailUrl}
                    alt={video.title}
                    className="w-full h-44 sm:h-48 md:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white fill-white ml-0.5 sm:ml-1" />
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <h4 className="text-white font-semibold text-sm sm:text-base line-clamp-1">{video.title}</h4>
                  {video.description && (
                    <p className="text-white/70 text-xs sm:text-sm line-clamp-1 mt-0.5">{video.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors z-10"
            onClick={() => setActiveVideo(null)}
          >
            <X className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
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
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <h4 className="text-white font-medium mb-1">{activeVideo.title}</h4>
            <p className="text-white/60 text-sm">
              {activeVideo.category && `Category: ${activeVideo.category}`}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}