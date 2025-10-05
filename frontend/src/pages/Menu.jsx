import React, { useContext, useEffect, useState } from 'react';
import { LuSettings2 } from 'react-icons/lu';
import { RiSearch2Line } from 'react-icons/ri';
import { categories } from '../assets/data';
import Title from '../components/Title';
import Item from '../components/Item';
import Footer from '../components/Footer';
import { ShopContext } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';

const Menu = () => {
  const { foods } = useContext(ShopContext);
  const [category, setCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [showCategories, setShowCategories] = useState(true);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const toggleFilter = (value, setState) => {
    setState((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const applyFilters = () => {
    let filtered = [...foods];

    if (search) {
      filtered = filtered.filter((food) =>
        food.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length) {
      filtered = filtered.filter((food) => category.includes(food.category));
    }
    return filtered;
  };

  const applySorting = (foodsList) => {
    const sortedFoods = [...foodsList];

    switch (sortType) {
      case "low":
        return sortedFoods.sort((a, b) => {
          const aPrice = Object.values(a.price)[0];
          const bPrice = Object.values(b.price)[0];
          return aPrice - bPrice;
        });
      case "high":
        return sortedFoods.sort((a, b) => {
          const aPrice = Object.values(a.price)[0];
          const bPrice = Object.values(b.price)[0];
          return bPrice - aPrice;
        });
      default:
        return sortedFoods;
    }
  };

  const toggleShowCategories = () => {
    setShowCategories(!showCategories);
  };

  useEffect(() => {
    // Simulate loading effect
    setLoading(true);
    const timer = setTimeout(() => {
      let filtered = applyFilters();
      let sorted = applySorting(filtered);
      setFilteredFoods(sorted);
      setLoading(false);
    }, 1000); // 1-second loading delay
    return () => clearTimeout(timer);
  }, [category, sortType, foods, search]);

  return (
    <section className="max-padd-container mt-24">
      {/* Search box */}
      <motion.div
        className="w-full max-w-2xl flexCenter"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center justify-center bg-white overflow-hidden w-full rounded-full p-4 px-5 shadow-md">
          <div className="text-lg cursor-pointer">
            <RiSearch2Line />
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search here..."
            className="border-none outline-none w-full text-sm pl-4 bg-transparent placeholder-gray-400"
          />
          <div
            onClick={toggleShowCategories}
            className="flexCenter cursor-pointer text-lg border-l pl-2"
          >
            <LuSettings2 />
          </div>
        </div>
      </motion.div>

      {/* Categories filter */}
      <AnimatePresence>
        {showCategories && (
          <motion.div
            className="my-14"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="h4 mb-4 hidden sm:flex">Categories:</h3>
            <div className="flexCenter sm:flexStart flex-wrap gap-x-12 gap-y-4">
              {categories.map((cat) => (
                <label key={cat.name}>
                  <input
                    value={cat.name}
                    onChange={(e) => toggleFilter(e.target.value, setCategory)}
                    type="checkbox"
                    className="hidden peer"
                  />
                  <div className="flexCenter flex-col gap-2 peer-checked:text-secondary cursor-pointer hover:scale-105 transition-transform">
                    <div className="bg-white h-20 w-20 flexCenter rounded-full overflow-hidden shadow-sm hover:shadow-md">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="object-contain h-12 w-12"
                      />
                    </div>
                    <span className="medium-14">{cat.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Food container */}
      <div className="my-8 mb-20">
        {/* Title and sort */}
        <motion.div
          className="flexBetween !items-start gap-7 flex-wrap pb-16 max-sm:flexCenter text-center max-sm:pb-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Title
            title1={"Our"}
            title2={"Food List"}
            titleStyles={"!pb-0"}
            paraStyles={"!block"}
          />
          <div className="flexCenter gap-x-2">
            <span className="hidden sm:flex medium-16">Sort by:</span>
            <select
              onChange={(e) => setSortType(e.target.value)}
              className="text-sm p-2.5 outline-none bg-white text-gray-30 rounded shadow-sm"
            >
              <option value="relevant">Relevant</option>
              <option value="low">Low</option>
              <option value="high">High</option>
            </select>
          </div>
        </motion.div>

        {/* Foods or loading */}
        {loading ? (
          <div className="flexCenter h-60">
            <motion.div
              className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
            ></motion.div>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 gap-y-12 mt-14 xl:mt-28"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {filteredFoods.length > 0 ? (
              filteredFoods.map((food) => (
                <motion.div
                  key={food._id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <Item food={food} />
                </motion.div>
              ))
            ) : (
              <p className="capitalize text-center w-full col-span-full">
                No foods found for selected filters
              </p>
            )}
          </motion.div>
        )}
      </div>

      <Footer />
    </section>
  );
};

export default Menu;