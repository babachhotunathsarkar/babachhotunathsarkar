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
                  className="w-full h-[400px] md:h-[550px] lg:h-[650px] object-cover object-top transition-transform duration-700 group-hover:scale-105"
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
          <img src="/temple_image.jpeg" alt="Background" className="w-full h-full object-cover blur-sm scale-110" />
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
        image="/Temple.jpeg"
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

      {/* Our Journey Timeline */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 text-stone-900">
            <FadeInWhenVisible direction="down">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">पावन यात्रा <span className="text-orange-500">(Our Journey)</span></h2>
              <div className="w-24 h-1.5 bg-orange-500 mx-auto rounded-full mb-8"></div>
              <p className="text-stone-500 text-lg max-w-2xl mx-auto">
                2010 से लेकर आज तक, श्रद्धा और सेवा का एक अटूट सफर।
              </p>
            </FadeInWhenVisible>
          </div>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-orange-100 rounded-full hidden md:block"></div>

            <div className="space-y-24">
              {[
                {
                  year: "2010",
                  title: "नींव एवं स्थापना",
                  engTitle: "Foundation",
                  desc: "बाबा छोटू नाथ सरकार सेवा समिति की स्थापना बाडेसरा की पावन धरा पर की गई।",
                  align: "left"
                },
                {
                  year: "2015",
                  title: "सेवा का विस्तार",
                  engTitle: "Expansion",
                  desc: "विशाल भंडारों और स्वास्थ्य शिविरों के माध्यम से जन-सेवा के कार्यों में वृद्धि हुई।",
                  align: "right"
                },
                {
                  year: "2020",
                  title: "आध्यात्मिक चेतना",
                  engTitle: "Spiritual Awakening",
                  desc: "सत्संग और ध्यान शिविरों के जरिए भक्तों को आध्यात्मिक मार्गदर्शन प्रदान किया गया।",
                  align: "left"
                },
                {
                  year: "2024",
                  title: "आधुनिक स्वरूप",
                  engTitle: "Modern Era",
                  desc: "मंदिर का भव्य नवीनीकरण और डिजिटल माध्यम से वैश्विक स्तर पर भक्तों का जुड़ाव।",
                  align: "right"
                }
              ].map((item, index) => (
                <div key={index} className={`flex flex-col md:flex-row items-center ${item.align === 'right' ? 'md:flex-row-reverse' : ''}`}>
                  {/* Content Container */}
                  <div className="w-full md:w-1/2 px-4 md:px-12">
                    <FadeInWhenVisible direction={item.align === 'left' ? 'right' : 'left'}>
                      <div className={`p-10 rounded-[3rem] bg-white border border-orange-50 shadow-2xl hover:shadow-orange-200/50 transition-all relative group ${item.align === 'left' ? 'text-right' : 'text-left'}`}>
                        {/* Elegant Year Badge */}
                        <div className={`absolute top-0 ${item.align === 'left' ? 'right-0 -translate-y-1/2' : 'left-0 -translate-y-1/2'} flex items-center justify-center`}>
                          <div className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform">
                            {item.year}
                          </div>
                        </div>
                        
                        <div className={`inline-block px-4 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold uppercase tracking-widest mb-6 border border-orange-100`}>
                          {item.engTitle}
                        </div>
                        
                        <h3 className="text-3xl font-bold text-stone-900 mb-4 tracking-tight group-hover:text-orange-600 transition-colors">
                          {item.title}
                        </h3>
                        
                        <p className="text-stone-500 text-lg leading-relaxed font-normal">
                          {item.desc}
                        </p>
                      </div>
                    </FadeInWhenVisible>
                  </div>

                  {/* Center Dot */}
                  <div className="relative flex items-center justify-center my-8 md:my-0">
                    <div className="w-12 h-12 rounded-full bg-orange-500 border-4 border-white shadow-lg z-10 flex items-center justify-center text-white scale-75 md:scale-100">
                      <Heart className="w-5 h-5 fill-current" />
                    </div>
                  </div>

                  {/* Spacer for MD screens */}
                  <div className="hidden md:block w-1/2"></div>
                </div>
              ))}
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
