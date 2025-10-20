"use client";
import { useState } from "react";
import { Shield, Star, ChevronLeft, ChevronRight } from "lucide-react";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Alex Chen",
      role: "Security Researcher",
      level: "Level 47",
      avatar: "AC",
      text: "This platform took my debugging skills to the next level. The challenges are intense and rewarding.",
      rating: 5,
    },
    {
      name: "Sarah Kim",
      role: "Penetration Tester",
      level: "Level 52",
      avatar: "SK",
      text: "Best place to sharpen your security skills. The reward system keeps me coming back for more.",
      rating: 5,
    },
    {
      name: "Marcus Wu",
      role: "Bug Hunter",
      level: "Level 39",
      avatar: "MW",
      text: "Found my first critical vulnerability here. The community is supportive and the challenges are realistic.",
      rating: 5,
    },
    {
      name: "Elena Rodriguez",
      role: "Ethical Hacker",
      level: "Level 61",
      avatar: "ER",
      text: "The real-world scenarios helped me land my dream job in cybersecurity. Highly recommended!",
      rating: 5,
    },
    {
      name: "David Park",
      role: "Security Analyst",
      level: "Level 44",
      avatar: "DP",
      text: "Amazing learning experience with practical challenges. The XP system keeps you motivated.",
      rating: 5,
    },
    {
      name: "Maya Singh",
      role: "Bug Bounty Hunter",
      level: "Level 55",
      avatar: "MS",
      text: "Found multiple critical vulnerabilities that earned me top rewards. The platform is addictive!",
      rating: 5,
    },
  ];

  // Calculate max index based on visible items (3 on desktop, 2 on tablet, 1 on mobile)
  // For simplicity, we'll use the desktop view (3 items) as the limit
  const maxIndex = Math.max(0, testimonials.length - 3);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  return (
    <section className="py-10 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-[#00d492]/70 text-sm tracking-wider mb-2">// Player Reviews</p>
          <h2 className="text-4xl font-bold tracking-wider">
            <span className="text-[#00d492]">COMMUNITY INTEL</span>
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-7xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            disabled={!canGoPrev}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all ${
              canGoPrev
                ? "bg-[#00d492]/20 hover:bg-[#00d492]/30 border border-[#00d492]/40 hover:scale-110 cursor-pointer"
                : "bg-gray-500/10 border border-gray-500/20 cursor-not-allowed opacity-50"
            }`}
            aria-label="Previous"
          >
            <ChevronLeft className={`w-5 h-5 md:w-6 md:h-6 ${canGoPrev ? "text-[#00d492]" : "text-gray-500"}`} />
          </button>

          <button
            onClick={nextSlide}
            disabled={!canGoNext}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all ${
              canGoNext
                ? "bg-[#00d492]/20 hover:bg-[#00d492]/30 border border-[#00d492]/40 hover:scale-110 cursor-pointer"
                : "bg-gray-500/10 border border-gray-500/20 cursor-not-allowed opacity-50"
            }`}
            aria-label="Next"
          >
            <ChevronRight className={`w-5 h-5 md:w-6 md:h-6 ${canGoNext ? "text-[#00d492]" : "text-gray-500"}`} />
          </button>

          {/* Carousel Track */}
          <div className="overflow-hidden px-2">
            <div
              className="flex transition-transform duration-500 ease-out gap-6"
              style={{
                transform: `translateX(calc(-${currentIndex * 33.33}% - ${currentIndex * 1.5}rem))`,
              }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0"
                >
                  <div className="bg-card/50 border border-[#00d492]/20 hover:border-[#00d492]/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,136,0.2)] backdrop-blur-sm rounded-2xl h-[280px] flex flex-col">
                    <div className="p-8 flex flex-col h-full">
                      {/* Avatar and Info */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-[#00d492]/10 border border-[#00d492]/30 flex items-center justify-center text-[#00d492] font-bold">
                          {testimonial.avatar}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-foreground">{testimonial.name}</h3>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Shield className="w-3 h-3 text-[#00d492]" />
                            <span className="text-xs text-[#00d492]">{testimonial.level}</span>
                          </div>
                        </div>
                      </div>

                      {/* Testimonial Text */}
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1 overflow-hidden">
                        {testimonial.text}
                      </p>

                      {/* Rating */}
                      <div className="flex gap-1 mt-auto">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-8 bg-[#00d492]"
                    : "w-2 bg-[#00d492]/30 hover:bg-[#00d492]/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
