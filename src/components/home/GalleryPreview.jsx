import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ArrowRight, ZoomIn, X } from 'lucide-react'
import { openLightbox, closeLightbox } from '../../redux/slices/gallerySlice'

export default function GalleryPreview() {
  const dispatch = useDispatch()
  const { photos, lightboxImage } = useSelector((state) => state.gallery)

  const previewPhotos = photos.slice(0, 6)

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-orange-50">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <span className="inline-block text-orange-600 font-semibold mb-2 sm:mb-3 text-xs sm:text-sm uppercase tracking-wider">
              Gallery
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Photo Gallery
            </h2>
          </div>
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold text-sm sm:text-base group"
          >
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Gallery Grid - Mobile: 2 cols, Tablet: 3 cols */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
          {previewPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className={`group relative overflow-hidden rounded-lg sm:rounded-xl shadow-lg cursor-pointer ${
                index === 0 ? 'col-span-2 row-span-1 md:col-span-2 md:row-span-2' : ''
              }`}
              onClick={() => dispatch(openLightbox(photo))}
            >
              <img
                src={photo.url}
                alt={photo.title}
                className={`w-full object-cover group-hover:scale-110 transition-transform duration-500 ${
                  index === 0 ? 'h-48 sm:h-56 md:h-full' : 'h-32 sm:h-40 md:h-48 lg:h-64'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 flex items-center justify-center">
                  <ZoomIn className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h4 className="text-white font-medium text-xs sm:text-sm truncate">{photo.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => dispatch(closeLightbox())}
        >
          <button
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors z-10"
            onClick={() => dispatch(closeLightbox())}
          >
            <X className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          <img
            src={lightboxImage.url}
            alt={lightboxImage.title}
            className="max-w-full max-h-[85vh] sm:max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <h4 className="text-white font-medium text-sm sm:text-base">{lightboxImage.title}</h4>
          </div>
        </div>
      )}
    </section>
  )
}
