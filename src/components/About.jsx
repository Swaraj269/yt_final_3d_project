import PlaceholderImage from "./PlaceholderImage";

const About = () => {
  return (
    <main className="about-page">
      <section className="about-copy">
        <p className="about-kicker">ABOUT</p>
        <h1 className="about-description">
          I&apos;m Swaraj Singh, a creative developer and designer focused on
          building immersive digital experiences. I blend design and code to
          craft visually striking websites, interactive animations, and dynamic
          3D environments. My work explores motion, WebGL, and Three.js to push
          beyond traditional web boundaries, turning ideas into engaging,
          high-performance experiences that feel alive and intuitive.
        </h1>
        <div className="about-contacts">
          <p className="about-kicker">CONTACT</p>
          <div className="about-contact-row">
            <span>Email</span>
            <a href="mailto:swarajsingh@gmail.com">swarajsingh@gmail.com</a>
          </div>
          <div className="about-contact-row">
            <span>Phone</span>
            <a href="tel:+9192929392">+91 92929392</a>
          </div>
        </div>
      </section>
      <figure className="about-image">
        <PlaceholderImage
          src="https://images.unsplash.com/photo-1774606570918-aa9d70b2932b?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Portrait from Swaraj Singh's creative portfolio"
          loading="eager"
        />
      </figure>
    </main>
  );
};

export default About;
