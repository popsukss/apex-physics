import type { Metadata } from 'next'
import { AboutContent } from '@/components/about/AboutContent'

export const metadata: Metadata = {
  title: 'About',
  description:
    'About Popsuk (Pop) Sumetchoengprachya — IPhO bronze medalist, CS student at SUTD.',
}

export default function AboutPage() {
  return <AboutContent />
}
