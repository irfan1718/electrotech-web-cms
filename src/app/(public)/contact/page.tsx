import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import PageHero from '@/components/public/PageHero'
import ContactForm from '@/components/public/ContactForm'
import UAEMap from '@/components/public/UAEMap'
import SectionHeading from '@/components/public/SectionHeading'
import Animate from '@/components/public/Animate'

export async function generateMetadata() {
  return {
    title: 'Contact Us | Electrotech MEP',
    description: 'Get in touch with Electrotech for MEP engineering consultation.',
  }
}

const contactInfo = [
  { icon: Phone, label: 'Call Us', value: '+971 4 000 0000', href: 'tel:+97140000000' },
  { icon: Mail, label: 'Email Us', value: 'info@electrotech-uae.com', href: 'mailto:info@electrotech-uae.com' },
  { icon: MapPin, label: 'Head Office', value: 'Al Quoz Industrial Area 3, Dubai, UAE', href: '#' },
  { icon: Clock, label: 'Working Hours', value: 'Sun – Thu: 8 AM – 6 PM', href: '#' },
]

const officeCards = [
  {
    city: 'Dubai',
    tag: 'Head Office',
    address: 'Al Quoz Industrial Area 3, Dubai, U.A.E.',
    phone: '+971 4 000 0000',
    poBox: '67890',
  },
]

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="Get in touch for engineering consultation, project inquiries, or partnerships."
        breadcrumbs={[{ label: 'Contact' }]}
        image="/images/hero-section/contacts.png"
      />

      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
          <div className="mb-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((item, i) => (
              <Animate key={item.label} animation="fadeUp" delay={i * 100}>
                
                  <a href={item.href}
                  className="group block rounded-xl border border-neutral-100 p-6 transition-all hover:-translate-y-1 hover:border-[#C0152A]/20 hover:shadow-lg"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 transition-colors group-hover:bg-[#C0152A]">
                    <item.icon className="h-5 w-5 text-[#C0152A] transition-colors group-hover:text-white" />
                  </div>
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-neutral-400">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm font-medium text-neutral-700">{item.value}</p>
                </a>
              </Animate>
            ))}
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <Animate animation="fadeRight" delay={200}>
              <div>
                <h2 className="mb-2 text-2xl font-extrabold text-[#080808]">
                  Send Us a Message
                </h2>
                <p className="mb-8 text-sm text-neutral-500">
                  Fill out the form below and we&apos;ll get back to you within 24 hours.
                </p>
                <ContactForm />
              </div>
            </Animate>

            <Animate animation="fadeLeft" delay={200}>
              <div className="flex items-center">
                <div className="w-full rounded-xl border border-neutral-100 bg-[#F7F7F8] p-6">
                  <p className="mb-4 text-center font-mono text-[10.5px] uppercase tracking-[0.2em] text-neutral-400">
                    Our Office Locations
                  </p>
                  <UAEMap />
                </div>
              </div>
            </Animate>
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-100 bg-[#F7F7F8] py-20 lg:py-28">
        <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
          <Animate animation="fadeUp">
            <SectionHeading
              eyebrow="Our Offices"
              title="Locations Across"
              highlight="the UAE"
              center
            />
          </Animate>

          <div className="mt-14 flex justify-center">
            {officeCards.map((office) => (
              <Animate key={office.city} animation="scaleUp" delay={200}>
                <div className="group w-full max-w-md rounded-xl border border-neutral-100 bg-white p-7 transition-all hover:-translate-y-1 hover:border-neutral-200 hover:shadow-lg">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-extrabold text-[#080808]">{office.city}</h3>
                    <span className="rounded-full bg-red-50 px-3 py-1 text-[10px] font-semibold text-[#C0152A]">
                      {office.tag}
                    </span>
                  </div>

                  <div className="mb-5 h-[2px] w-8 bg-[#C0152A]" />

                  <div className="mb-4 flex items-start gap-2.5">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-neutral-400" />
                    <p className="text-[13px] leading-relaxed text-neutral-600">{office.address}</p>
                  </div>

                  
                    <a href={`tel:${office.phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-2.5 text-[13px] text-neutral-600 transition hover:text-[#C0152A]"
                  >
                    <Phone className="h-5 w-5 text-neutral-400" />
                    {office.phone}
                  </a>

                  {office.poBox && (
                    <p className="mt-2 flex items-center gap-2.5 text-[13px] text-neutral-500">
                      <Mail className="h-5 w-5 text-neutral-400" />
                      P.O. Box: {office.poBox}
                    </p>
                  )}

                  
                    <a href={`https://www.google.com/maps/search/${encodeURIComponent(office.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#C0152A] transition hover:underline"
                  >
                    View on Google Maps →
                  </a>
                </div>
              </Animate>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}