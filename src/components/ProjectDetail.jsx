import { Link, useParams } from "react-router-dom";
import PlaceholderImage from "./PlaceholderImage";
//  React, defined but never used.
import { useEffect } from "react";

const PROJECTS = [
  {
    id: 0,
    title: "Solitude in Light",
    category: "Portrait Photography",
    year: "2024",
    description:
      "A study in natural light and shadow, exploring the quiet moments between stillness and movement. Each frame captured at the golden hour, tracing the contours of solitude through a contemporary lens.",
    tags: ["Photography", "Portrait", "Fine Art"],
    image:
      "https://images.unsplash.com/photo-1774606570918-aa9d70b2932b?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 1,
    title: "Architecture Study",
    category: "Architecture & Space",
    year: "2024",
    description:
      "Mapping the invisible grammar of cities — the way facades speak, streets breathe, and buildings lean into each other like old friends. A visual language for the built environment.",
    tags: ["Architecture", "Urban", "Documentary"],
    image:
      "https://images.unsplash.com/photo-1774523195578-121a2d1da490?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    title: "Chromatic Fields",
    category: "Abstract Colour Study",
    year: "2023",
    description:
      "An immersive investigation into the emotional resonance of colour as a primary subject. No objects, no narratives — only the raw experience of chromatic tension and release.",
    tags: ["Abstract", "Colour", "Installation"],
    image:
      "https://images.unsplash.com/photo-1773772255047-74744067601e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    title: "Temporal Drift",
    category: "Long Exposure Series",
    year: "2023",
    description:
      "Time made visible. Long exposures stretching seconds into luminous trails, transforming the ordinary flow of life into something closer to memory — impressionistic, layered, irreversible.",
    tags: ["Photography", "Long Exposure", "Time"],
    image:
      "https://images.unsplash.com/photo-1749303544314-cb8ec06223d5?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    title: "Verdant Systems",
    category: "Nature & Botany",
    year: "2022",
    description:
      "Nature as infrastructure. Botanical forms examined through the lens of systems thinking — root networks, branching hierarchies, and the elegant logic that underpins all organic growth.",
    tags: ["Botany", "Nature", "Systems"],
    image:
      "https://images.unsplash.com/photo-1775119221769-6b0af28704ed?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 5,
    title: "Still Life, Moving",
    category: "Object & Materiality",
    year: "2022",
    description:
      "Objects caught mid-gesture. A re-examination of the still life tradition — surfaces, textures, and the uncanny sense that every object is in the process of becoming something else entirely.",
    tags: ["Still Life", "Material", "Contemporary"],
    image:
      "https://images.unsplash.com/photo-1775563655673-c28ac3802166?q=80&w=1228&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const ProjectDetail = () => {
  const { id } = useParams();
  const detail = PROJECTS[parseInt(id)];

  const previous =
    PROJECTS[(parseInt(id) - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(parseInt(id) + 1) % PROJECTS.length];
  const gallery = [
    {
      placement: "gallery-feature",
      src: detail.image,
      alt: `${detail.title} featured photograph`,
      label: "Featured image",
    },
    {
      placement: "gallery-detail-top",
      src: detail.image,
      alt: `${detail.title} close-up detail`,
      label: "Detail study",
    },
    {
      placement: "gallery-detail-bottom",
      src: detail.image,
      alt: `${detail.title} secondary composition`,
      label: "Composition",
    },
    {
      placement: "gallery-wide",
      src: detail.image,
      alt: `${detail.title} wide project view`,
      label: "Full view",
    },
  ];

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [id]);

  return (
    <div key={id} className="project-detail">
      <div className="project-info">
        <div className="information">
          <p>{detail.description}</p>
        </div>
        <div className="moreinfo">
          <div className="title">
            <div className="head">
              <h3>Title</h3>
            </div>
            <div className="content">
              <h3>{detail.title}</h3>
            </div>
          </div>
          <div className="category">
            <div className="head">
              <h3>Category</h3>
            </div>
            <div className="content">
              <h3>{detail.category}</h3>
            </div>
          </div>
          <div className="tags">
            <div className="head">
              <h3>Tags</h3>
            </div>
            <div className="content">
              {detail.tags.map((tag) => {
                return (
                  <h3 key={tag}>{tag}</h3>
                );
              })}
            </div>
          </div>
          <div className="year">
            <div className="head">
              <h3>Year</h3>
            </div>
            <div className="content">
              <h3>{detail.year}</h3>
            </div>
          </div>
        </div>
      </div>
      <section
        className="project-gallery"
        aria-label={`${detail.title} image collage`}
      >
        {gallery.map((image, index) => (
          <figure
            key={image.placement}
            className={`gallery-item ${image.placement}`}
          >
            <PlaceholderImage
              src={image.src}
              alt={image.alt}
              loading={index === 0 ? "eager" : "lazy"}
            />
            <figcaption>
              <span>0{index + 1}</span>
              {image.label}
            </figcaption>
          </figure>
        ))}
      </section>

      <nav className="project-navigation" aria-label="Project navigation">
        <Link className="project-adjacent project-previous" to={`/project/${previous.id}`}>
          <span>Previous project</span>
          <strong>{previous.title}</strong>
        </Link>
        <Link
          className="return-to-circle"
          to="/"
          state={{ showCircle: true }}
        >
          Return to circle
        </Link>
        <Link className="project-adjacent project-next" to={`/project/${next.id}`}>
          <span>Next project</span>
          <strong>{next.title}</strong>
        </Link>
      </nav>
    </div>
  );
};

export default ProjectDetail;
