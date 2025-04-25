import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const categoryImages = {
    electronics: 'https://cdn.pixabay.com/photo/2023/08/24/07/46/headphones-8210087_1280.jpg',
    jewelery: 'https://cdn.pixabay.com/photo/2017/08/23/15/49/rings-2673268_1280.jpg',
    "men's clothing": 'https://cdn.pixabay.com/photo/2025/02/14/01/43/men-9405485_1280.jpg',
    "women's clothing": 'https://cdn.pixabay.com/photo/2017/09/18/19/16/fashion-2762865_1280.jpg',
  };

  useEffect(() => {
    fetch('https://fakestoreapi.com/products/categories')
      .then(response => response.json())
      .then(data => setCategories(data));
  }, []);

  const handleExploreClick = () => {
    navigate('/login');
  };

  return (
    <div className="home-container">
      <nav className="navbar navbar-expand-lg navbar-dark bg-transparent position-absolute w-100 z-3">
        <div className="container">
          <Link className="navbar-brand fw-bold text-black" to="/">ShopMate</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link text-black" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-black" to="/products">Products</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-black" to="/signup">Sign Up</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-black" to="/login">Login</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <header className="hero-section text-white py-5" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1512436991641-6745cdb1723f)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <div className="text-center bg-dark bg-opacity-50 p-5 rounded">
          <h1 className="display-4 fw-bold">Discover Unique Styles</h1>
          <p className="lead">Explore our exclusive range of categories to find your next favorite item.</p>
          <button onClick={handleExploreClick} className="btn btn-light btn-lg">Explore</button>
        </div>
      </header>

      <section className="featured-categories py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 text-primary">Featured Categories</h2>
          <div className="row g-4 justify-content-center">
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <div key={index} className="col-md-4 col-sm-6">
                  <div className="card shadow-sm h-100">
                    <img
                      src={categoryImages[category] || 'https://via.placeholder.com/400x250'} 
                      className="card-img-top"
                      alt={category}
                    />
                    <div className="card-body text-center">
                      <h5 className="card-title text-capitalize">{category}</h5>
                      <p className="card-text">Check out the best deals in {category}.</p>
                      <button onClick={handleExploreClick} className="btn btn-primary">Explore</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">Loading categories...</p>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-dark text-white py-4">
        <div className="container text-center">
          <p className="mb-2">&copy; 2025 ShopMate. All rights reserved.</p>
          <div>
            <Link to="/about" className="text-white me-3">About</Link>
            <Link to="/contact" className="text-white me-3">Contact</Link>
            <Link to="/privacy" className="text-white">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
