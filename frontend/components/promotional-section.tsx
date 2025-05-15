import Link from "next/link"
import Image from "next/image"

interface PromotionalSectionProps {
  title: string
  imageUrl: string
  link: string
}

export default function PromotionalSection({ title, imageUrl, link }: PromotionalSectionProps) {
  return (
    <Link href={link} className="group overflow-hidden rounded-lg">
      <div className="relative">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          width={800}
          height={400}
          className="aspect-[2/1] w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <h3 className="absolute bottom-4 left-4 right-4 text-lg font-bold text-white md:text-xl">{title}</h3>
      </div>
    </Link>
  )
}
