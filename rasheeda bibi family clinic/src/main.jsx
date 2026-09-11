import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const whatsappUrl =
  "https://wa.me/923392293742?text=Hello%20Dr.%20Ayesha%20Khalid%20Rao%2C%20I%20would%20like%20to%20book%20an%20appointment.";

const pages = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "visit", label: "Location" },
  { id: "contact", label: "Contact" },
];

const services = [
  { title: "Women's health consultation", description: "Personalized gynecology consultation for ongoing health and wellness." },
  { title: "Pregnancy and antenatal care", description: "Supportive guidance throughout pregnancy, checkups, and maternal well-being." },
  { title: "Gynecology evaluation", description: "Clear assessment and counseling for reproductive health concerns." },
  { title: "Family care guidance", description: "Trusted advice that supports healthy family planning and care decisions." },
  { title: "Postnatal follow-up", description: "Gentle recovery support and follow-up care after childbirth." },
  { title: "Referral guidance when needed", description: "Thoughtful coordination for additional specialist support when required." },
];

function IconChip({ type }) {
  const icons = {
    about: "✦",
    services: "❋",
    location: "⌂",
    contact: "✆",
  };

  return <span className="icon-chip" aria-hidden="true">{icons[type] || "✦"}</span>;
}

function useRoute() {
  const getRoute = () => window.location.hash.replace("#/", "") || "home";
  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const handleHash = () => setRoute(getRoute());
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  return pages.some((page) => page.id === route) ? route : "home";
}

function useScrollReveal() {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [elementRef, isVisible];
}

function usePageAnimations(route) {
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal-on-scroll");
    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [route]);
}

function BrandMark({ compact = false }) {
  return (
    <a className={compact ? "nav-brand" : "brand-lockup"} href="#/" aria-label="Rasheeda Bibi Family Care Clinic home">
      {compact ? (
        <>
          <img
            className="nav-brand-logo"
            src="/logo.png"
            alt="Rasheeda Bibi Family Care Clinic logo"
          />
          <div className="nav-wordmark-wrap">
            <span className="nav-wordmark">Rasheeda Bibi</span>
            <span className="nav-subtitle">Family Care Clinic</span>
          </div>
        </>
      ) : (
        <img
          className="brand-logo"
          src="/logo.png"
          alt="Rasheeda Bibi Family Care Clinic logo"
        />
      )}
    </a>
  );
}

function AppointmentButton({ subtle = false }) {
  return (
    <a
      className={subtle ? "appointment-button appointment-button--subtle" : "appointment-button"}
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Book appointment on WhatsApp with Dr. Ayesha Khalid Rao"
    >
      <span>Book Appointment</span>
      <span aria-hidden="true">↗</span>
    </a>
  );
}

function Header({ route }) {
  return (
    <header className={`site-header${route !== "home" ? " site-header--inner" : ""}`}>
      <BrandMark compact />
      <nav className="site-nav" aria-label="Primary navigation">
        {pages.map((page) => (
          <a key={page.id} href={`#/${page.id === "home" ? "" : page.id}`} aria-current={route === page.id ? "page" : undefined}>
            {page.label}
          </a>
        ))}
      </nav>
      <AppointmentButton subtle />
    </header>
  );
}

function HomePage() {
  const [whiteSectionRef, whiteSectionVisible] = useScrollReveal();

  return (
    <main className="page-shell page-shell--home">
      <div
        className="hero-photo"
        role="img"
        aria-label="A calm maternity care moment with a mother holding a newborn in a hospital room"
      />
      <div className="hero-wash" aria-hidden="true" />

      <section className="hero-content" aria-labelledby="doctor-name">
        <div className="hero-copy reveal-on-scroll">
          <h1 id="doctor-name">Dr. Ayesha Khalid Rao</h1>
          <div className="hero-identity">
            <p className="specialty">Consultant Gynecologist</p>
            <p className="credentials">M.B.B.S | D.G.O</p>
            <p className="hospital">Nishtar Hospital Multan</p>
          </div>
          <AppointmentButton />
        </div>

      </section>

      <aside className="quiet-details reveal-on-scroll" aria-label="Clinic timing and location">
        <span>7:00 PM — 9:00 PM · Mon–Sat</span>
        <span>Garden Town, Multan</span>
      </aside>

      <section
        ref={whiteSectionRef}
          className={`home-white-section${whiteSectionVisible ? " is-visible" : ""}`}
        aria-label="Ultrasound services"
      >
        <img
          className="home-ultrasound-image reveal-on-scroll"
          src="/ultrasound.png"
          alt="Ultrasound machine in use during a clinical examination"
        />
        <div className="ultrasound-booking-panel reveal-on-scroll">
          <p className="ultrasound-booking-kicker">Ultrasound services</p>
          <h2>Book for ultrasound</h2>
          <p>Request your ultrasound appointment directly through WhatsApp.</p>
          <a
            className="ultrasound-booking-button"
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
          >
            Book Ultrasound <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

    </main>
  );
}

function PageFrame({ eyebrow, title, children }) {
  const [pageRef, pageVisible] = useScrollReveal();

  return (
    <main ref={pageRef} className={`inner-page page-transition${pageVisible ? " is-visible" : ""}`}>
      <section className="inner-hero reveal-on-scroll">
        <p className="inner-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
      </section>
      {children}
    </main>
  );
}

