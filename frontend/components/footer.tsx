"use client"

import Link from "next/link"
import Image from "next/image"
import { getLogoUrl, handleImageError } from "@/lib/image-utils"
import { motion } from "framer-motion"

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-black">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <motion.div
            className="flex flex-col space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src={getLogoUrl() || "/placeholder.svg"}
                alt="CDL Insider Logo"
                width={40}
                height={40}
                className="h-10 w-10"
                onError={(e) => handleImageError(e, 40, 40)}
              />
              <span className="text-xl font-bold">CDL INSIDER</span>
            </Link>
            <p className="text-sm text-zinc-400">
              The ultimate source for Call of Duty League statistics and information.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:col-span-2">
            <motion.div
              className="flex flex-col space-y-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold">Navigation</h3>
              <Link href="/" className="text-sm text-zinc-400 hover:text-white">
                Home
              </Link>
              <Link href="/player-stats" className="text-sm text-zinc-400 hover:text-white">
                Player Stats
              </Link>
              <Link href="/top-players" className="text-sm text-zinc-400 hover:text-white">
                Top Players
              </Link>
              <Link href="/teams-standings" className="text-sm text-zinc-400 hover:text-white">
                Teams Standings
              </Link>
            </motion.div>

            <motion.div
              className="flex flex-col space-y-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold">Legal</h3>
              <Link href="/privacy" className="text-sm text-zinc-400 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-zinc-400 hover:text-white">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-sm text-zinc-400 hover:text-white">
                Cookie Policy
              </Link>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="mt-8 border-t border-zinc-800 pt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-sm text-zinc-400">&copy; {new Date().getFullYear()} CDL Insider. All rights reserved.</p>
          <p className="mt-2 text-xs text-zinc-500">
            This website is created by Sohaib Shah and Wajih Us Sama and is not affiliated with Activision or the Call of Duty League.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
