import React from "react";

const Item = ({ food }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Image wrapper with fixed ratio */}
      <div className="w-full h-40 flex items-center justify-center bg-gray-100 overflow-hidden">
        <img
          src={food.image}
          alt={food.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-semibold text-gray-800 line-clamp-1">{food.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{food.description}</p>
        <p className="font-bold text-secondary mt-2">
          ${Object.values(food.price)[0]}
        </p>
      </div>
    </div>
  );
};

export default Item;