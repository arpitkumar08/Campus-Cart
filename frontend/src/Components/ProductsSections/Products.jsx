import React from "react";

// Sample data for demonstration
const products = [
  {
    id: 1,
    title: "iPhone 17 Pro Max",
    price: "₹1,10,000",
    location: "LPU Hostel A",
    category: "Electronics",
    image: "/images/mobilePhone.png",
    seller: "John Doe",
  },
  {
    id: 2,
    title: "Engineering Maths Book",
    price: "₹500",
    location: "LPU Hostel B",
    category: "Books",
    image: "/images/book.png",
    seller: "Jane Smith",
  },
  {
    id: 3,
    title: "Men's Blazer",
    price: "₹2,000",
    location: "Chandigarh Uni",
    category: "Clothing",
    image: "/images/blazer.png",
    seller: "Rahul Kumar",
  },
  // Add more products as needed
];

const Products = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black p-6">
      {/* Page Heading */}
      

      {/* Product Grid */}
      <div className="grid gap-8 
      grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 
      max-w-7xl mx-auto">
        {products.map((product) => (
          <div
            key={product.id}
            className="group relative bg-gray-800/40 backdrop-blur-sm rounded-xl 
          border border-gray-700 hover:border-blue-500 
          shadow-md hover:shadow-2xl 
          transition-all duration-300 overflow-hidden"
          >
            {/* Image */}
            <div className="overflow-hidden rounded-t-xl">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-56 object-cover 
              transform group-hover:scale-105 transition duration-500"
              />
            </div>

            {/* Details */}
            <div className="p-4 flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-white group-hover:text-blue-400 transition">
                {product.title}
              </h2>

              <p className="text-blue-400 font-bold">{product.price}</p>

              {/* Location */}
              <p className="text-gray-400 text-sm flex items-center">
                <svg
                  className="w-4 h-4 mr-1 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2C6.686 2 4 4.686 4 8c0 4.418 6 10 6 10s6-5.582 6-10c0-3.314-2.686-6-6-6zM10 10a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
                {product.location}
              </p>

              {/* Category Badge */}
              <span className="inline-block mt-1 px-3 py-1 text-xs 
              bg-gray-700 text-gray-300 rounded-full">
                {product.category}
              </span>

              {/* Seller */}
              <p className="text-gray-500 text-xs mt-2">
                Seller: <span className="text-gray-300">{product.seller}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

};

export default Products;
