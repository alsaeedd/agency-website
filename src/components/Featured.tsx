import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedText from './AnimatedText'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    id: 1,
    name: 'Punto Pago',
    description: 'The First Super-App in Latin America',
    image: 'https://cuberto.com/assets/projects/puntopago/cover.jpg',
  },
  {
    id: 2,
    name: 'DaoWay',
    description: 'Astrology planner app: plan, achieve, thrive',
    image: 'https://cuberto.com/assets/projects/daoway/cover.jpg',
  },
  {
    id: 3,
    name: 'Riyadh',
    description: "Official website of Riyadh, Saudi Arabia's capital",
    image: 'https://cuberto.com/assets/projects/riyadh/cover.jpg',
  },
  {
    id: 4,
    name: 'Qvino',
    description: 'Wine marketplace with interactive learning',
    image: 'https://cuberto.com/assets/projects/qvino/cover.jpg',
  },
  {
    id: 5,
    name: 'Potion',
    description: 'Sales tool for increasing conversions',
    image: 'https://cuberto.com/assets/projects/potion/cover.jpg',
  },
  {
    id: 6,
    name: 'Cisco',
    description: 'Cloud based network management',
    image: 'https://cuberto.com/assets/projects/cisco/cover.jpg',
  },
  {
    id: 7,
    name: 'Kelvin Zero',
    description: 'A digital product for passwordless authentication',
    image: 'https://cuberto.com/assets/projects/kzero/cover.jpg',
  },
  {
    id: 8,
    name: 'Magma',
    description: 'The ultimate tool for building in the Web3 era',
    image: 'https://cuberto.com/assets/projects/magma/cover.jpg',
  },
]

export default function Featured() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cardsRef.current) return

    const cards = cardsRef.current.querySelectorAll('.project-card')

    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            once: true,
          },
          delay: (index % 2) * 0.1,
        }
      )
    })
  }, [])

  const leftColumn = projects.filter((_, i) => i % 2 === 0)
  const rightColumn = projects.filter((_, i) => i % 2 === 1)

  return (
    <section className="featured" id="projects" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <AnimatedText as="h2" className="section-title" triggerOnScroll stagger={0.1}>
            Featured projects
          </AnimatedText>
        </div>
        <div className="projects-grid" ref={cardsRef}>
          <div className="projects-col">
            {leftColumn.map((project) => (
              <a key={project.id} href="#" className="project-card" data-cursor="hover" data-cursor-text="Explore">
                <div className="project-card-preview">
                  <img src={project.image} alt={project.description} loading="lazy" />
                </div>
                <div className="project-card-caption">
                  <strong>{project.name}</strong> – {project.description}
                </div>
              </a>
            ))}
          </div>
          <div className="projects-col">
            {rightColumn.map((project) => (
              <a key={project.id} href="#" className="project-card" data-cursor="hover" data-cursor-text="Explore">
                <div className="project-card-preview">
                  <img src={project.image} alt={project.description} loading="lazy" />
                </div>
                <div className="project-card-caption">
                  <strong>{project.name}</strong> – {project.description}
                </div>
              </a>
            ))}
          </div>
        </div>
        <div className="section-action">
          <a href="#" className="btn-cta-inverse" data-cursor="hover">
            <span>View all projects</span>
          </a>
        </div>
      </div>
    </section>
  )
}
