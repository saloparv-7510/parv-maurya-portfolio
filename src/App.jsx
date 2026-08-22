import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import Preloader from './components/Preloader'
import BackgroundFX from './components/BackgroundFX'
import CustomCursor from './components/CustomCursor'
import ScrollProgress from './components/ScrollProgress'
import Navbar from './components/Navbar'

import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import NetworkingSkills from './components/NetworkingSkills'
import Education from './components/Education'
import Certifications from './components/Certifications'
import Projects from './components/Projects'
import Journey from './components/Journey'
import Interests from './components/Interests'
import Contact from './components/Contact'
import Footer from './components/Footer'

import { EASE } from './lib/motion'

/* ============================================================================
 *  App — composition root.
 *
 *  Section order is deliberate: identity → who → what I can do → proof →
 *  what I've built → how I got here → who I am outside work → how to reach me.
 *  Reorder freely; the navbar reads its links from src/data/content.js and the
 *  scroll spy follows whatever order the DOM ends up in.
 * ========================================================================== */
export default function App() {
  const [loading, setLoading] = useState(true)

  // Stable identity on purpose: the preloader's progress effect depends on this
  // callback, so a fresh arrow each render would restart the count from zero.
  const finishLoading = useCallback(() => setLoading(false), [])

  // Hold the page at the top during the preloader, so the reveal always starts
  // from the hero even on a refresh part-way down the page.
  useEffect(() => {
    if (!loading) return
    document.body.style.overflow = 'hidden'
    window.scrollTo(0, 0)
    return () => {
      document.body.style.overflow = ''
    }
  }, [loading])

  return (
    <>
      <AnimatePresence>{loading && <Preloader onDone={finishLoading} />}</AnimatePresence>

      {/* Persistent chrome */}
      <BackgroundFX />
      <CustomCursor />
      <ScrollProgress />

      {/* Skip link — the first thing a keyboard user hits */}
      <a
        href="#main"
        className="sr focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200]
                   focus:rounded-full focus:bg-accent-400 focus:px-4 focus:py-2
                   focus:font-medium focus:text-ink-950"
      >
        Skip to content
      </a>

      <Navbar />

      {/* The whole page fades up once the preloader curtain has opened */}
      <motion.main
        id="main"
        initial={{ opacity: 0, y: 18 }}
        animate={loading ? { opacity: 0, y: 18 } : { opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 0.1 }}
        className="relative"
      >
        <Hero />
        <About />
        <Skills />
        <NetworkingSkills />
        <Education />
        <Certifications />
        <Projects />
        <Journey />
        <Interests />
        <Contact />
      </motion.main>

      <Footer />
    </>
  )
}
