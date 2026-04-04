import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ZoomIn, ArrowRight, Video, Image as ImageIcon, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import darbarImage from '../../../public/CarsoleImage/darbar.jpeg';
import { openLightbox, closeLightbox } from '../../redux/slices/gallerySlice';
import { getAllVideos } from '../../redux/videos/videoSlice';

export default function MediaSection() {
  const dispatch = useDispatch();
  const [activeVideo, setActiveVideo] = useState(null);
  const { photos, lightboxImage } = useSelector((state) => state.gallery);
  const { videos, isLoading: videosLoading } = useSelector((state) => state.videos);

  useEffect(() => {
    dispatch(getAllVideos({ page: 1, limit: 6 }));
  }, [dispatch]);

  const previewPhotos = photos.slice(0, 6);
  const previewVideos = videos.slice(0, 3);

  const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">मीडिया एवं गैलरी</h2>
          <div className="w-24 h-1.5 bg-orange-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* YouTube Videos Column */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-600 text-white rounded-xl flex items-center justify-center">
                  <Video className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">वीडियो दर्शन</h3>
              </div>
              <Link to="/videos" className="text-orange-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                सब देखें <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-6">
              {previewVideos.map((video, idx) => {
                const yid = getYoutubeId(video.videoUrl || video.url);
                return (
                  <motion.div
                    key={idx}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-[2rem] hover:bg-orange-50 transition-colors group cursor-pointer border border-gray-100"
                    onClick={() => setActiveVideo(video)}
                  >
                    <div className="relative w-32 h-20 shrink-0 rounded-2xl overflow-hidden">
                      <img
                        src={yid ? `https://img.youtube.com/vi/${yid}/mqdefault.jpg` : (video.thumbnail || darbarImage)}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Play className="w-8 h-8 text-white fill-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                        {video.title}
                      </h4>
                      <p className="text-gray-500 text-xs mt-1 line-clamp-1">
                        {video.description || 'Watch our latest devotion'}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Image Gallery Column */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-600 text-white rounded-xl flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">चित्र गैलरी</h3>
              </div>
              <Link to="/gallery" className="text-orange-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                सब देखें <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {previewPhotos.map((photo, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative aspect-square rounded-3xl overflow-hidden cursor-pointer group shadow-lg shadow-gray-100"
                  onClick={() => dispatch(openLightbox(photo))}
                >
                  <img src={photo.url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ZoomIn className="text-white w-10 h-10" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10"
            onClick={() => setActiveVideo(null)}
          >
            <button className="absolute top-6 right-6 text-white hover:rotate-90 transition-transform">
              <X className="w-8 h-8" />
            </button>
            <div className="w-full max-w-5xl aspect-video bg-black rounded-[2rem] overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
              {getYoutubeId(activeVideo.videoUrl || activeVideo.url) ? (
                <iframe
                  src={`https://www.youtube.com/embed/${getYoutubeId(activeVideo.videoUrl || activeVideo.url)}?autoplay=1`}
                  title={activeVideo.title}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={activeVideo.videoUrl || activeVideo.url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain bg-black"
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox Rendering (if needed, though already exists in GalleryPreview, but we want it isolated here too if we replace GalleryPreview) */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-4"
          onClick={() => dispatch(closeLightbox())}
        >
          <button className="absolute top-6 right-6 text-white"><X className="w-8 h-8" /></button>
          <img src={lightboxImage.url} alt="" className="max-w-full max-h-[90vh] object-contain rounded-2xl" />
        </div>
      )}
    </section>
  );
}
