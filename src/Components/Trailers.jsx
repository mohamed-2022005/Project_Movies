import React, { useEffect, useRef, useState } from "react";
import { trailersStyles, trailersCSS } from "../assets/dummyStyles";
import { trailersData } from "../assets/trailerdata";
import {
    ChevronLeft,
    ChevronRight,
    Clapperboard,
    X,
    Play,
    Clock,
    Calendar
} from "lucide-react";

const Trailers = () => {
    // --- State Management ---
    const [featuredTrailer, setFeaturedTrailer] = useState(trailersData[0]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted] = useState(false);
    const videoRef = useRef(null);
    const carouselRef = useRef(null);

    useEffect(() => {
        // Initial setup if needed
    }, []);


    // Handles horizontal scrolling for the trailers carousel
    const scroll = (direction) => {
        if (carouselRef.current) {
            const scrollAmount = direction === "left" ? -280 : 280;
            carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    // Updates the main player with the selected trailer and centers it in the list
    const selectTrailer = (trailer) => {
        setFeaturedTrailer(trailer);
        setIsPlaying(false);
        try {
            if (videoRef.current) videoRef.current.currentTime = 0;
        } catch (e) { /* ignore */ }

        if (carouselRef.current) {
            const el = carouselRef.current.querySelector(`[data-id='${trailer.id}']`);
            if (el) {
                const rect = el.getBoundingClientRect();
                const parentRect = carouselRef.current.getBoundingClientRect();
                const offset = rect.left - parentRect.left - parentRect.width / 2 + rect.width / 2;
                carouselRef.current.scrollBy({ left: offset, behavior: "smooth" });
            }
        }
    };

    const togglePlay = () => setIsPlaying((s) => !s);

    // Converts standard video links to embeddable formats for the iframe
    const getEmbedBaseUrl = (videoUrl) => {
        if (!videoUrl) return "";
        try {
            const url = new URL(videoUrl);
            const host = url.hostname.replace("www.", "").toLowerCase();

            if (host.includes("youtube.com")) {
                const vid = url.searchParams.get("v");
                return vid ? `https://www.youtube.com/embed/${vid}` : videoUrl;
            }
            if (host === "youtu.be") {
                return `https://www.youtube.com/embed/${url.pathname.replace("/", "")}`;
            }
            if (host.includes("vimeo.com")) {
                const id = url.pathname.split("/").filter(Boolean).pop();
                return `https://player.vimeo.com/video/${id}`;
            }
            return videoUrl; 
        } catch (e) {
            return videoUrl || "";
        }
    };

    const buildIframeSrc = (videoUrl) => {
        const base = getEmbedBaseUrl(videoUrl);
        if (!base) return "";
        const sep = base.includes("?") ? "&" : "?";
        return `${base}${sep}autoplay=1&mute=${isMuted ? 1 : 0}&rel=0`;
    };

    return (
        <div className={trailersStyles.container} style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "40px 0" }}>
            <main className={trailersStyles.main}>
                {/* Fixed layout container with max-width and centering */}
                <div className={trailersStyles.layout} style={{ display: "flex", justifyContent: "center", gap: "32px", maxWidth: "1400px", margin: "0 auto" }}>

                    {/* --- Left Side Panel: Features Carousel and Trending List --- */}
                    <div 
                        className={trailersStyles.leftSide}
                        style={{ 
                            backgroundColor: "#ffffff", 
                            borderRadius: "24px", 
                            padding: "32px", 
                            boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
                            height: "fit-content",
                            flex: "0 0 350px" 
                        }}
                    >
                        <div className={trailersStyles.leftCard}>
                            <h2 className={trailersStyles.leftTitle} style={{ fontFamily: "Monoton, cursive", display: "flex", alignItems: "center", gap: "10px" }}>
                                <Clapperboard className={trailersStyles.titleIcon} color="#e11d48" />
                                Latest Trailers
                            </h2>

                            <div className={trailersStyles.carouselControls}>
                                <div className={trailersStyles.controlButtons}>
                                    <button onClick={() => scroll("left")} className={trailersStyles.controlButton}>
                                        <ChevronLeft size={18} />
                                    </button>
                                    <button onClick={() => scroll("right")} className={trailersStyles.controlButton}>
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                                <span className={trailersStyles.trailerCount} style={{ color: "#6b7280" }}>
                                    {trailersData.length} trailers
                                </span>
                            </div>
                        </div>

                        {/* Trailers Selection Carousel */}
                        <div ref={carouselRef} className={trailersStyles.carousel} style={{ scrollbarWidth: "none", msOverflowStyle: "none", marginTop: "20px" }}>
                            {trailersData.map((trailer) => (
                                <div
                                    key={trailer.id}
                                    data-id={trailer.id}
                                    className={`${trailersStyles.carouselItem.base} ${featuredTrailer.id === trailer.id ? trailersStyles.carouselItem.active : trailersStyles.carouselItem.inactive}`}
                                    style={{ width: "220px", height: "124px", minWidth: "220px", cursor: "pointer", borderRadius: "12px", overflow: "hidden" }}
                                    onClick={() => selectTrailer(trailer)}
                                >
                                    <img src={trailer.thumbnail} alt={trailer.title} className={trailersStyles.carouselImage} loading="lazy" />
                                    <div className={trailersStyles.carouselOverlay}>
                                        <h3 className={trailersStyles.carouselTitle}>{trailer.title}</h3>
                                        <p className={trailersStyles.carouselGenre}>{trailer.genre}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Trending Section: Displays top picks --- */}
                        <div className={trailersStyles.trendingSection} style={{ marginTop: "40px" }}>
                            <h3 className={trailersStyles.trendingTitle} style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "20px" }}>Now Trending</h3>
                            {trailersData.slice(0, 3).map((trailer) => (
                                <div key={trailer.id} onClick={() => selectTrailer(trailer)} className={trailersStyles.trendingItem} style={{ display: "flex", gap: "15px", marginBottom: "20px", cursor: "pointer" }}>
                                    <div className={trailersStyles.trendingImage} style={{ width: "60px", height: "60px", borderRadius: "10px", overflow: "hidden" }}>
                                        <img src={trailer.thumbnail} alt={trailer.title} className={trailersStyles.trendingImageSrc} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    </div>
                                    <div className={trailersStyles.trendingContent}>
                                        <h4 className={trailersStyles.trendingItemTitle} style={{ fontWeight: "600", fontSize: "0.95rem" }}>{trailer.title}</h4>
                                        <p className={trailersStyles.trendingItemGenre} style={{ fontSize: "0.8rem", color: "#6b7280" }}>{trailer.genre}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- Right Side Panel: Main Video Player and Content Details --- */}
                    <div className={trailersStyles.rightSide} style={{ flex: "1", maxWidth: "850px" }}>
                        <div className={trailersStyles.rightCard}>
                            <div className={trailersStyles.videoContainer} style={{ borderRadius: "20px", overflow: "hidden" }}>
                                {isPlaying ? (
                                    <div className={trailersStyles.videoWrapper}>
                                        <iframe
                                            className={trailersStyles.videoIframe}
                                            src={buildIframeSrc(featuredTrailer.videoUrl)}
                                            title={featuredTrailer.title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            ref={videoRef}
                                        />
                                        <div className={trailersStyles.closeButton}>
                                            <button onClick={() => setIsPlaying(false)} className={trailersStyles.closeButtonInner}>
                                                <X size={28} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={trailersStyles.thumbnailContainer} style={{ position: "relative" }}>
                                        <img src={featuredTrailer.thumbnail} alt={featuredTrailer.title} className={trailersStyles.thumbnailImage} style={{ width: "100%", borderRadius: "20px" }} />
                                        <div className={trailersStyles.playButtonContainer}>
                                            <button onClick={togglePlay} className={trailersStyles.playButton}>
                                                <Play size={45} fill="white" color="white" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Detailed Information about the active trailer */}
                            <div className={trailersStyles.trailerInfo} style={{ marginTop: "25px" }}>
                                <div className={trailersStyles.infoHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <h2 className={trailersStyles.trailerTitle} style={{ fontSize: "2rem", fontWeight: "800" }}>{featuredTrailer.title}</h2>
                                    <div className={trailersStyles.trailerMeta} style={{ display: "flex", gap: "15px", color: "#6b7280" }}>
                                        <span className={trailersStyles.metaItem}><Clock size={16} /> {featuredTrailer.duration}</span>
                                        <span className={trailersStyles.metaItem}><Calendar size={16} /> {featuredTrailer.year}</span>
                                    </div>
                                </div>

                                <div className={trailersStyles.genreContainer} style={{ display: "flex", gap: "10px", margin: "15px 0" }}>
                                    {featuredTrailer.genre.split(",").map((g, i) => (
                                        <span key={i} className={trailersStyles.genreTag} style={{ backgroundColor: "#fee2e2", color: "#ef4444", padding: "4px 12px", borderRadius: "20px", fontSize: "0.85rem" }}>
                                            {g.trim()}
                                        </span>
                                    ))}
                                </div>

                                <p className={trailersStyles.description} style={{ color: "#4b5563", lineHeight: "1.6" }}>{featuredTrailer.description}</p>

                                {/* Cast and Crew Credits Section */}
                                <div className={trailersStyles.credits} style={{ marginTop: "30px" }}>
                                    <h3 className={trailersStyles.creditsTitle} style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "20px" }}>Credits</h3>
                                    <div className={trailersStyles.creditsGrid} style={{ display: "flex", gap: "30px" }}>
                                        {featuredTrailer.credits && Object.entries(featuredTrailer.credits).map(([role, person]) => (
                                            <div key={role} className={trailersStyles.creditItem} style={{ textAlign: "center" }}>
                                                <div className={trailersStyles.creditImage} style={{ width: "65px", height: "65px", borderRadius: "50%", overflow: "hidden", margin: "0 auto 10px" }}>
                                                    <img src={person.image} alt={person.name} className={trailersStyles.creditImageSrc} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                </div>
                                                <div className={trailersStyles.creditName} style={{ fontWeight: "600", fontSize: "0.9rem" }}>{person.name}</div>
                                                <div className={trailersStyles.creditRole} style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{role}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
            <style jsx>{trailersCSS}</style>
        </div>
    );
};

export default Trailers;