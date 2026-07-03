/**
 * FeaturedProjects — Homepage section showing top 3 featured projects.
 * Links to full portfolio page.
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Container, SectionHeading, Card, Badge, Button } from '@/components/ui'
import { useProjects } from '@/hooks/useProjects'
import { fadeUp, staggerContainer, viewportOnce } from '@/utils/motion'
import { ProjectModal } from '@/components/sections/PortfolioSection'

const PLACEHOLDER_FEATURED = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    clientName: 'Retail Client, Bhilwara',
    category: 'Web',
    isFeatured: true,
    technologies: ['React', 'Node.js', 'PostgreSQL'],
    description:
      'A full-stack e-commerce platform with inventory management, payment integration, and admin dashboard.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Digital Marketing Campaign',
    clientName: 'Fashion Brand, Jaipur',
    category: 'Marketing',
    isFeatured: true,
    technologies: ['Google Ads', 'Meta Ads', 'SEO'],
    description: 'Multi-channel digital marketing campaign achieving 3x ROI within 3 months.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Corporate Brand Identity',
    clientName: 'Manufacturing Co., Bhilwara',
    category: 'Branding',
    isFeatured: true,
    technologies: ['Figma', 'Illustrator'],
    description:
      'Complete brand identity design including logo, brand guidelines, and marketing collateral.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80&auto=format&fit=crop',
  },
]

export default function FeaturedProjects() {
  const [selectedProject, setSelectedProject] = useState(null)
  const { data, isLoading } = useProjects({ featured: true })

  const projects = data?.data?.length
    ? data.data.slice(0, 3)
    : isLoading
      ? []
      : PLACEHOLDER_FEATURED

  return (
    <section className="py-20 bg-bg-base" aria-labelledby="featured-heading">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
        >
          <SectionHeading
            id="featured-heading"
            eyebrow="Case Studies"
            title="Featured Projects"
            subtitle="A glimpse of the work we're most proud of."
            className="mb-14"
          />
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse" />
              ))
            : projects.map((p) => (
                <motion.div key={p.id} variants={fadeUp}>
                  <Card
                    hoverable
                    className="overflow-hidden group cursor-pointer"
                    onClick={() => setSelectedProject(p)}
                  >
                    {p.thumbnailUrl ? (
                      <img
                        src={p.thumbnailUrl}
                        alt={p.title}
                        className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="w-full h-44 bg-gradient-to-br from-brand-blue/8 to-brand-blue/18
                        flex items-center justify-center"
                      >
                        <span className="font-heading text-5xl font-bold text-brand-blue/15">
                          {p.title[0]}
                        </span>
                      </div>
                    )}
                    <div className="p-5">
                      <Badge variant="blue" className="mb-2">
                        {p.category}
                      </Badge>
                      <h3 className="font-heading text-base font-semibold text-brand-blue mb-1">
                        {p.title}
                      </h3>
                      <p className="text-xs text-text-muted">{p.clientName}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
        </motion.div>

        <div className="text-center mt-10">
          <Button variant="outline" size="md" as={Link} to="/portfolio">
            View All Projects <ArrowRight className="w-4 h-4 inline ml-1" />
          </Button>
        </div>
      </Container>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  )
}
