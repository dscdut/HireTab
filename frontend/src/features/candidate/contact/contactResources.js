import { HelpCircle, Users, Briefcase, MessageSquare, Shield, Clock, Phone, AlertTriangle } from 'lucide-react'

export const INQUIRY_TYPES = [
  {
    value: 'general',
    label: 'General Inquiry',
    description: 'General questions about our services',
    icon: HelpCircle
  },
  {
    value: 'support',
    label: 'Technical Support',
    description: 'Help with technical issues',
    icon: Users
  },
  {
    value: 'business',
    label: 'Business Partnership',
    description: 'Partnership and business opportunities',
    icon: Briefcase
  },
  {
    value: 'feedback',
    label: 'Feedback',
    description: 'Share your thoughts and suggestions',
    icon: MessageSquare
  }
]

export const CONTACT_BENEFITS = [
  {
    title: 'Secure',
    description: '256-bit SSL encryption',
    icon: Shield
  },
  {
    title: 'Fast Response',
    description: 'Reply within 24 hours',
    icon: Clock
  },
  {
    title: '24/7 Support',
    description: 'Always here to help',
    icon: Phone
  },
  {
    title: 'Expert Team',
    description: 'Professional assistance',
    icon: AlertTriangle
  }
]
