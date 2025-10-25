"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Shield,
  Star,
  ChevronLeft,
  ChevronRight,
  Link as LinkIcon,
} from "lucide-react";
import { useFetch } from "@/app/hook/useFetch";
import { Preloader } from "@/app/commonComponents/Preloader/Preloader";

type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  level: string | null;
  social_id: string | null;
  text: string;
  rating: number | null;
};

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data, error, loading } = useFetch<{ testimonials: Testimonial[] }>(
    "/api/v1/testimonials"
  );
  const testimonials = data?.testimonials ?? [];

  const maxIndex = useMemo(
    () => Math.max(0, testimonials.length - 3),
    [testimonials.length]
  );

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  // Calculate max index based on visible items (3 on desktop, 2 on tablet, 1 on mobile)
  // For simplicity, we'll use the desktop view (3 items) as the limit
  const canNavigate = testimonials.length > 3;

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const canGoPrev = canNavigate && currentIndex > 0;
  const canGoNext = canNavigate && currentIndex < maxIndex;
  const renderAvatar = (value: string | null) => {
    if (!value) return "";
    return value.length > 2
      ? value.slice(0, 2).toUpperCase()
      : value.toUpperCase();
  };

  return (
    <section className="py-10 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-[#00d492]/70 text-sm tracking-wider mb-2">
            // Player Reviews
          </p>
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
            <ChevronLeft
              className={`w-5 h-5 md:w-6 md:h-6 ${
                canGoPrev ? "text-[#00d492]" : "text-gray-500"
              }`}
            />
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
            <ChevronRight
              className={`w-5 h-5 md:w-6 md:h-6 ${
                canGoNext ? "text-[#00d492]" : "text-gray-500"
              }`}
            />
          </button>

          {/* Carousel Track */}
          <div className="overflow-hidden px-2">
            {error ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                {error}
              </div>
            ) : loading ? (
              <Preloader message="Loading testimonials" />
            ) : testimonials.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No testimonials available yet.
              </div>
            ) : (
              <div
                className="flex transition-transform duration-500 ease-out gap-6"
                style={{
                  transform: `translateX(calc(-${currentIndex * 33.33}% - ${
                    currentIndex * 1.5
                  }rem))`,
                }}
              >
                {testimonials.map((testimonial) => {
                  const rating = Math.max(
                    0,
                    Math.min(5, Number(testimonial.rating) || 0)
                  );
                  return (
                    <div
                      key={testimonial.id}
                      className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0"
                    >
                      <div className="bg-card/50 border border-[#00d492]/20 hover:border-[#00d492]/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,136,0.2)] backdrop-blur-sm rounded-2xl h-[280px] flex flex-col">
                        <div className="p-8 flex flex-col h-full">
                          {/* Avatar and Info */}
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-[#00d492]/10 border border-[#00d492]/30 flex items-center justify-center text-[#00d492] font-bold">
                              {renderAvatar(testimonial.name.slice(0, 2))}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-foreground flex items-center gap-2">
                                {testimonial.name}
                                {testimonial.social_id ? (
                                  <a
                                    href={testimonial.social_id}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-1 inline-flex items-center gap-1 text-xs text-[#00d492] hover:text-[#00ffa7] transition"
                                  >
                                    <LinkIcon className="w-3 h-3" />
                                    <span className="truncate max-w-[10rem]">
                                      Visit profile
                                    </span>
                                  </a>
                                ) : null}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {testimonial.role}
                              </p>
                              <div className="flex items-center gap-1 mt-1">
                                <Shield className="w-3 h-3 text-[#00d492]" />
                                <span className="text-xs text-[#00d492]">
                                  {testimonial.level}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Testimonial Text */}
                          <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1 overflow-hidden">
                            {testimonial.text}
                          </p>

                          {/* Rating */}
                          <div className="flex gap-1 mt-auto">
                            {[...Array(rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-4 h-4 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Indicators */}
          {testimonials.length > 0 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: maxIndex + 1 || 1 }).map((_, index) => (
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
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
