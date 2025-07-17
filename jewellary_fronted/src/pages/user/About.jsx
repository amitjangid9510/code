import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8 text-center">About FuturaJewel</h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-gray-700 mb-4">
            Founded in 2023, FuturaJewel was born from a passion for combining cutting-edge design
            with timeless jewellery craftsmanship. We believe that jewellery should not only be beautiful
            but also push the boundaries of traditional design.
          </p>
          <p className="text-gray-700">
            Our team of designers and artisans work together to create pieces that reflect the future
            while honoring the artistry of jewellery-making traditions.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-4">Our Materials</h2>
          <p className="text-gray-700 mb-4">
            We source only the highest quality materials, from ethically mined gemstones to recycled
            precious metals. Each piece is crafted with sustainability in mind, ensuring minimal
            environmental impact without compromising on luxury or quality.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-4">The Future of jewellery</h2>
          <p className="text-gray-700">
            At FuturaJewel, we're constantly innovating, exploring new materials and technologies
            to create jewellery that's truly unique. From 3D-printed designs to smart jewellery
            integrations, we're redefining what jewellery can be.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;