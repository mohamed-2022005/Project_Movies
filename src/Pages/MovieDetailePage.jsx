import React, { useState, useMemo, useEffect } from 'react'
    import { useParams, useNavigate, Link } from 'react-router-dom'
    import { movieDetailStyles, movieDetailCSS, movieDetailHStyles } from '../assets/dummyStyles'
    import movies from '../assets/dummymdata';
    import { toast } from 'react-toastify';
    import { X, ArrowLeft, Star, Clock, Play, Calendar, User } from 'lucide-react';

    /**
     * Fallback component for cast members without images
     */
    const FallbackAvatar = ({ className = "w-12 h-12" }) => (
        <div className={`${className} bg-gray-700 rounded-full flex items-center justify-center text-sm text-gray-300`}>?</div>
    );

    /**
     * Utility to extract YouTube Video ID from various URL formats
     */
    function extractYouTubeId(urlOrId) {
        if (!urlOrId) return null;
        if (/^[A-Za-z0-9_-]{11}$/.test(urlOrId)) return urlOrId;
        const re = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|.*[&?]v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
        const m = urlOrId.match(re);
        return m ? m[1] : null;
    }

    const getEmbedUrl = (id) =>
        id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1` : null;

    /**
     * Helpers for Date and Time formatting based on TimeZone
     */
    const getParts = (datelike, timeZone) => {
        const dt = typeof datelike === "string" ? new Date(datelike) : datelike;
        const parts = new Intl.DateTimeFormat("en", {
            timeZone,
            year: "numeric", month: "2-digit", day: "2-digit",
            hour: "2-digit", minute: "2-digit", hour12: true,
        }).formatToParts(dt);
        const map = {};
        for (const p of parts) { if (p.type !== "literal") map[p.type] = p.value; }
        map.dayPeriod = map.dayPeriod || map.ampm;
        return map;
    };

    const formatDateKey = (datelike, timeZone = "Asia/Kolkata") => {
        const p = getParts(datelike, timeZone);
        return `${p.year}-${p.month}-${p.day}`;
    };

    const formatTimeInTZ = (datelike, timeZone = "Asia/Kolkata") => {
        const p = getParts(datelike, timeZone);
        return `${String(Number(p.hour))}:${p.minute} ${String(p.dayPeriod || "").toUpperCase()}`;
    };

    const MovieDetailPage = () => {
        const { id } = useParams();
        const movie = useMemo(() => movies.find((m) => m.id === Number(id)), [id]);
        const navigate = useNavigate();

        // States for trailer modal and showtime selection
        const [showTrailer, setShowTrailer] = useState(false);
        const [selectedTrailerId, setSelectedTrailerId] = useState(null);
        const [selectedDay, setSelectedDay] = useState(0);
        const [selectedTime, setSelectedTime] = useState(null);

        // Grouping movie slots by date
        const showtimeDays = useMemo(() => {
            if (!movie) return [];
            const TZ = "Asia/Kolkata";
            const slotsByDate = {};
            (movie.slots || []).forEach((slot) => {
                const iso = slot.time || slot.datetime || slot;
                const d = new Date(iso);
                if (isNaN(d.getTime())) return;
                const key = formatDateKey(d, TZ);
                if (!slotsByDate[key]) slotsByDate[key] = [];
                slotsByDate[key].push({ iso });
            });
            return Object.keys(slotsByDate).sort().map((key) => {
                const d = new Date(key);
                return {
                    date: key,
                    shortDay: new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: TZ }).format(d),
                    dateStr: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: TZ }).format(d),
                    showtimes: slotsByDate[key].map(s => ({ time: formatTimeInTZ(s.iso, TZ), datetime: s.iso }))
                };
            });
        }, [movie]);

        // --- التعديل هنا: دالة الانتقال لصفحة حجز الكراسي ---
        const handleTimeSelect = (datetime) => {
            setSelectedTime(datetime);
            const encodedSlot = encodeURIComponent(datetime);
            navigate(`/movies/${id}/seat-selector/${encodedSlot}`);
        };

        if (!movie) return <div className="text-white p-10">Movie not found.</div>;

        return (
            <div className={movieDetailStyles.container}>
                <style>{movieDetailCSS}</style>

                {/* Trailer Modal Overlay  */}
                {showTrailer && (
                    <div className={movieDetailStyles.modalOverlay} onClick={() => setShowTrailer(false)}>
                        <div className={movieDetailStyles.modalContainer}
                            style={{
                                maxWidth: '850px',
                                height: 'auto',
                                aspectRatio: '16/9',
                                margin: 'auto'
                            }}
                            onClick={e => e.stopPropagation()}>
                            <button onClick={() => setShowTrailer(false)} className={movieDetailStyles.closeButton}><X size={36} /></button>
                            <iframe width="100%" height="100%" src={getEmbedUrl(selectedTrailerId)} frameBorder="0" allowFullScreen title="trailer" />
                        </div>
                    </div>
                )}

                <div className={movieDetailStyles.wrapper}>
                    {/* Header with Back Button */}
                    <div className={movieDetailStyles.header}>
                        <Link to="/movies" className={movieDetailStyles.backButton}><ArrowLeft size={18} /> Back</Link>
                    </div>

                    <h1 className={movieDetailStyles.movieTitle} style={{ fontFamily: "'Cinzel', serif" }}>{movie.title}</h1>

                    {/* Movie Info Tags */}
                    <div className={movieDetailStyles.movieMeta}>
                        <span className={movieDetailStyles.metaItem}><Star size={16} color="gold" /> {movie.rating}/10</span>
                        <span className={movieDetailStyles.metaItem}><Clock size={16} /> {movie.duration}</span>
                        <span className={movieDetailStyles.genreTag}>{movie.genre}</span>
                    </div>

                    {/* MAIN CONTENT AREA: Poster (Left) and Details (Right) */}
                    <div className="flex flex-col md:flex-row gap-8 mt-8 items-stretch">

                        {/* LEFT COLUMN: Large Poster with Background Wrapper */}
                        <div className="flex flex-col" style={{ flex: "0 0 400px" }}>
                            <div style={{
                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                                borderRadius: "16px",
                                padding: "20px",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
                            }}>
                                <img src={movie.image} alt={movie.title} style={{
                                    width: "100%",
                                    flexGrow: 1,
                                    objectFit: "cover",
                                    borderRadius: "12px",
                                    minHeight: "500px"
                                }} />
                                <button onClick={() => {
                                    const vId = extractYouTubeId(movie.trailerUrl || movie.trailer);
                                    setSelectedTrailerId(vId);
                                    setShowTrailer(true);
                                }} className={movieDetailStyles.trailerButton} style={{ width: "100%", marginTop: "20px" }}>
                                    <Play size={18} /> Watch Trailer
                                </button>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Showtimes and Cast */}
                        <div className={movieDetailStyles.rightColumns} style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>

                            {/* SHOWTIMES SECTION */}
                            <div className={movieDetailStyles.showtimesCard}>
                                <h3 className={movieDetailStyles.showtimesTitle} style={{ fontFamily: "'Cinzel', serif" }}>
                                    <Calendar size={20} /> Showtimes
                                </h3>
                                <div className={movieDetailStyles.daySelection}>
                                    {showtimeDays.map((day, index) => (
                                        <button key={day.date} onClick={() => setSelectedDay(index)}
                                            className={`${movieDetailStyles.dayButton.base} ${selectedDay === index ? movieDetailStyles.dayButton.active : movieDetailStyles.dayButton.inactive}`}>
                                            <div className={movieDetailStyles.dayName}>{day.shortDay}</div>
                                            <div className={movieDetailStyles.dayDate}>{day.dateStr}</div>
                                        </button>
                                    ))}
                                </div>
                                <div className={movieDetailStyles.showtimesGrid}>
                                    {showtimeDays[selectedDay]?.showtimes.map((st, idx) => (
                                        /* --- التعديل هنا: ربط الزرار بدالة الـ Navigate --- */
                                        <button key={idx} onClick={() => handleTimeSelect(st.datetime)}
                                            className={`${movieDetailStyles.timeButton.base} ${selectedTime === st.datetime ? movieDetailStyles.timeButton.active : movieDetailStyles.timeButton.inactive}`}>
                                            {st.time}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* CAST SECTION */}
                            <div className={movieDetailStyles.castCard} style={{ flexGrow: 1 }}>
                                <h3 className={movieDetailStyles.castTitle} style={{ fontFamily: "'Cinzel', serif" }}>
                                    <User size={20} /> Cast
                                </h3>
                                <div className={movieDetailStyles.castGrid}>
                                    {movie.cast?.map((c, idx) => (
                                        <div key={idx} className={movieDetailStyles.castItem}>
                                            <div className={movieDetailStyles.castImageContainer}>
                                                <img src={c.img || "https://via.placeholder.com/80"} alt={c.name} className={movieDetailStyles.castImage} />
                                            </div>
                                            <div className={movieDetailStyles.castName}>{c.name}</div>
                                            <div className={movieDetailStyles.castRole}>{c.role}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BOTTOM SECTION: Full Width Story Card */}
                    <div className={movieDetailStyles.storyCard} style={{ marginTop: '2rem', width: '100%' }}>
                        <h2 className={movieDetailStyles.storyTitle} style={{ textAlign: 'center', fontFamily: "'Cinzel', serif" }}>Story</h2>
                        <p className={movieDetailStyles.storyText} style={{ textAlign: 'center', maxWidth: '900px', margin: '15px auto 0', fontSize: '1.1rem', lineHeight: '1.6' }}>
                            {movie.synopsis || "No story available for this movie."}
                        </p>
                    </div>

                    <div className={movieDetailHStyles.crewGrid}>
                        {/* Director */}
                        <div className={movieDetailStyles.crewCard}>
                            <div className={movieDetailStyles.crewHeader}>
                                <User className={movieDetailStyles.crewIcon} />
                                <h3
                                    className={movieDetailStyles.crewTitle}
                                    style={{ fontFamily: "'Cinzel', serif" }}
                                >
                                    Director
                                </h3>
                            </div>
                            <div className={movieDetailStyles.crewContent}>
                                {(() => {
                                    const directors = Array.isArray(movie.director)
                                        ? movie.director
                                        : movie.director
                                            ? [movie.director]
                                            : [];

                                    return (
                                        <div className={movieDetailStyles.crewImageGrid}>
                                            {directors.length ? (
                                                /* شلت الـ slice(0, 2) عشان يظهرهم كلهم لو Fighter فيها أكتر */
                                                directors.map((d, i) => (
                                                    <div key={i} className="flex flex-col items-center">
                                                        {d?.img ? (
                                                            <img
                                                                src={d.img}
                                                                alt={d.name || `Director ${i + 1}`}
                                                                className={movieDetailStyles.crewImage}
                                                                onError={(e) => {
                                                                    e.currentTarget.onerror = null;
                                                                    e.currentTarget.src =
                                                                        "https://via.placeholder.com/96?text=D";
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className={movieDetailStyles.fallbackAvatar}>?</div>
                                                        )}
                                                        <div className={movieDetailStyles.crewName}>
                                                            {d?.name ?? "N/A"}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <div className={movieDetailStyles.fallbackAvatar}>?</div>
                                                    <div className={movieDetailStyles.crewName}>N/A</div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* Producer */}
                        <div className={movieDetailStyles.crewCard}>
                            <div className={movieDetailStyles.crewHeader}>
                                <User className={movieDetailStyles.crewIcon} />
                                <h3
                                    className={movieDetailStyles.crewTitle}
                                    style={{ fontFamily: "'Cinzel', serif" }}
                                >
                                    Producer
                                </h3>
                            </div>
                            <div className={movieDetailStyles.crewContent}>
                                {movie.producer?.img ? (
                                    <img
                                        src={movie.producer.img}
                                        alt={movie.producer.name}
                                        className={movieDetailStyles.crewImage}
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = "https://via.placeholder.com/96?text=P";
                                        }}
                                    />
                                ) : (
                                    <FallbackAvatar className="w-20 h-20 sm:w-24 sm:h-24 mb-3 sm:mb-4" />
                                )}
                                <div className={movieDetailStyles.crewName}>
                                    {movie.producer?.name ?? "N/A"}
                                </div>
                            </div>
                        </div>
                    </div>

                    <style jsx>{movieDetailCSS}</style>
                </div>
            </div>
        );
    };

    export default MovieDetailPage;