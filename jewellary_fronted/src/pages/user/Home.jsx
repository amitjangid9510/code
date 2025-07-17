import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { fetchProducts } from '../../features/user/productSlice';

const Home = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const featuredCategories = [
    {
      name: 'Rings',
      image: '/5071662c7320ba394641b36fbb3f7185.jpg',
      path: '/products/rings',
    },
    {
      name: 'Necklaces',
      image: '/4bb2ab532b450a4ef7b2952f34bbc3e9.jpg',
      path: '/products/necklaces',
    },
    {
      name: 'Earrings',
      image: '/c12681f861890f7fd225a007ac7c2a97.jpg',
      path: '/products/earrings',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const heroImages = {
    mobile: '/61a18a034cd6d9cb1009e1a69b1a70d5.jpg', 
    desktop: '/b57642010ea57e5351f3ee293b02a117.jpg' 
  };

  const handleClick = async () => {
    try {
      await dispatch(fetchProducts({ 
        page: 1, 
        limit: 10, 
        filters: {} 
      })).unwrap();
      navigate('/products');
    } catch (error) {
      console.error('Failed to process:', error);
    }
  };

  return (
    <div className="overflow-x-hidden">
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <img
            src={isMobile ? heroImages.mobile : heroImages.desktop}
            alt="Futuristic jewellery"
            className="w-full h-full object-cover"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center px-4 z-10"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-futuristic">
            Futuristic jewellery
          </h1>
          <p className="text-lg text-white mb-8 max-w-2xl mx-auto">
            Discover our exclusive collection of handcrafted jewellery pieces
          </p>
          <button
            onClick={handleClick}
            className="inline-block bg-white text-primary-DEFAULT font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition-all transform hover:scale-105"
          >
            Shop Now
          </button>
        </motion.div>
      </section>

      <section className="relative py-20 md:py-32 overflow-hidden bg-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Experience Our Craftsmanship
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Watch how we blend traditional techniques with futuristic designs
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative aspect-video max-w-6xl mx-auto rounded-xl overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
              <div className="text-center p-8">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover"
              poster="/video-poster.jpg" 
            >
              <source src="/0feb0c688e80aff526c7949d79d18f54_720w.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
              </div>
            </div>
  
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 relative overflow-hidden"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 font-serif tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-gray-900 via-gray-700 to-gray-900">
              Signature Collections
            </span>
          </h2>
          <div className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            Discover our curated selection of futuristic jewellery pieces that blend innovation with timeless elegance
          </div>
        </motion.div>

        <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-12"
            >
              {featuredCategories.map((category, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -15 }}
                  className="group perspective-1000"
                >
                  <div className="relative h-96 overflow-hidden rounded-2xl shadow-2xl transform transition-all duration-500 group-hover:shadow-xl group-hover:rotate-x-5">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-8">
                      <div>
                        <h3 className="text-3xl font-bold text-white mb-2">{category.name}</h3>
                        <Link
                          to={category.path}
                          className="inline-flex items-center text-white border-b-2 border-orange-400 pb-1 group-hover:border-orange-200 transition-colors"
                        >
                          View Collection
                          <ChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
        </motion.div>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-between items-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-futuristic">Trending Now</h2>
            <div className="flex space-x-4">
              <button className="p-2 rounded-full bg-white shadow-md hover:bg-orange-100 transition-colors">
                <ChevronLeft className="text-orange-600" />
              </button>
              <button className="p-2 rounded-full bg-white shadow-md hover:bg-orange-100 transition-colors">
                <ChevronRight className="text-orange-600" />
              </button>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="aspect-square bg-orange-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-100"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-black">
                    <span className="text-lg font-medium">Product Image</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">Luxury {['Ring', 'Necklace', 'Earrings', 'Bracelet'][i]}</h3>
                  <p className="text-gray-600 text-sm mb-2">Futuristic Collection</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-orange-600">₹{
                      [199, 349, 149, 229][i]
                    }</span>
                    <button className="text-orange-600 hover:text-orange-800 transition-colors">
                      + Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                title: "Innovative Designs",
                description: "Our jewellery combines cutting-edge technology with traditional craftsmanship",
                icon: "✨"
              },
              {
                title: "Ethical Sourcing",
                description: "All materials responsibly sourced with minimal environmental impact",
                icon: "🌱"
              },
              {
                title: "Lifetime Warranty",
                description: "We stand behind our products with comprehensive coverage",
                icon: "🛡️"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-xl shadow-lg text-center"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative py-24 overflow-hidden bg-black">
        <motion.div
          initial={{ scale: 1.2 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10"></div>
        </motion.div>

        <div className="relative container mx-auto px-4 text-center max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Join Our Futuristic Journey
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/80 mb-8 text-lg"
          >
            Be the first to access exclusive collections and special offers
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 border border-white text-white placeholder-white/60 bg-transparent rounded-l-lg sm:rounded-r-none rounded-t-lg sm:rounded-t-lg focus:outline-none focus:border-gray-400 mb-2 sm:mb-0"
            />
            <button className="bg-white text-black px-6 py-3 rounded-r-lg sm:rounded-l-none rounded-b-lg sm:rounded-b-lg font-bold hover:bg-black hover:text-white border border-white transition-colors">
              Subscribe
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;