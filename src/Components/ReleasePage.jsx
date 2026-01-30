import React from "react";
import { releasesStyles } from "../assets/dummyStyles";
import movies from "../assets/dummyrdata";

const ReleasesPage = () => {
  return (
    <div className={releasesStyles.pageContainer}>
      {/* Header Section with title and subtitle */}
      <div className={releasesStyles.headerContainer}>
        <h1 className={releasesStyles.headerTitle}>RELEASES SOON</h1>
        <p className={releasesStyles.headerSubtitle}>
          Latest Movies • Now Showing
        </p>
      </div>

      {/* Main Grid for displaying movies */}
      <div className={releasesStyles.movieGrid}>
        {movies.map((movie) => (
          <div key={movie.id} className={releasesStyles.movieCard}>
            {/* Movie Poster Image */}
            <div className={releasesStyles.imageContainer}>
              <img
                src={movie.image}
                alt={movie.title}
                className={releasesStyles.movieImage}
              />
            </div>

            {/* Movie details: Title and Category */}
            <div className={releasesStyles.movieInfo}>
              <h3 className={releasesStyles.movieTitle}>{movie.title}</h3>
              <p className={releasesStyles.movieCategory}>{movie.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReleasesPage;