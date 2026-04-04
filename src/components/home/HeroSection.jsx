import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

// Import images from public/CarsoleImage folder
import firstImage from '../../../public/CarsoleImage/bothtemple.png'
import secondImage from '../../../public/CarsoleImage/darbar.jpeg'
import thirdImage from '../../../public/CarsoleImage/bothtemple.png'
import fourthImage from '../../../public/CarsoleImage/darbar.jpeg'

const carouselSlides = [
  {
    id: 1,
    image: firstImage,
    title: "जय श्री बाबा छोटु नाथ जी",
    subtitle: "श्रद्धा, भक्ति एवं सेवा का पावन संगम",
    tag: "प्राचीन सिद्ध पीठ"
  },
  {
    id: 2,
    image: secondImage,
    title: "दिव्य दरबार",
    subtitle: "मानवता की सेवा ही परम धर्म है",
    tag: "शांति एवं अध्यात्म"
  },
  {
    id: 3,
    image: thirdImage,
    title: "भव्य मंदिर परिसर",
    subtitle: "सत्यम शिवम सुंदरम",
    tag: "दिव्य दर्शन"
  },
  {
    id: 4,
    image: fourthImage,
    title: "अमृतमयी सत्संग",
    subtitle: "गुरु सेवा ही मुक्ति का मार्ग है",
    tag: "सत्संग महिमा"
  },
]

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)

  const paginate = useCallback((newDirection) => {
    setDirection(newDirection)
    setCurrentSlide((prev) => (prev + newDirection + carouselSlides.length) % carouselSlides.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => paginate(1), 5000)
    return () => clearInterval(timer)
  }, [paginate])

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.1
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.05,
      transition: {
        duration: 1,
        ease: [0.4, 0, 0.2, 1]
      }
    })
  }

  return (
    <section className="relative h-[85vh] sm:h-[90vh] w-full overflow-hidden bg-black">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          {/* Background Image Container */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.img
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 5 }}
              src={carouselSlides[currentSlide].image}
              alt=""
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.55)' }}
            />
            {/* Enhanced Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30"></div>
          </div>

          {/* Content Overlay */}
          <div className="relative h-full flex items-center justify-center text-center px-4 sm:px-6">
            <div className="max-w-5xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-600/90 text-white text-xs sm:text-sm font-bold uppercase tracking-[0.2em] mb-6 border border-orange-400/30"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                {carouselSlides[currentSlide].tag}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 tracking-tight drop-shadow-2xl leading-tight"
              >
                {carouselSlides[currentSlide].title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="text-lg sm:text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto font-medium"
              >
                {carouselSlides[currentSlide].subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
              >
                <Link 
                  to="/darshan" 
                  className="w-full sm:w-auto px-8 py-4 bg-orange-600 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-orange-600/30 hover:bg-orange-500 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group"
                >
                  <Play className="w-5 h-5 fill-current" /> दर्शन आरंभ करें
                </Link>
                <Link 
                  to="/about"
                  className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-bold text-lg hover:bg-white/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  संस्था के बारे में <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Modern Navigation Arrows */}
      <div className="absolute inset-0 flex items-center justify-between p-4 sm:p-8 z-20 pointer-events-none">
        <button
          onClick={() => paginate(-1)}
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-black/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-orange-600 hover:border-orange-500 transition-all pointer-events-auto group shadow-2xl"
        >
          <ChevronLeft className="w-7 h-7 sm:w-9 sm:h-9 group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={() => paginate(1)}
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-black/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-orange-600 hover:border-orange-500 transition-all pointer-events-auto group shadow-2xl"
        >
          <ChevronRight className="w-7 h-7 sm:w-9 sm:h-9 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Modern Pagination Indicators */}
      <div className="absolute bottom-8 sm:bottom-12 left-0 right-0 z-20 flex justify-center gap-4">
        {carouselSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => { setDirection(index > currentSlide ? 1 : -1); setCurrentSlide(index); }}
            className={`transition-all duration-700 h-1.5 rounded-full ${index === currentSlide ? 'w-16 bg-orange-600' : 'w-6 bg-white/20 hover:bg-white/40'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}