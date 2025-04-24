import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHeart, FaShoppingCart, FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [likedItems, setLikedItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      setAuthenticated(true);
    }
    
    // Fetch products
    fetch('https://fakestoreapi.com/products')
      .then(response => response.json())
      .then(data => setProducts(data));
  }, [navigate]);

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'All' || product.category === selectedCategory) &&
    product.price <= maxPrice
  );

  const toggleLike = (id) => {
    setLikedItems(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const addToCart = (product) => {
    setCart(prev => [...prev, product]);
  };

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

      <nav style={styles.navbar}>
        <h1 style={styles.heading}>🛍️ Explore Our Collections</h1>
        <div style={styles.searchContainer}>
          <FaSearch style={styles.icon} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchBar}
          />
        </div>
        <div style={styles.navIcons}>
          <FaHeart style={styles.navIcon} /> {likedItems.length}
          <FaShoppingCart style={styles.navIcon} /> {cart.length}
        </div>
        <button style={styles.filterBtn} onClick={() => setFilterVisible(!filterVisible)}>
          <FaFilter /> Filters
        </button>
      </nav>

      {filterVisible && (
        <div style={styles.sidebar}>
          <h3>Filter By:</h3>
          <label>Category:</label>
          <select onChange={(e) => setSelectedCategory(e.target.value)} style={styles.select}>
            <option>All</option>
            <option>electronics</option>
            <option>jewelery</option>
            <option>men's clothing</option>
            <option>women's clothing</option>
          </select>
          <label>Max Price: ${maxPrice}</label>
          <input
            type="range"
            min="0"
            max="1000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            style={styles.slider}
          />
        </div>
      )}

      <div style={styles.grid}>
        {filteredProducts.map((product) => (
          <div key={product.id} style={styles.card} onClick={() => setSelectedProduct(product)}>
            <FaHeart
              style={{ ...styles.likeBtn, color: likedItems.includes(product.id) ? 'red' : 'gray' }}
              onClick={(e) => { e.stopPropagation(); toggleLike(product.id); }}
            />
            <img src={product.image} alt={product.title} style={styles.image} />
            <h2 style={styles.title}>{product.title}</h2>
            <p style={styles.price}>${product.price.toFixed(2)}</p>
            <button style={styles.cartBtn} onClick={(e) => { e.stopPropagation(); addToCart(product); }}>
              <FaShoppingCart /> Add to Cart
            </button>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div style={styles.modalOverlay} onClick={() => setSelectedProduct(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setSelectedProduct(null)}>
              <FaTimes />
            </button>
            <img src={selectedProduct.image} alt={selectedProduct.title} style={styles.modalImage} />
            <h2>{selectedProduct.title}</h2>
            <p>{selectedProduct.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '20px auto',
    padding: '20px',
    textAlign: 'center',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    position: 'absolute',
    top: '20px',
    left: '20px',
    background: 'transparent',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    color: '#ff6600',
    fontWeight: 'bold',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#fff',
    boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
    borderRadius: '10px',
    marginBottom: '20px',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: '8px',
    padding: '5px 10px',
  },
  icon: {
    marginRight: '5px',
  },
  searchBar: {
    border: 'none',
    background: 'transparent',
    outline: 'none',
    padding: '5px',
  },
  filterBtn: {
    padding: '8px 12px',
    border: 'none',
    backgroundColor: '#ff6600',
    color: '#fff',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  sidebar: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  select: {
    width: '100%',
    padding: '8px',
    borderRadius: '5px',
  },
  slider: {
    width: '100%',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    justifyContent: 'center',
  },
  card: {
    position: 'relative',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    transition: 'transform 0.3s ease-in-out',
    cursor: 'pointer',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'contain',
    backgroundColor: '#f5f5f5',
    borderRadius: '10px',
    padding: '10px',
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#333',
    marginTop: '10px',
  },
  price: {
    fontSize: '1rem',
    color: '#ff6600',
    fontWeight: 'bold',
  },
  cartBtn: {
    padding: '10px 15px',
    fontSize: '1rem',
    color: '#fff',
    background: '#ff6600',
    border: 'none',
    borderRadius: '8px',
    transition: 'background 0.3s ease',
    cursor: 'pointer',
  },
  likeBtn: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    fontSize: '1.5rem',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    maxWidth: '400px',
    width: '90%',
    position: 'relative',
  },
  modalImage: {
    width: '100%',
    height: '200px',
    objectFit: 'contain',
    borderRadius: '10px',
  },
  closeBtn: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'transparent',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
  },
};

export default Products;
