import { Shield, Star } from "lucide-react";

const Testimonials = () => {
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
  ];

  return (
    <section className="py-10 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-[#00d492]/70 text-sm tracking-wider mb-2">// Player Reviews</p>
          <h2 className="text-4xl font-bold tracking-wider">
            <span className="text-[#00d492]">COMMUNITY INTEL</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card/50 border border-[#00d492]/20 hover:border-[#00d492]/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,136,0.2)] backdrop-blur-sm rounded-2xl"
            >
              <div className="p-8">
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
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {testimonial.text}
                </p>

                {/* Rating */}
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
