"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-12 md:py-16">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-charcoal mb-4">Contact Us</h1>
        <p className="text-muted">We are here to help. Reach out to our customer support team.</p>
      </div>

      <div className="grid md:grid-cols-[1fr_400px] gap-8">
        <div className="rounded-xl border border-border bg-white p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6">Send us a message</h2>
          
          {submitted ? (
            <div className="rounded-md border border-success/30 bg-success/10 p-4 text-sm text-charcoal">
              <p className="font-semibold text-success mb-1">Message received!</p>
              <p className="text-xs">This is a demo UI. In production, this would trigger an email to our support team.</p>
              <button onClick={() => setSubmitted(false)} className="mt-4 text-primary font-medium hover:underline text-xs">Send another message</button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1">Full Name</label>
                  <input required type="text" className="h-10 w-full rounded border border-border px-3 text-sm outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Email</label>
                  <input required type="email" className="h-10 w-full rounded border border-border px-3 text-sm outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Subject</label>
                <input required type="text" className="h-10 w-full rounded border border-border px-3 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Message</label>
                <textarea required rows={5} className="w-full rounded border border-border px-3 py-2 text-sm outline-none focus:border-primary resize-none" />
              </div>
              <button type="submit" className="h-11 px-6 rounded bg-primary text-white text-sm font-semibold hover:bg-primary-hover inline-flex items-center gap-2">
                <Send size={16} /> Send Message
              </button>
            </form>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="font-bold mb-4">Contact Information</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3"><Mail className="text-primary flex-shrink-0" size={18} /><div><p className="font-medium">Email</p><p className="text-muted">support@isource.ng</p></div></li>
              <li className="flex gap-3"><Phone className="text-primary flex-shrink-0" size={18} /><div><p className="font-medium">Phone</p><p className="text-muted">+234 800 000 0000</p></div></li>
              <li className="flex gap-3"><MapPin className="text-primary flex-shrink-0" size={18} /><div><p className="font-medium">Head Office</p><p className="text-muted">Victoria Island, Lagos, Nigeria</p></div></li>
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6">
            <h3 className="font-bold mb-2">Support Hours</h3>
            <p className="text-sm text-charcoal/80">Monday – Friday: 9:00 AM – 6:00 PM</p>
            <p className="text-sm text-charcoal/80">Saturday: 10:00 AM – 2:00 PM</p>
            <p className="text-sm text-charcoal/80">Sunday: Closed</p>
          </div>
        </div>
      </div>
    </div>
  );
}