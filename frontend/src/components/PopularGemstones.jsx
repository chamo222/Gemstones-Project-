import React, { useContext, useEffect, useState } from 'react';
import Title from './Title';
import { ShopContext } from '../context/ShopContext';
import Item from './Item';
import { motion } from 'framer-motion';

const PopularGemstones = () => {
  const { foods } = useContext(ShopContext);
  const [popularFoods, setPopularFoods] = useState([]);

  useEffect(() => {
    const data = foods.filter(item => item.popular);
    setPopularFoods(data.slice(0, 5));
  }, [foods]);

  return (
    <section className="max-padd-container py-20">
      <Title
        title1={'Popular'}
        title2={'Gemstones'}
        titleStyles={'text-center !pb-20'}
        paraStyles={'!block'}
      />

      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 gap-y-36 pt-20">
        {popularFoods.map((food, index) => (
          <motion.div
            key={food._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
          >
            <Item food={food} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PopularGemstones;