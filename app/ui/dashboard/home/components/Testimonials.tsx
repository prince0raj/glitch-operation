"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Shield,
  Star,
  ChevronLeft,
  ChevronRight,
  Link as LinkIcon,
  Quote,
  ExternalLink,
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

  const resolveProfileLabel = (url: string) => {
    try {
      const hostname = new URL(url).hostname.replace(/^www\./i, "");
      return hostname.length > 18 ? `${hostname.slice(0, 15)}…` : hostname;
    } catch {
      return "Visit profile";
    }
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
                  const formattedRating = rating > 0 ? rating.toFixed(1) : null;
                  return (
                    <div
                      key={testimonial.id}
                      className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0"
                    >
                      <article className="group relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-2xl border border-emerald-500/18 bg-[#010b11] p-8 transition-colors duration-300 hover:border-emerald-400/45 hover:bg-[#010f16]">
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-emerald-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-90" />
                        <div className="relative flex h-full flex-col gap-5">
                          <header className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/15 text-lg font-semibold text-emerald-200">
                                {renderAvatar(testimonial.name.slice(0, 2))}
                              </div>
                              <div className="space-y-1">
                                <h3 className="flex items-center gap-2 text-base font-semibold text-slate-100">
                                  <span className="truncate max-w-[12rem] text-pretty">
                                    {testimonial.name}
                                  </span>
                                  {testimonial.social_id ? (
                                    <a
                                      href={testimonial.social_id}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-200 transition hover:border-emerald-400/60 hover:bg-emerald-500/20"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                      <span className="truncate max-w-[7rem]">
                                        {resolveProfileLabel(
                                          testimonial.social_id
                                        )}
                                      </span>
                                    </a>
                                  ) : null}
                                </h3>
                                <p className="text-xs uppercase tracking-[0.25em] text-emerald-300/70 line-clamp-1">
                                  {testimonial.role || "Security Operative"}
                                </p>
                                <div className="inline-flex items-center gap-1 text-xs text-emerald-200/80">
                                  <Shield className="h-3 w-3" />
                                  <span className="line-clamp-1">
                                    {testimonial.level || "Level undisclosed"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Quote className="h-6 w-6 shrink-0 text-emerald-400/60" />
                          </header>

                          <p className="text-sm leading-relaxed text-slate-300/90 line-clamp-4 text-pretty">
                            {testimonial.text}
                          </p>

                          <footer className="mt-auto flex items-center justify-between gap-3 text-emerald-200/90">
                            <div className="flex items-center gap-1">
                              {[...Array(rating)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="h-4 w-4 fill-yellow-400 text-yellow-400 "
                                />
                              ))}
                              {rating < 5
                                ? [...Array(5 - rating)].map((_, i) => (
                                    <Star
                                      key={`empty-${i}`}
                                      className="h-4 w-4 text-slate-600"
                                    />
                                  ))
                                : null}
                            </div>
                            <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-200">
                              {formattedRating
                                ? `${formattedRating} / 5`
                                : "Awaiting intel"}
                            </span>
                          </footer>
                        </div>
                      </article>
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
