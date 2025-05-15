"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

interface PlayerModeStatsProps {
  title: string
  kd: number | null
  killsPerMin: number | null
  damagePerMin?: number | null
  mapsPlayed: number | null
  extraStat?: {
    label: string
    value: number | null
  }
  extraStat2?: {
    label: string
    value: string | number | null
  }
}

export default function PlayerModeStats({
  title,
  kd,
  killsPerMin,
  damagePerMin,
  mapsPlayed,
  extraStat,
  extraStat2,
}: PlayerModeStatsProps) {
  if (!kd) {
    return null
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="bg-zinc-900">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              className="flex flex-col"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <span className="text-sm text-zinc-400">K/D</span>
              <span className="text-xl font-bold">{kd.toFixed(2)}</span>
            </motion.div>
            <motion.div
              className="flex flex-col"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <span className="text-sm text-zinc-400">
                {title === "Search & Destroy" ? "Kills Per Round" : "Kills Per 10 Min"}
              </span>
              <span className="text-xl font-bold">{killsPerMin?.toFixed(2) || "N/A"}</span>
            </motion.div>

            {damagePerMin && (
              <motion.div
                className="flex flex-col"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <span className="text-sm text-zinc-400">Damage Per 10 Min</span>
                <span className="text-xl font-bold">{damagePerMin.toFixed(0)}</span>
              </motion.div>
            )}

            {extraStat && (
              <motion.div
                className="flex flex-col"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <span className="text-sm text-zinc-400">{extraStat.label}</span>
                <span className="text-xl font-bold">
                  {extraStat.value?.toFixed ? extraStat.value.toFixed(2) : extraStat.value || "N/A"}
                </span>
              </motion.div>
            )}

            {extraStat2 && (
              <motion.div
                className="flex flex-col"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <span className="text-sm text-zinc-400">{extraStat2.label}</span>
                <span className="text-xl font-bold">{extraStat2.value || "N/A"}</span>
              </motion.div>
            )}

            <motion.div
              className="flex flex-col"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <span className="text-sm text-zinc-400">Maps Played</span>
              <span className="text-xl font-bold">{mapsPlayed || 0}</span>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
