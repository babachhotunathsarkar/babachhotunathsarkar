import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ZoomIn, X, ChevronLeft, ChevronRight, Loader as LucideLoader } from 'lucide-react';
import Loader from '../components/Loader';
import { getAllImages, getImagesByCategory } from '../redux/images/imageSlice';
import SEO from "../components/SEO";

const categoryLabels = {
  all: 'All',
  general: 'General',
  temple: 'Temple',
  events: 'Events',
  festivals: 'Festivals',
  gallery: 'Gallery',
  other: 'Other'
};

export default function Gallery() {
  const dispatch = useDispatch();
  const { images, isLoading, pagination } = useSelector((state) => state.images);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);

  // Categories from backend or predefined
  const categories = ['all', 'general', 'temple', 'events', 'festivals', 'gallery', 'other'];

  useEffect(() => {
    fetchImages();
  }, [selectedCategory]);

  const fetchImages = () => {
    if (selectedCategory === 'all') {
      dispatch(getAllImages({ page: 1, limit: 50 }));
    } else {
      dispatch(getImagesByCategory({ category: selectedCategory, limit: 50 }));
    }
  };

  const filteredPhotos = images || [];

  const openLightbox = (image, index) => {
    setLightboxImage(image);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    setCurrentIndex(-1);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setLightboxImage(filteredPhotos[currentIndex - 1]);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredPhotos.length - 1) {
      setLightboxImage(filteredPhotos[currentIndex + 1]);
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxImage) {
        if (e.key === 'ArrowLeft') handlePrevious();
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'Escape') closeLightbox();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage, currentIndex]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Photo Gallery | Baba Chhotu Nath Temple"
        description="View a collection of beautiful photos and memories from Shri Baba Chhotu Nath Temple, Badesra. Explore the spiritual beauty, festivals, and community celebrations."
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-500 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Gallery
          </h1>
          <p className="text-orange-100 max-w-2xl mx-auto">
            View beautiful photos of temple events and ceremonies
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

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <Loader fullScreen={false} />
          ) : filteredPhotos.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No photos found in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredPhotos.map((photo, index) => (
                <div
                  key={photo._id || photo.id}
                  className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer aspect-square"
                  onClick={() => openLightbox(photo, index)}
                >
                  <img
                    src={photo.imageUrl || photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                      <ZoomIn className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="text-white font-medium text-sm line-clamp-1">{photo.title}</h4>
                    {photo.category && (
                      <p className="text-white/70 text-xs mt-1">{categoryLabels[photo.category] || photo.category}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => dispatch(getAllImages({ page: pagination.currentPage - 1, limit: 20 }))}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => dispatch(getAllImages({ page: pagination.currentPage + 1, limit: 20 }))}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors z-10"
            onClick={closeLightbox}
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

          {currentIndex < filteredPhotos.length - 1 && (
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

          <img
            src={lightboxImage.imageUrl || lightboxImage.url}
            alt={lightboxImage.title}
            className="max-w-[90vw] max-h-[85vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="absolute bottom-4 left-0 right-0 text-center bg-black/50 py-3">
            <h4 className="text-white font-medium mb-1">{lightboxImage.title}</h4>
            {lightboxImage.description && (
              <p className="text-white/80 text-sm">{lightboxImage.description}</p>
            )}
            <p className="text-white/60 text-sm mt-1">
              {currentIndex + 1} / {filteredPhotos.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}