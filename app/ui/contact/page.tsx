"use client";
import { useState } from "react";
import { Mail, MapPin, Phone, Send, Check, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  return (
    <section className="relative min-h-screen bg-[#05060a] text-white font-mono pt-32 pb-10">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0a0f1c_0%,_#000_100%)] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(#00d49240_1px,transparent_1px),linear-gradient(90deg,#00d49240_1px,transparent_1px)] bg-[size:50px_50px] opacity-10 animate-[pulseGrid_4s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] opacity-20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl font-bold text-[#00d492] mb-4 flex items-center justify-center gap-3">
            <Mail className="w-12 h-12" />
            Contact Us
          </h1>
          <p className="text-gray-400 text-lg">
            Get in touch with our team. We're here to help!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-black/30 border border-[#00d492]/30 rounded-2xl p-8 backdrop-blur-sm animate-slideUp">
            <h2 className="text-2xl font-bold text-[#00d492] mb-6">
              Send us a Message
            </h2>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-[#00d492]/20 rounded-full flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-[#00d492]" />
                </div>
                <h3 className="text-2xl font-bold text-[#00d492] mb-2">
                  Message Sent!
                </h3>
                <p className="text-gray-400 text-center">
                  Thank you for contacting us. We'll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full bg-black/40 border border-[#00d492]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00d492] transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className="w-full bg-black/40 border border-[#00d492]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00d492] transition-colors"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="How can we help you?"
                    className="w-full bg-black/40 border border-[#00d492]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00d492] transition-colors"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Tell us more about your inquiry..."
                    className="w-full bg-black/40 border border-[#00d492]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00d492] transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-[#00d492] text-black font-bold py-3 rounded-lg hover:bg-[#00d492]/80 transition-all hover:shadow-[0_0_20px_#00d492]"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Info Card */}
            <div className="bg-black/30 border border-[#00d492]/30 rounded-2xl p-8 backdrop-blur-sm animate-slideUp" style={{ animationDelay: "0.1s" }}>
              <h2 className="text-2xl font-bold text-[#00d492] mb-6">
                Contact Information
              </h2>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#00d492]/10 border border-[#00d492]/30 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[#00d492]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Email</h3>
                    <p className="text-gray-400 text-sm">support@opsglitch.com</p>
                    <p className="text-gray-400 text-sm">contact@opsglitch.com</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#00d492]/10 border border-[#00d492]/30 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-[#00d492]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Phone</h3>
                    <p className="text-gray-400 text-sm">+1 (555) 123-4567</p>
                    <p className="text-gray-400 text-sm">Mon-Fri, 9AM-6PM EST</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#00d492]/10 border border-[#00d492]/30 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#00d492]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Location</h3>
                    <p className="text-gray-400 text-sm">123 Cyber Street</p>
                    <p className="text-gray-400 text-sm">Tech Valley, CA 94000</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Card */}
            <div className="bg-black/30 border border-[#00d492]/30 rounded-2xl p-8 backdrop-blur-sm animate-slideUp" style={{ animationDelay: "0.2s" }}>
              <h2 className="text-2xl font-bold text-[#00d492] mb-6">
                Quick Help
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#00d492] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-white text-sm mb-1">
                      Response Time
                    </h3>
                    <p className="text-gray-400 text-sm">
                      We typically respond within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#00d492] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-white text-sm mb-1">
                      Technical Support
                    </h3>
                    <p className="text-gray-400 text-sm">
                      For urgent issues, use live chat support
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#00d492] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-white text-sm mb-1">
                      Bug Reports
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Report bugs through our dedicated portal
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes pulseGrid {
          0%,
          100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.3;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-slideUp {
          opacity: 0;
          animation: slideUp 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
