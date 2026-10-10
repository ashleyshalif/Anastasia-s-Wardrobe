"use client";

import { useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  Truck,
  RefreshCw,
  Ruler,
  MessageCircle,
  Instagram,
  Facebook,
} from "lucide-react";

const categories = [
  { age: "2–6 YEARS", title: "Kids Wear", image: "kids.png" },
  { age: "7–12 YEARS", title: "Girls Wear", image: "girls.png" },
  { age: "13–17 YEARS", title: "Teens", image: "teens.png" },
  { age: "18 YEARS & BEYOND", title: "Women", image: "women.png" },
];

const products = [
  {
    image: "dress.png",
    age: "Girls Wear · 7–12 years",
    title: "Rosebud Smocked Dress",
    price: "₹1,890",
    colors: ["#b88282", "#d4c6a9"],
  },
  {
    image: "coord.png",
    age: "Kids Wear · 2–6 years",
    title: "Daisy Cotton Co-ord",
    price: "₹1,490",
    colors: ["#d7d3bb", "#b8a88a"],
  },
  {
    image: "cardigan.png",
    age: "Teens · XS–L",
    title: "Sunday Knit Cardigan",
    price: "₹2,290",
    colors: ["#dbc9b2", "#721d32", "#969582"],
  },
  {
    image: "wrap-dress.png",
    age: "Women · XS–XXL",
    title: "Amelie Wrap Midi Dress",
    price: "₹3,490",
    colors: ["#772138", "#959985"],
  },
];

const reviews = [
  {
    quote: "“The kind of dress she refuses to take off. So soft, and even prettier in person.”",
    author: "Priya S. · Verified customer",
    item: "Rosebud Smocked Dress · Girls Wear",
  },
  {
    quote: "“Finally, something my teenager and I both love. The fit is just lovely.”",
    author: "Meera K. · Verified customer",
    item: "Sunday Knit Cardigan · Teens",
  },
  {
    quote: "“Beautiful fabric, thoughtful details. It felt like shopping at my favourite little boutique.”",
    author: "Ananya R. · Verified customer",
    item: "Amelie Wrap Midi Dress · Women",
  },
];

const journal = [
  {
    image: "journal-occasion.png",
    meta: "THE OCCASION GUIDE · 4 MIN READ",
    title: "Little dresses, big occasions",
    copy: "Thoughtful ways to dress her for the moments you’ll remember.",
  },
  {
    image: "journal-layer.png",
    meta: "STYLE NOTES · 3 MIN READ",
    title: "The art of a lovely layer",
    copy: "Cardigans, cottons and the comfort of getting dressed with ease.",
  },
  {
    image: "journal-care.png",
    meta: "WARDROBE CARE · 5 MIN READ",
    title: "Keep the favourites, forever",
    copy: "A little care goes a long way. Our simple guide to loving your clothes.",
  },
];

const trust = [
  { icon: Truck, title: "Delivered with care", copy: "Free shipping over ₹2,999" },
  { icon: RefreshCw, title: "A little peace of mind", copy: "Easy 14-day returns & exchanges" },
  { icon: Ruler, title: "The right fit, every time", copy: "Size guides for every age" },
  { icon: MessageCircle, title: "A personal touch", copy: "We're here to help you choose" },
];