function AboutPage() {
  return (
    <PageFrame eyebrow="Consultant Gynecologist" title="Care with restraint, privacy, and clinical clarity.">
      <section className="editorial-grid reveal-on-scroll">
        <div className="editorial-copy">
          <p>
            Dr. Ayesha Khalid Rao provides women's healthcare consultation at Rasheeda Bibi Family Care Clinic in
            Multan, with a warm and private experience for patients and families.
          </p>
          <p>
            The clinic is designed around calm consultation, respectful guidance, and access to trusted medical care
            with a modern, reassuring approach.
          </p>
        </div>

        <div className="info-stack reveal-on-scroll">
          <div className="info-block reveal-on-scroll">
            <div className="block-header">
              <IconChip type="about" />
              <span>Doctor</span>
            </div>
            <strong>Dr. Ayesha Khalid Rao</strong>
          </div>
          <div className="info-block reveal-on-scroll">
            <div className="block-header">
              <IconChip type="services" />
              <span>Credentials</span>
            </div>
            <strong>M.B.B.S | D.G.O</strong>
          </div>
          <div className="info-block reveal-on-scroll">
            <div className="block-header">
              <IconChip type="location" />
              <span>Hospital</span>
            </div>
            <strong>Nishtar Hospital Multan</strong>
          </div>
        </div>
      </section>
    </PageFrame>
  );
}

function ServicesPage() {
  return (
    <PageFrame eyebrow="Clinical Focus" title="Essential women's and family care services.">
      <section className="service-grid reveal-on-scroll" aria-label="Clinic services">
        {services.map((service, index) => (
          <article key={service.title} className="service-card reveal-on-scroll">
            <div className="service-card-top">
              <span className="service-index">{String(index + 1).padStart(2, "0")}</span>
              <IconChip type="services" />
            </div>
            <h2>{service.title}</h2>
            <p>{service.description}</p>
          </article>
        ))}
      </section>
    </PageFrame>
  );
}

function VisitPage() {
  return (
    <PageFrame eyebrow="Location" title="A calm, private clinic in the heart of Garden Town.">
      <section className="info-grid location-grid reveal-on-scroll">
        <div className="info-block highlight-block reveal-on-scroll">
          <div className="block-header">
            <IconChip type="location" />
            <span>Timing</span>
          </div>
          <strong>7:00 PM - 9:00 PM</strong>
          <p>Monday - Saturday</p>
        </div>

        <div className="info-block highlight-block reveal-on-scroll">
          <div className="block-header">
            <IconChip type="location" />
            <span>Address</span>
          </div>
          <strong>Gulshan E Khaliq</strong>
          <p>Near Qurtaba Mosque, Garden Town, Multan</p>
        </div>

        <div className="info-block highlight-block full-width reveal-on-scroll">
          <div className="block-header">
            <IconChip type="contact" />
            <span>Visit</span>
          </div>
          <p>Comfortable, family-focused consultation in a quiet neighborhood setting.</p>
          <a
            className="location-link"
            href="https://maps.google.com/?q=Gulshan+E+Khaliq+Near+Qurtaba+Mosque+Garden+Town+Multan"
            target="_blank"
            rel="noreferrer"
          >
            Open in Maps
          </a>
        </div>
      </section>
    </PageFrame>
  );
}

function ContactPage() {
  return (
    <PageFrame eyebrow="Appointments" title="Book directly through WhatsApp.">
      <section className="contact-panel reveal-on-scroll">
        <p>
          For appointment requests, use WhatsApp so the clinic can receive your message with the doctor name already
          included.
        </p>

        <div className="info-grid contact-grid">
          <div className="info-block highlight-block reveal-on-scroll">
            <div className="block-header">
              <IconChip type="contact" />
              <span>WhatsApp</span>
            </div>
            <strong>Book Appointment</strong>
            <a href={whatsappUrl} target="_blank" rel="noreferrer">Start chat</a>
          </div>

          <div className="info-block highlight-block reveal-on-scroll">
            <div className="block-header">
              <IconChip type="location" />
              <span>Phone</span>
            </div>
            <strong>0339-2293742</strong>
            <a href="tel:03392293742">Call now</a>
          </div>

          <div className="info-block highlight-block full-width reveal-on-scroll">
            <div className="block-header">
              <IconChip type="services" />
              <span>Consultation</span>
            </div>
            <strong>7:00 PM - 9:00 PM</strong>
            <p>Monday - Saturday</p>
          </div>
        </div>

        <AppointmentButton />
      </section>
    </PageFrame>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <div className="footer-mark">
          <img src="/logo.png" alt="Rasheeda Bibi Family Care Clinic logo" />
        </div>
        <div className="footer-wordmark-wrap">
          <span className="footer-wordmark">Rasheeda Bibi</span>
          <span className="footer-subtitle">Family Care Clinic</span>
        </div>
      </div>

      <nav className="footer-nav" aria-label="Footer navigation">
        <a href="#/">Home</a>
        <a href="#/about">About</a>
        <a href="#/services">Services</a>
        <a href="#/visit">Location</a>
        <a href="#/contact">Contact</a>
      </nav>

      <div className="footer-cta">
        <p>Ready to book your visit?</p>
        <a href={whatsappUrl} target="_blank" rel="noreferrer">Book Appointment <span aria-hidden="true">↗</span></a>
      </div>
    </footer>
  );
}

function App() {
  const route = useRoute();
  usePageAnimations(route);
  const page = useMemo(() => {
    if (route === "about") return <AboutPage />;
    if (route === "services") return <ServicesPage />;
    if (route === "visit") return <VisitPage />;
    if (route === "contact") return <ContactPage />;
    return <HomePage />;
  }, [route]);

  return (
    <>
      <Header route={route} />
      {page}
      <Footer />
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
