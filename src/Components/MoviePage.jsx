import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { moviesPageStyles } from '../assets/dummyStyles'
import MOVIES from '../assets/dummymdata'

const MoviesPage = () => {
  // Logic States
  const [activeCategory, setActiveCategory] = useState('all');
  const [showAll, setShowAll] = useState(false);

  // Filter logic based on selected category
  const filteredMovies = activeCategory === 'all'
    ? MOVIES
    : MOVIES.filter(movie => movie.category === activeCategory);

  const COLLAPSE_COUNT = 12;

  // Reset showAll when category changes
  useEffect(() => {
    setShowAll(false);
  }, [activeCategory]);

  // Determine which movies to display
  const visibleMovies = showAll ? filteredMovies : filteredMovies.slice(0, COLLAPSE_COUNT);

  const categories = [
    { id: 'all', name: 'All Movies' },
    { id: 'action', name: 'Action' },
    { id: 'horror', name: 'Horror' },
    { id: 'comedy', name: 'Comedy' },
    { id: 'adventure', name: 'Adventure' }
  ];

  return (
    <div className={moviesPageStyles.container}>
      {/* Categories Selection Section */}
      <section className={moviesPageStyles.categoriesSection}>
        <div className={moviesPageStyles.categoriesContainer}>
          <div className={moviesPageStyles.categoriesFlex}>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`${moviesPageStyles.categoryButton.base} ${activeCategory === category.id
                    ? moviesPageStyles.categoryButton.active
                    : moviesPageStyles.categoryButton.inactive
                  }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Movies Grid Section */}
      <section className={moviesPageStyles.moviesSection}>
        <div className={moviesPageStyles.moviesContainer}>
          <div className={moviesPageStyles.moviesGrid}>
            {visibleMovies.map((movie) => (
              <Link
                key={movie.id}
                to={`/movies/${movie.id}`}
                state={{ movie }}
                className={moviesPageStyles.movieCard}
              >
                <div className={moviesPageStyles.movieImageContainer}>
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className={moviesPageStyles.movieImage}
                  />
                </div>
                
                {/* Movie Info Section */}
                <div className={moviesPageStyles.movieInfo}>
                  <h3 className={moviesPageStyles.movieTitle}>{movie.title}</h3>
                  <p className={moviesPageStyles.movieCategory}>{movie.category}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Show More / Show Less Button */}
          {filteredMovies.length > COLLAPSE_COUNT && (
            <div className={moviesPageStyles.showMoreContainer}>
              <button
                onClick={() => setShowAll((prev) => !prev)}
                className={moviesPageStyles.showMoreButton}
              >
                {showAll
                  ? "Show Less"
                  : `Show More (${filteredMovies.length - COLLAPSE_COUNT} more)`}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MoviesPage;