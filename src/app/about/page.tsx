import type { Metadata } from 'next'
import {
  Trophy,
  GraduationCap,
  Code2,
  Mail,
  Link as LinkIcon,
  FlaskConical,
} from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ContactForm } from '@/components/about/ContactForm'

export const metadata: Metadata = {
  title: 'About',
  description:
    'About Popsuk (Pop) Sumetchoengprachya — IPhO bronze medalist, CS student at SUTD.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Hero />
      <Achievements />
      <ResearchAndProjects />
      <Contact />
    </div>
  )
}

function Hero() {
  return (
    <section className="mb-16">
      <h1 className="text-4xl font-bold tracking-tight">Popsuk (Pop) Sumetchoengprachya</h1>
      <p className="mt-2 text-lg text-muted-foreground">
        IPhO Bronze Medalist · CS @ SUTD · Physics Educator
      </p>
      <p className="mt-4 max-w-2xl text-base leading-relaxed">
        IPhO Bronze Medalist and CS student at SUTD building{' '}
        <span className="font-medium">Apex Physics</span> to help future
        olympiad participants master physics problem-solving. Passionate about
        combining rigorous physics foundations with elegant code.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href="https://github.com/popsukss"
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: 'outline', size: 'sm' })}
        >
          <LinkIcon className="size-4" />
          GitHub
        </a>
        <a
          href="https://linkedin.com/in/popsuk-sumetchoengprachya/"
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: 'outline', size: 'sm' })}
        >
          <LinkIcon className="size-4" />
          LinkedIn
        </a>
        <a
          href="mailto:popsukss@gmail.com"
          className={buttonVariants({ variant: 'outline', size: 'sm' })}
        >
          <Mail className="size-4" />
          Email
        </a>
      </div>
    </section>
  )
}

function Achievements() {
  const achievements = [
    {
      icon: Trophy,
      title: 'IPhO 2024 Bronze Medal',
      description: '55th International Physics Olympiad, represented Thailand',
    },
    {
      icon: Trophy,
      title: 'APhO 2024 Bronze Medal',
      description: '24th Asian Physics Olympiad',
    },
    {
      icon: GraduationCap,
      title: 'SUTD GPA 4.93/5.00',
      description: 'ASEAN Scholarship, Honours List 2024/2025',
    },
    {
      icon: Code2,
      title: 'IMMC 2024 Meritorious Award',
      description: 'Top 8 of 68 teams, 36 countries',
    },
    {
      icon: FlaskConical,
      title: 'HiMCM 2023 Finalist Award',
      description: 'Top 7% of 967 teams',
    },
    {
      icon: GraduationCap,
      title: 'Japan Super Science Fair 2023',
      description: 'Magnetic Mechanical Oscillator — Lagrangian mechanics',
    },
  ]

  return (
    <section className="mb-16">
      <h2 className="mb-8 text-2xl font-bold tracking-tight">Achievements</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {achievements.map((achievement, idx) => {
          const Icon = achievement.icon
          return (
            <div
              key={idx}
              className={cn(
                'rounded-lg border border-border bg-muted/30 p-4',
                'transition-colors hover:bg-muted/50'
              )}
            >
              <div className="flex items-start gap-3">
                <Icon className="mt-1 size-5 flex-shrink-0 text-primary" />
                <div className="min-w-0">
                  <h3 className="font-semibold">{achievement.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function ResearchAndProjects() {
  const items = [
    {
      icon: FlaskConical,
      title: 'A*STAR Q.InC. Quantum Research Intern',
      period: 'Sep–Nov 2025',
      description:
        'Black phosphorus quantum devices, NanoFrazor thermal scanning probe lithography',
    },
    {
      icon: Code2,
      title: 'Magnetic Mechanical Oscillator',
      period: 'Japan Super Science Fair 2023',
      description: 'Lagrangian mechanics model and simulation',
    },
  ]

  return (
    <section className="mb-16">
      <h2 className="mb-8 text-2xl font-bold tracking-tight">Research & Projects</h2>
      <div className="space-y-4">
        {items.map((item, idx) => {
          const Icon = item.icon
          return (
            <div
              key={idx}
              className={cn(
                'rounded-lg border border-border bg-muted/30 p-4',
                'transition-colors hover:bg-muted/50'
              )}
            >
              <div className="flex items-start gap-3">
                <Icon className="mt-1 size-5 flex-shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.period}</p>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section>
      <h2 className="mb-8 text-2xl font-bold tracking-tight">Get in Touch</h2>
      <div className="rounded-lg border border-border bg-muted/30 p-6">
        <p className="mb-6 text-sm text-muted-foreground">
          Have a question about Apex Physics or want to collaborate? I'd love to hear
          from you.
        </p>
        <ContactForm />
      </div>
    </section>
  )
}
