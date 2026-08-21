import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Phone, MapPin } from "lucide-react";

const inputClasses =
  "w-full rounded-none border-b border-umber-50 bg-transparent px-0 py-3 text-sm text-espresso placeholder:text-espresso/40 focus:border-gold-500 focus:outline-none transition-colors";

export default function ContactUsPage() {
  const [status, setStatus] = useState("idle"); // idle, submitting, success

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("submitting");
    setTimeout(() => setStatus("success"), 1000);
  };

  return (
    <section aria-labelledby="contact-title" className="min-h-dvh pt-24 pb-12">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left Column: Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <p className="eyebrow mb-4">Client Services</p>
            <h1 id="contact-title" className="font-display text-5xl md:text-6xl text-espresso tracking-wide mb-6">
              How can we <br /> assist you?
            </h1>
            <p className="text-espresso/70 leading-relaxed max-w-md mb-12">
              Our client advisors are available to assist with your online order, provide styling advice, or answer any questions regarding our collections.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="size-10 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0">
                  <Phone className="size-5 text-gold-700" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-espresso uppercase tracking-widest mb-1">Telephone</h3>
                  <p className="text-espresso/70 text-sm mb-1">+44 (0) 20 7123 4567</p>
                  <p className="text-xs text-espresso/50">Monday to Saturday: 10am - 7pm GMT</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="size-10 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0">
                  <Mail className="size-5 text-gold-700" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-espresso uppercase tracking-widest mb-1">Email</h3>
                  <p className="text-espresso/70 text-sm">clientcare@belioras.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="size-10 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0">
                  <MapPin className="size-5 text-gold-700" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-espresso uppercase tracking-widest mb-1">Boutique</h3>
                  <p className="text-espresso/70 text-sm leading-relaxed">
                    15 Mount Street<br />
                    Mayfair, London<br />
                    W1K 2RN, United Kingdom
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-ivory-50 p-8 sm:p-12 rounded-2xl shadow-large border border-umber-50/50"
          >
            {status === "success" ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="size-16 rounded-full bg-gold-500/20 flex items-center justify-center mb-6">
                  <Mail className="size-8 text-gold-700" />
                </div>
                <h3 className="font-display text-2xl text-espresso mb-3">Message Received</h3>
                <p className="text-espresso/70 text-sm leading-relaxed">
                  Thank you for reaching out. A Client Advisor will reply to your inquiry within 24 hours.
                </p>
                <button 
                  onClick={() => setStatus("idle")}
                  className="mt-8 text-xs font-semibold uppercase tracking-widest text-gold-700 hover:text-espresso transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="font-display text-2xl text-espresso mb-8">Send a Message</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="sr-only">First Name</label>
                    <input type="text" id="firstName" required placeholder="First Name *" className={inputClasses} />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="sr-only">Last Name</label>
                    <input type="text" id="lastName" required placeholder="Last Name *" className={inputClasses} />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="sr-only">Email Address</label>
                  <input type="email" id="email" required placeholder="Email Address *" className={inputClasses} />
                </div>

                <div>
                  <label htmlFor="subject" className="sr-only">Subject</label>
                  <select id="subject" className={`${inputClasses} appearance-none bg-transparent`} required defaultValue="">
                    <option value="" disabled>Select a Subject *</option>
                    <option value="order">Online Order</option>
                    <option value="product">Product Information</option>
                    <option value="returns">Returns & Exchanges</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="sr-only">Message</label>
                  <textarea 
                    id="message" 
                    rows="4" 
                    required 
                    placeholder="Your Message *" 
                    className={`${inputClasses} resize-none`} 
                  />
                </div>

                <p className="text-[10px] text-espresso/50 uppercase tracking-widest pt-4">
                  * Indicates required field
                </p>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="btn w-full bg-espresso text-ivory-50 hover:bg-gold-700 hover:text-espresso transition-colors py-4 uppercase tracking-[0.2em] text-xs font-bold mt-4"
                >
                  {status === "submitting" ? "Sending..." : "Submit"}
                </button>
              </form>
            )}
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}