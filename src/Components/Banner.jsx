import React from "react";
import Video from "../assets/MovieBannerVideo.mp4";
import { bannerStyles } from "../assets/dummyStyles"; 
import { Info, Star, Tickets } from "lucide-react";

const Banner = () => {
  return (
    <div className={bannerStyles.container}>
      {/* Background Video Layer */}
      <div className={bannerStyles.videoContainer}>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className={bannerStyles.video}
          style={{ filter: 'grayscale(100%)' }}
        >
          <source src={Video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Visual Overlay */}
      <div className={bannerStyles.overlay}></div>

      {/* Main Content Aligned with Navbar */}
      <div className={bannerStyles.content}>
        <div className={bannerStyles.contentInner}>
          
          {/* Movie Title */}
          <h1 
            className={bannerStyles.title} 
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            Ocean's Legacy
          </h1>

          {/* Movie Description */}
          <p className={bannerStyles.description}>
            An epic adventure beneath the waves. Explore the mysteries of the
            deep ocean and discover treasures beyond imagination in this
            breathtaking cinematic experience.
          </p>

          {/* Horizontal Meta Row (Stars, Rating, Genre) */}
          <div className="flex items-center gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className="w-4 h-4 fill-yellow-400 text-yellow-400" 
                    aria-hidden="true" 
                  />
                ))}
              </div>
              <span className="text-white font-semibold">4.8/5</span>
            </div>

            {/* Vertical Separator and Genres */}
            <div className="text-white/60 text-sm border-l border-white/20 pl-6">
              Adventure • Fantasy • Drama
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className={bannerStyles.buttonsContainer}>
            <a href="/movies" className={bannerStyles.bookButton}>
              <Tickets className={bannerStyles.icon} fill="white" />
              Book Movies
            </a>

            <a href="/contact" className={bannerStyles.infoButton}>
              <Info className={bannerStyles.icon} />
              More Info
            </a>
          </div>

        </div>
      </div>
      
      {/* Injecting your custom styles if needed */}
      <style>{bannerStyles.customCSS}</style>
    </div>
  );
};

export default Banner;