import { useEffect } from 'react';
import SEO from "../components/SEO";
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Heart, Users, BookOpen, Calendar, MapPin, Phone, Mail, Send } from 'lucide-react';
import { fetchPublicAddresses } from '../redux/address/addressSlice';
import ContactForm from '../components/ContactForm';

const FadeInWhenVisible = ({ children, direction = 'up', delay = 0 }) => {
  const variants = {
    hidden: { 
      opacity: 0, 
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      x: 0,
      transition: { duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

const Section = ({ title, content, image, imageLeft, accent = false }) => {
  return (
    <section className={`py-20 ${accent ? 'bg-orange-50/50' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        <div className={`flex flex-col ${imageLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
          {/* Image Container */}
          <div className="w-full lg:w-1/2">
            <FadeInWhenVisible direction={imageLeft ? 'right' : 'left'}>
              <div className="group relative overflow-hidden rounded-3xl shadow-2xl">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-[300px] md:h-[450px] lg:h-[500px] object-cover object-center transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </FadeInWhenVisible>
          </div>

          {/* Text Container */}
          <div className="w-full lg:w-1/2 space-y-6">
            <FadeInWhenVisible direction={imageLeft ? 'left' : 'right'}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {title}
              </h2>
              <div className="w-20 h-1.5 bg-orange-500 rounded-full mb-6"></div>
              <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                {content}
              </div>
            </FadeInWhenVisible>
          </div>
        </div>
      </div>
    </section>
  );
};

const About = () => {
  const dispatch = useDispatch();
  const { addresses } = useSelector(state => state.address);
  const { templeInfo } = useSelector(state => state.settings);

  useEffect(() => {
    dispatch(fetchPublicAddresses());
  }, [dispatch]);

  const getDynamicAddress = () => {
    if (addresses && addresses.length > 0) {
      const addr = addresses[0];
      const parts = [
        addr.village,
        addr.district,
        addr.state,
      ].filter(Boolean);
      return parts.join(', ');
    }
    return templeInfo?.addressEnglish || templeInfo?.address || "Baba Chhotu Nath Temple, [City], [State]";
  };

  const features = [
    {
      icon: Heart,
      title: 'Service',
      description: 'Dedicated to community service and the welfare of humanity through various charitable initiatives.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'A welcoming space for people of all faiths, backgrounds, and walks of life to unite in devotion.'
    },
    {
      icon: BookOpen,
      title: 'Education',
      description: 'Promoting spiritual, moral, and Vedic education to nurture the soul and intellect.'
    },
    {
      icon: Calendar,
      title: 'Events',
      description: 'Organizing regular religious gatherings, satsangs, and cultural programs for spiritual growth.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="About Our Temple | Baba Chhotu Nath Sarkar"
        description="Discover the rich history and spiritual legacy of Shri Baba Chhotu Nath Temple in Badesra, Bhiwani. Learn about Baba Chhotu Nath Sarkar and our mission of service and devotion."
      />
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 z-0 opacity-40">
           <img src="/temple image.jpeg" alt="Background" className="w-full h-full object-cover blur-sm scale-110" />
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <FadeInWhenVisible direction="down">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              About <span className="text-orange-500">Us</span>
            </h1>
          </FadeInWhenVisible>
          <FadeInWhenVisible direction="up" delay={0.2}>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Baba Chhotu Nath Sarkar Sewa Samiti - A Sacred Haven of Devotion, Service, and Spiritual Wisdom.
            </p>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Our Story Section */}
      <Section
        title="Our Story"
        image="/temple image.jpeg"
        imageLeft={false}
        content={(
          <>
            <p>
              Baba Chhotu Nath Sarkar Sewa Samiti was established in 2010 with a vision to cultivate spiritual awareness and serve humanity. This organization is deeply rooted in the spiritual teachings and the life of Baba Chhotu Nath Ji.
            </p>
            <p>
              Our mission is to bridge the gap between material life and spiritual fulfillment. We believe that true devotion is expressed through service to society, which is why we organize regular community meals (bhandaras), health camps, and educational programs.
            </p>
            <div className="flex items-center gap-6 pt-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-orange-600">14+</p>
                <p className="text-sm font-medium text-gray-500">Years of Service</p>
              </div>
              <div className="h-12 w-[1px] bg-gray-200"></div>
              <div className="text-center">
                <p className="text-4xl font-bold text-orange-600">10k+</p>
                <p className="text-sm font-medium text-gray-500">Devotee Families</p>
              </div>
            </div>
          </>
        )}
      />

      {/* Baba Chhotu Nath Section */}
      <Section
        title="Shri Baba Chhotu Nath"
        image="/babachhotunath.jpeg"
        imageLeft={true}
        accent={true}
        content={(
          <p>
            Shri Baba Chhotu Nath Ji is the guiding soul of our temple and the source of our spiritual inspiration. Known for his profound wisdom and boundless compassion, Babaji dedicated his life to the service of God and the poor. His presence is still felt in every corner of the temple, guiding devotees towards the path of righteousness and inner peace.
          </p>
        )}
      />

      {/* Baba Dharmgiri Section */}
      <Section
        title="Baba Dharmgiri"
        image="/babadharmgiri.jpg"
        imageLeft={false}
        content={(
          <p>
            Baba Dharmgiri Ji represents the legacy of asceticism and unwavering faith. His simple living and high thinking have inspired generations. He emphasized the importance of discipline, meditation, and the study of ancient scriptures. His contribution to the spiritual foundation of this Samiti is immeasurable, providing a moral compass for all seekers.
          </p>
        )}
      />

      {/* President Section */}
      <Section
        title="Our President"
        image="/President.jpeg"
        imageLeft={true}
        accent={true}
        content={(
          <p>
            Under the visionary leadership of our President, the Samiti has grown from a local gathering into a beacon of hope for many. His dedication to maintaining the temple's sanctity while expanding its charitable reach has been pivotal. He oversees all the operations of the samiti, ensuring that every donation is used effectively for the welfare of the temple and the community.
          </p>
        )}
      />

      {/* Core Values / Features */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <div className="w-24 h-1.5 bg-orange-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FadeInWhenVisible key={index} delay={index * 0.1}>
                <div className="bg-white p-10 rounded-3xl border border-gray-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300 group text-center">
                  <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-500 group-hover:scale-110 transition-all duration-300">
                    <feature.icon className="w-8 h-8 text-orange-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="bg-[#1a1a1a] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
            <div className="lg:w-1/2 p-12 md:p-16 flex flex-col justify-center text-white relative">
              <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
              
              <FadeInWhenVisible direction="right">
                <h2 className="text-4xl font-bold mb-10">Visit Us</h2>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 group-hover:border-orange-500/40 transition-all">
                      <MapPin className="w-7 h-7 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Our Location</p>
                      <p className="text-xl font-semibold leading-relaxed group-hover:text-orange-400 transition-colors">
                        {getDynamicAddress()}
                      </p>
                    </div>
                  </div>

                  {templeInfo?.phone && (
                    <div className="flex items-center gap-6 group">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 group-hover:border-orange-500/40 transition-all">
                        <Phone className="w-7 h-7 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Phone Number</p>
                        <a href={`tel:${templeInfo.phone}`} className="text-xl font-semibold hover:text-orange-400 transition-colors">
                          {templeInfo.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {templeInfo?.email && (
                    <div className="flex items-center gap-6 group">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 group-hover:border-orange-500/40 transition-all">
                        <Mail className="w-7 h-7 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Email Address</p>
                        <a href={`mailto:${templeInfo.email}`} className="text-xl font-semibold break-all hover:text-orange-400 transition-colors">
                          {templeInfo.email}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </FadeInWhenVisible>
            </div>
            
            <div className="lg:w-1/2 min-h-[400px] relative grayscale hover:grayscale-0 transition-all duration-700">
               {templeInfo?.mapLink ? (
                 <iframe 
                   src={templeInfo.mapLink}
                   width="100%" 
                   height="100%" 
                   style={{ border: 0 }} 
                   allowFullScreen="" 
                   loading="lazy" 
                   referrerPolicy="no-referrer-when-downgrade"
                   className="absolute inset-0 w-full h-full object-cover"
                   title="Temple Location Map"
                 ></iframe>
               ) : (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
                   <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mb-6">
                      <MapPin className="w-12 h-12 text-orange-500" />
                   </div>
                   <p className="text-gray-400 font-bold uppercase tracking-widest">Location Map</p>
                 </div>
               )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 bg-stone-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <div className="text-center mb-16">
            <FadeInWhenVisible direction="down">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                हमें मेसेज भेजें <span className="text-orange-500">(Send Message)</span>
              </h2>
              <div className="w-24 h-1.5 bg-orange-500 mx-auto rounded-full mb-8"></div>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Baba Chhotu Nath Sarkar Sewa Samiti aapse jald sampark karegi.
              </p>
            </FadeInWhenVisible>
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-2xl">
            <ContactForm light={true} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
