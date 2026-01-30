import React, { useEffect, useMemo, useState } from 'react'; 
import { movieDetailHStyles } from '../assets/dummyStyles';
import movies from '../assets/dummymoviedata';
import { useLocation, useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { X, ArrowLeft, Star, Clock, Play, Calendar, User, Users } from 'lucide-react';

const ROWS = [
    { id: "A", type: "standard", count: 8 },
    { id: "B", type: "standard", count: 8 },
    { id: "C", type: "standard", count: 8 },
    { id: "D", type: "recliner", count: 8 },
    { id: "E", type: "recliner", count: 8 },
];

const TOTAL_SEATS = ROWS.reduce((s, r) => s + r.count, 0);

const FallbackAvatar = ({ className = "w-12 h-12", alt = "avatar" }) => (
    <div className={`${className} bg-gray-700 rounded-full flex items-center justify-center text-sm text-gray-300`} aria-hidden="true">
        ?
    </div>
);

function extractYouTubeId(urlOrId) {
    if (!urlOrId) return null;
    if (/^[A-Za-z0-9_-]{11}$/.test(urlOrId)) return urlOrId;
    const re = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|.*[&?]v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
    const m = urlOrId.match(re);
    return m ? m[1] : null;
}

const getEmbedUrl = (id) => id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1` : null;

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

const MovieDetailPageHome = () => {
    const { id } = useParams();
    const movie = useMemo(() => movies.find((m) => m.id === Number(id)), [id]);
    const navigate = useNavigate();
    const location = useLocation();

    const [showTrailer, setShowTrailer] = useState(false);
    const [selectedTrailerId, setSelectedTrailerId] = useState(null);
    const [selectedDay, setSelectedDay] = useState(0);
    const [selectedTime, setSelectedTime] = useState(null);

    useEffect(() => {
        if (!movie) toast.error("Movie not found");
    }, [movie]);

    const showtimeDays = useMemo(() => {
        if (!movie) return [];
        const TZ = "Asia/Kolkata";
        const slotsByDate = {};
        (movie.slots || []).forEach((raw) => {
            let iso = raw?.time || raw;
            let audi = raw?.audi || "Audi 1";
            const d = new Date(iso);
            if (Number.isNaN(d.getTime())) return;
            const dateKey = formatDateKey(d, TZ);
            if (!slotsByDate[dateKey]) slotsByDate[dateKey] = [];
            slotsByDate[dateKey].push({ iso, audi });
        });
        return Object.keys(slotsByDate).map(dateKey => {
            const d = new Date(dateKey);
            return {
                date: dateKey,
                shortDay: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
                dateStr: d.toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
                showtimes: slotsByDate[dateKey].map(s => ({
                    time: formatTimeInTZ(s.iso, TZ),
                    datetime: s.iso,
                    audi: s.audi
                }))
            };
        });
    }, [movie]);

    if (!movie) return <div className={movieDetailHStyles.notFoundContainer}><h2>Movie not found.</h2></div>;

    const openTrailer = (movieObj) => {
        const videoId = extractYouTubeId(movieObj.trailerUrl || movieObj.trailer);
        if (videoId) { setSelectedTrailerId(videoId); setShowTrailer(true); }
        else toast.error("Trailer not available");
    };

    const buildSeatSelectorPath = (movieIdParam, datetime) => {
        const key = encodeURIComponent(datetime);
        const pathLower = (location.pathname || "").toLowerCase();
        return pathLower.includes('/movie/') ? `/movie/${movieIdParam}/seat-selector/${key}` : `/movies/${movieIdParam}/seat-selector/${key}`;
    };

    const handleTimeSelect = (datetime) => {
        setSelectedTime(datetime);
        navigate(buildSeatSelectorPath(movie.id, datetime));
    };

    // Helper function to render Director(s)
    const renderDirectors = () => {
        const directors = Array.isArray(movie.director) ? movie.director : [movie.director];
        return (
            <div className={movieDetailHStyles.crewCard}>
                <div className={movieDetailHStyles.crewTitle}><User size={20} /> <h3>Director{directors.length > 1 ? 's' : ''}</h3></div>
                <div className="flex flex-wrap justify-center gap-6 mt-4">
                    {directors.map((dir, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                            {dir?.img ? (
                                <img src={dir.img} alt={dir.name} className="w-20 h-20 rounded-full object-cover mb-2 border-2 border-amber-500/30" />
                            ) : (
                                <FallbackAvatar className="w-20 h-20 mb-2" />
                            )}
                            <div className={movieDetailHStyles.crewName}>{dir?.name || dir || "N/A"}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className={movieDetailHStyles.pageContainer}>
            {showTrailer && selectedTrailerId && (
                <div className={movieDetailHStyles.trailerModal}>
                    <div className={movieDetailHStyles.trailerContainer}>
                        <button onClick={() => setShowTrailer(false)} className={movieDetailHStyles.closeButton}><X size={36} /></button>
                        <div className={movieDetailHStyles.trailerIframe}>
                            <iframe width="100%" height="100%" src={getEmbedUrl(selectedTrailerId)} title="Trailer" frameBorder="0" allowFullScreen />
                        </div>
                    </div>
                </div>
            )}

            <div className={movieDetailHStyles.mainContainer}>
                <div className={movieDetailHStyles.headerContainer}>
                    <Link to="/movies" className={movieDetailHStyles.backButton}><ArrowLeft size={18} /> Back</Link>
                </div>

                <div className={movieDetailHStyles.titleContainer}>
                    <h1 className={movieDetailHStyles.movieTitle}>{movie.title}</h1>
                    <div className={movieDetailHStyles.movieInfoContainer}>
                        <span className={movieDetailHStyles.rating}><Star className={movieDetailHStyles.ratingIcon} /> {movie.rating}/10</span>
                        <span className={movieDetailHStyles.duration}><Clock className={movieDetailHStyles.durationIcon} /> {movie.duration}</span>
                        <span className={movieDetailHStyles.genre}>{movie.genre}</span>
                    </div>
                </div>

                <div className={movieDetailHStyles.mainGrid}>
                    <div className={movieDetailHStyles.posterContainer}>
                        <div className={movieDetailHStyles.posterCard}>
                            <img src={movie.img} alt={movie.title} className={movieDetailHStyles.posterImage} />
                            <button onClick={() => openTrailer(movie)} className={movieDetailHStyles.trailerButton}><Play size={18} /> Watch Trailer</button>
                        </div>
                    </div>

                    <div className={movieDetailHStyles.showtimesContainer}>
                        <div className={movieDetailHStyles.showtimesCard}>
                            <h3 className={movieDetailHStyles.showtimesTitle}><Calendar size={20} /> Showtimes</h3>
                            <div className={movieDetailHStyles.daySelection}>
                                {showtimeDays.map((day, index) => (
                                    <button key={day.date} onClick={() => { setSelectedDay(index); setSelectedTime(null); }} className={`${movieDetailHStyles.dayButton} ${selectedDay === index ? movieDetailHStyles.dayButtonSelected : movieDetailHStyles.dayButtonDefault}`}>
                                        <div>{day.shortDay}</div><div>{day.dateStr}</div>
                                    </button>
                                ))}
                            </div>
                            <div className={movieDetailHStyles.showtimesGrid}>
                                {showtimeDays[selectedDay]?.showtimes?.map((st, idx) => (
                                    <button key={idx} onClick={() => handleTimeSelect(st.datetime)} className={`${movieDetailHStyles.showtimeButton} ${selectedTime === st.datetime ? movieDetailHStyles.showtimeButtonSelected : movieDetailHStyles.showtimeButtonDefault}`}>
                                        {st.time}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={movieDetailHStyles.castCard}>
                            <h3 className={movieDetailHStyles.castTitle}><Users size={20} /> Cast</h3>
                            <div className={movieDetailHStyles.castGrid}>
                                {movie.cast?.map((c, idx) => (
                                    <div key={idx} className={movieDetailHStyles.castMember}>
                                        <div className={movieDetailHStyles.castImageContainer}>
                                            {c.img ? <img src={c.img} alt={c.name} className={movieDetailHStyles.castImage} /> : <FallbackAvatar className="w-16 h-16 mx-auto" />}
                                        </div>
                                        <div className={movieDetailHStyles.castName}>{c.name}</div>
                                        <div className={movieDetailHStyles.castRole}>{c.role}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={movieDetailHStyles.storyCard}>
                    <h2 className={movieDetailHStyles.storyTitle}>Story</h2>
                    <p className={movieDetailHStyles.storyText}>{movie.synopsis}</p>
                </div>

                <div className={movieDetailHStyles.crewGrid}>
                    {/* Render Directors - Works for both Single and Multiple */}
                    {renderDirectors()}

                    {/* Producer */}
                    <div className={movieDetailHStyles.crewCard}>
                        <div className={movieDetailHStyles.crewTitle}><User size={20} /> <h3>Producer</h3></div>
                        <div className="flex flex-col items-center mt-4">
                            {movie.producer?.img ? (
                                <img src={movie.producer.img} alt={movie.producer.name} className="w-24 h-24 rounded-full object-cover mb-3 border-2 border-amber-500/30" />
                            ) : (
                                <FallbackAvatar className="w-24 h-24 mb-3" />
                            )}
                            <div className={movieDetailHStyles.crewName}>{movie.producer?.name || movie.producer || "N/A"}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetailPageHome;