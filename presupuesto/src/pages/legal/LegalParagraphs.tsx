import { motion } from 'framer-motion'

export default function LegalParagraphs({ content }: { content: string }) {
  const paragraphs = content.split(/\n\s*\n/).filter(Boolean)
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.7, ease: 'easeOut' }}
      className="max-w-3xl space-y-6"
    >
      {paragraphs.map((p, i) => (
        <p key={i} className="text-[15px] text-on-surface-variant leading-relaxed whitespace-pre-line">
          {p}
        </p>
      ))}
    </motion.div>
  )
}