import React from "react";
import { newsStyles, newsCSS } from "../assets/dummyStyles";
import { sampleNews } from "../assets/newdummydata";
import { Image as ImageIcon, Sparkles, Clock, Calendar } from "lucide-react";

const News = () => {
  return (
    <div className={newsStyles.container}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Monoton&family=Roboto:wght@300;400;700&display=swap');`}</style>
      
      {/* 1. Header Section */}
      <header className={newsStyles.header}>
        <div className={newsStyles.headerFlex}>
          <div className={newsStyles.logoContainer}>
            <div className={newsStyles.logoText} style={{ fontFamily: "Monoton, cursive" }}>CineVerse</div>
            <div className={newsStyles.logoSubtitle}>Latest • Curated • Cinematic</div>
          </div>
          <div className={newsStyles.headerButtons}>
            <button className={newsStyles.latestNewsButton}>
              <ImageIcon size={16} />
              <span className={newsStyles.buttonText}>Latest News</span>
            </button>
          </div>
        </div>

        <div className={newsStyles.heroStripe}>
          <div className={newsStyles.featuredBadge}>Featured</div>
          <div className={newsStyles.stripeText}>
            {sampleNews[0].title} — {sampleNews[0].excerpt}
          </div>
          <Sparkles size={16} className="text-red-500 ml-2"/>
        </div>
      </header>

      {/* 2. Main Content Grid */}
      <main className="max-w-screen-2xl mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: White background wrapper with reduced padding */}
          <div className="lg:col-span-7 bg-white p-6 rounded-4xl shadow-sm">
            
            {/* Hero Card */}
            <article className={newsStyles.heroCard}>
              <div className={newsStyles.heroImageContainer}>
                <img src={sampleNews[0].image} alt={sampleNews[0].title} className={newsStyles.heroImg} />
                <div className={newsStyles.heroOverlay}></div>
                <div className={newsStyles.heroContent}>
                  <span className={newsStyles.heroCategory}>{sampleNews[0].category}</span>
                  <h1 className={newsStyles.heroTitle}>{sampleNews[0].title}</h1>
                  <p className={newsStyles.heroExcerpt}>{sampleNews[0].excerpt}</p>
                  <div className={newsStyles.heroMeta}>
                    <div className={newsStyles.metaItem}><Clock size={14}/> <span>{sampleNews[0].time}</span></div>
                    <div className={newsStyles.metaItem}><Calendar size={14}/> <span>{sampleNews[0].date}</span></div>
                  </div>
                </div>
              </div>
            </article>

            {/* Sub-cards Grid with hover effect */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {sampleNews.slice(2, 5).map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-md cursor-pointer">
                   <div className="relative h-40">
                      <img src={item.image} className="w-full h-full object-cover" />
                      <span className="absolute left-3 top-3 bg-red-600 text-white text-[10px] px-2 py-1 rounded-full uppercase font-bold">
                        {item.category}
                      </span>
                   </div>
                   <div className="p-4 flex-1">
                     <h3 className="font-bold text-sm leading-snug">{item.title}</h3>
                     <p className="text-[11px] text-gray-500 mt-2 line-clamp-3">{item.excerpt}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Sidebar with 3 original cards */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            <div className="flex flex-col gap-4">
              {sampleNews.slice(1, 4).map((item) => (
                <div key={item.id} className="flex gap-4 bg-white p-3 rounded-3xl shadow-sm border border-gray-50 hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                  <img src={item.image} className="w-24 h-24 object-cover rounded-2xl shrink-0" />
                  <div className="flex flex-col justify-center">
                    <span className="text-[10px] text-red-600 font-bold uppercase mb-1">{item.category}</span>
                    <h4 className="text-sm font-bold leading-tight mb-2">{item.title}</h4>
                    <p className="text-[10px] text-gray-400 line-clamp-2">{item.excerpt}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Subscription Box */}
            <div className={newsStyles.subscribeCard}>
              <h5 className='font-bold'>Join CineNews</h5>
              <p className={newsStyles.subscribeText}>
                Get curated cinematic news, exclusive behind-the-scenes, and early access to trailers.
              </p>
              <div className={newsStyles.subscribeForm}>
                <input className={newsStyles.subscribeInput} placeholder="Email address" />
                <button className={newsStyles.subscribeButton}>Subscribe</button>
              </div>
            </div>
          </div>

        </div>
      </main>

      <style jsx>{newsCSS}</style>
    </div>
  );
};

export default News;