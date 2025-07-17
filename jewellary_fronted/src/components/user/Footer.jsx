import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Footer = () => {
  const links = [
    {
      title: 'Shop',
      items: [
        { name: 'All Products', path: '/products' },
        { name: 'Rings', path: '/products/rings' },
        { name: 'Necklaces', path: '/products/necklaces' },
        { name: 'Earrings', path: '/products/earrings' },
      ],
    },
    {
      title: 'Company',
      items: [
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' },
      ],
    },
    {
      title: 'Support',
      items: [
        { name: 'FAQs', path: '/faqs' },
        { name: 'Shipping', path: '/shipping' },
        { name: 'Returns', path: '/returns' },
        { name: 'Size Guide', path: '/size-guide' },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <h3 className="text-2xl font-bold font-futuristic mb-4">FuturaJewel</h3>
            <p className="text-gray-400 mb-4">
              Futuristic jewellery for the modern era. Handcrafted with precision and passion.
            </p>
          </motion.div>

          {links.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h4 className="text-lg font-bold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link
                      to={item.path}
                      className="text-gray-400 hover:text-primary-DEFAULT transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} FuturaJewel. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;