function SectionLink({ children }: { children: React.ReactNode }) {
  return (
    <a className="text-link" href="#new-arrivals">
      {children} <ArrowRight aria-hidden="true" size={15} strokeWidth={1.5} />
    </a>
  );
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("All styles");
  const [activeSlide, setActiveSlide] = useState(0);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const tabs = ["All styles", "Kids", "Girls", "Teens", "Women"];
  const visibleProducts = products.filter((product) => {
    const tabMatches = activeTab === "All styles" || product.age.startsWith(activeTab);
    const searchMatches = `${product.age} ${product.title}`.toLowerCase().includes(searchValue.toLowerCase());
    return tabMatches && searchMatches;
  });

  return (
    <main>
      <div className="announcement">
        <span>A little something lovely. Complimentary shipping on orders over ₹2,999.</span>
        <a href="#new-arrivals">Shop new arrivals</a>
      </div>
      <header className="site-header">
        <div className="header-search">
          <Search size={19} strokeWidth={1.5} />
          <input suppressHydrationWarning aria-label="Search" placeholder="Find something you'll love" value={searchValue} onChange={(event) => setSearchValue(event.target.value)} />
        </div>
        <a className="brand" href="#" aria-label="Anastasia's Wardrobe home">
          <img src="/images/logo.png" alt="Anastasia's Wardrobe" />
        </a>
        <div className="header-actions">
          <a href="#footer"><UserRound /><span>Account</span></a>
          <a href="#new-arrivals" aria-label="Wishlist"><Heart /></a>
          <a href="#new-arrivals"><ShoppingBag /><span>Bag (0)</span></a>
          <button className="mobile-menu" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Menu /></button>
        </div>
      </header>
      <nav className={`main-nav${menuOpen ? " mobile-open" : ""}`} aria-label="Main navigation">
        {["New arrivals", "Kids Wear", "Girls Wear", "Teens", "Women", "Occasion Wear", "Our story", "Sale"].map((item) => (
          <a key={item} href={item === "Our story" ? "#story" : "#new-arrivals"} className={item === "Sale" ? "sale" : ""}>{item}</a>
        ))}
      </nav>

      <section className="hero" aria-label="The autumn edit">
        <div className="hero-copy">
          <p className="eyebrow">THE AUTUMN EDIT · 2026</p>
          <h1>For all her<br />beautiful<br />chapters.</h1>
          <p className="hero-description">From little firsts to unforgettable evenings. Discover thoughtfully chosen styles for every age, every day and every occasion.</p>
          <a className="primary-button" href="#new-arrivals">EXPLORE NEW ARRIVALS <ArrowRight size={16} /></a>
          <a className="underlined-link" href="#departments">Find her perfect fit <ArrowRight size={14} /></a>
          <div className="slide-controls" aria-label="Choose featured collection">
            {[0, 1, 2].map((slide) => (
              <button key={slide} aria-label={`Slide ${slide + 1}`} className={activeSlide === slide ? "selected" : ""} onClick={() => setActiveSlide(slide)} />
            ))}
            <span>0{activeSlide + 1} / 03</span>
          </div>
        </div>
        <div className="hero-image">
          <img src="/images/hero.png" alt="A mother and daughter walking together through a garden" />
        </div>
      </section>

      <section className="departments section-shell" id="departments">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A WARDROBE THAT GROWS WITH HER</p>
            <h2>Every age. Her own style.</h2>
          </div>
          <SectionLink>Shop all departments</SectionLink>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <a className="category-card" href="#new-arrivals" key={category.title}>
              <img src={`/images/${category.image}`} alt="" />
              <span className="age-label">{category.age}</span>
              <span className="category-name">{category.title}</span>
              <ArrowDownRight className="category-arrow" size={17} strokeWidth={1.4} />
            </a>
          ))}
        </div>
      </section>

      <section className="new-arrivals section-shell" id="new-arrivals">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FRESH FINDS, FOREVER FAVOURITES</p>
            <h2>Just arrived in the wardrobe</h2>
          </div>
          <SectionLink>View all new arrivals</SectionLink>
        </div>
        <div className="product-toolbar">
          <div className="tabs" role="tablist" aria-label="Filter products">
            {tabs.map((tab) => <button role="tab" aria-selected={activeTab === tab} className={activeTab === tab ? "active" : ""} key={tab} onClick={() => setActiveTab(tab)}>{tab}</button>)}
          </div>
          <p>Thoughtfully selected. Beautifully worn.</p>
        </div>
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <article className="product-card" key={product.title}>
              <a href="#new-arrivals" className="product-image"><img src={`/images/${product.image}`} alt={product.title} /></a>
              <p className="product-age">{product.age}</p>
              <h3>{product.title}</h3>
              <p className="price">{product.price}</p>
              <div className="swatches" aria-label="Available colours">{product.colors.map((color) => <span key={color} style={{ backgroundColor: color }} />)}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="edits section-shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">DRESSED FOR THE MOMENT</p>
            <h2>A little everyday. A little extraordinary.</h2>
          </div>
        </div>
        <div className="editorial-grid">
          <article className="editorial-card editorial-wide">
            <a href="#new-arrivals"><img src="/images/editorial-garden.png" alt="A mother and daughter enjoying a garden celebration" /></a>
            <div className="editorial-info"><div><h3>An invitation to dress up</h3><p>Celebrations, family gatherings & all the in-between magic.</p></div><SectionLink>Shop the edit</SectionLink></div>
          </article>
          <article className="editorial-card editorial-narrow">
            <a href="#new-arrivals"><img src="/images/editorial-everyday.png" alt="A woman relaxing by a sunlit window" /></a>
            <div className="editorial-info"><div><h3>The everyday favourites</h3><p>Soft layers. Easy shapes. Ready for real life.</p></div><SectionLink>Shop the edit</SectionLink></div>
          </article>
        </div>
      </section>

      <section className="story" id="story">
        <div className="story-inner">
          <img className="story-photo" src="/images/boutique.png" alt="A seamstress carefully working on a garment in her studio" />
          <div className="story-copy">
            <p className="eyebrow">WELCOME TO ANASTASIA'S WARDROBE</p>
            <h2>More than clothes.<br />A feeling of belonging.</h2>
            <p>We believe a wardrobe should hold more than beautiful things. It should hold the dress she twirls in, the cardigan she reaches for, and the memories that make them hers.</p>
            <p>Our boutique brings together considered fabrics, timeless details and a personal eye for style — from her littlest years to her next chapter.</p>
            <div className="story-values"><span>Comfort comes first</span><span>Details matter</span><span>Style for every age</span></div>
            <a className="underlined-link" href="#footer">Get to know our story <ArrowRight size={14} /></a>
          </div>
        </div>
      </section>

      <section className="reviews section-shell">
        <div className="section-heading">
          <div><p className="eyebrow">FROM OUR WARDROBE TO YOURS</p><h2>Loved, worn & loved again.</h2></div>
          <p className="section-aside">Little notes from our lovely customers</p>
        </div>
        <div className="review-grid">
          {reviews.map((review) => <article className="review" key={review.author}>
            <div className="stars" aria-label="5 out of 5 stars">★★★★★</div>
            <blockquote>{review.quote}</blockquote>
            <p className="review-author">{review.author}</p>
            <p className="review-item">{review.item}</p>
          </article>)}
        </div>
      </section>

      <section className="journal section-shell">
        <div className="section-heading">
          <div><p className="eyebrow">A LITTLE INSPIRATION</p><h2>Notes from the wardrobe</h2></div>
          <SectionLink>Explore the journal</SectionLink>
        </div>
        <div className="journal-grid">
          {journal.map((entry) => <article className="journal-card" key={entry.title}>
            <a href="#journal"><img src={`/images/${entry.image}`} alt="" /></a>
            <p className="journal-meta">{entry.meta}</p>
            <h3>{entry.title}</h3>
            <p className="journal-copy">{entry.copy}</p>
            <a className="underlined-link" href="#journal">Read the story <ArrowRight size={14} /></a>
          </article>)}
        </div>
      </section>

      <section className="trust-strip">
        <div className="trust-inner">
          {trust.map(({ icon: Icon, title, copy }) => <div className="trust-item" key={title}>
            <Icon aria-hidden="true" size={22} strokeWidth={1.4} />
            <div><h3>{title}</h3><p>{copy}</p></div>
          </div>)}
        </div>
      </section>

      <section className="newsletter">
        <div className="newsletter-inner">
          <div>
            <p className="eyebrow">YOU'RE ALWAYS WELCOME HERE</p>
            <h2>A lovely thing in your inbox.</h2>
            <p>Be the first to discover new collections, style notes and little treats, reserved for our wardrobe community.</p>
          </div>
          <form onSubmit={(event) => { event.preventDefault(); if (email.trim()) setSubmitted(true); }}>
            <label className="visually-hidden" htmlFor="newsletter-email">Your email address</label>
            <input suppressHydrationWarning id="newsletter-email" type="email" placeholder="Your email address" value={email} onChange={(event) => { setEmail(event.target.value); setSubmitted(false); }} required />
            <button type="submit" aria-pressed={submitted}>COUNT ME IN <ArrowRight size={15} /></button>
            <p>By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.</p>
          </form>
        </div>
      </section>

      <footer className="footer" id="footer">
        <div className="footer-main">
          <div className="footer-brand">
            <img src="/images/logo.png" alt="Anastasia's Wardrobe" />
            <p>Beautifully chosen.<br />For every chapter of her life.</p>
            <div className="socials"><a href="#footer" aria-label="Instagram"><Instagram /></a><a href="#footer" aria-label="Facebook"><Facebook /></a><a href="#footer" className="pinterest">P</a></div>
          </div>
          <div className="footer-column"><h3>EXPLORE</h3><a href="#new-arrivals">New arrivals</a><a href="#departments">Kids Wear · 2–6</a><a href="#departments">Girls Wear · 7–12</a><a href="#departments">Teens · 13–17</a><a href="#departments">Women</a><a href="#new-arrivals">Occasion Wear</a><a href="#new-arrivals">Sale</a></div>
          <div className="footer-column"><h3>HERE TO HELP</h3><a href="#footer">Contact us</a><a href="#footer">Size guide</a><a href="#footer">Shipping & delivery</a><a href="#footer">Returns & exchanges</a><a href="#footer">Track your order</a><a href="#footer">FAQs</a><a href="#footer">Care guide</a></div>
          <div className="footer-column footer-contact"><h3>LET'S KEEP IN TOUCH</h3><p>A question about a size, a style, or something special? Write to us.</p><a href="mailto:hello@anastaliaswardrobe.com">hello@anastaliaswardrobe.com</a><p>Customer care<br />Monday–Saturday · 10 am–6 pm IST</p><a className="footer-story" href="#story">The story behind our wardrobe</a></div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Anastasia's Wardrobe. All rights reserved.</p>
          <div className="payment-marks" aria-label="Accepted payment methods"><span>VISA</span><span>mastercard</span><span>AMEX</span><span>UPI</span><span>RuPay</span></div>
          <div><a href="#footer">Privacy policy</a><a href="#footer">Terms of service</a></div>
        </div>
      </footer>
    </main>
  );
}
