import { useRef, useState } from 'react'

import logo from './assets/logo.png'
import footerLogo from "./assets/logo-complete.webp"

function getRandomNumber(min: number = 0, max: number = 99) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function Time({ time }: { time: number }) {
  return (
    <span>{String(Math.floor(time / 100)).padStart(2, '0')}.{String(time % 100).padEnd(2, '0')}</span>
  )
}

function App() {
  const [status, setStatus] = useState<'init' | 'playing' | 'finished'>('init')
  const [cell, setCell] = useState<number>(() => getRandomNumber())
  const [score, setScore] = useState<number>(0)
  const [time, setTime] = useState<number>(0)
  const [best, setBest] = useState<number>(() => window.localStorage.getItem('best') ? Number(window.localStorage.getItem('best')) : 0)
  const timer = useRef<number>()

  function handleCellClick() {
    const newScore = score + 1

    setScore(newScore)

    if (newScore === 10) {
      setStatus('finished')
      clearInterval(timer.current)

      if (time < best || best === 0) {
        setBest(time)
        window.localStorage.setItem('best', String(time))
      }
    } else {
      setCell(getRandomNumber())
    }
  }

  function handleStart() {
    setStatus('playing')
    setCell(getRandomNumber())
    setScore(0)
    setTime(0)

    timer.current = setInterval(() => setTime(time => time + 1), 10)
  }

  return (
    <main style={{ display: 'grid', gridTemplateRows: '60px 1fr 60px', height: '100vh' }}>
      <header style={{ alignItems: 'center', justifyContent: 'space-between', display: 'flex', fontFamily: 'monospace', fontSize: 24, padding: '0 12px' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
          <Time time={time} />
          {Boolean(best) && <span style={{ fontSize: 14 }}>(Best: <Time time={best} />)</span>}
        </div>
        <span>{score}</span>
      </header>
      {status === 'playing' && (
        <section
          style={{
            height: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(10, 1fr)',
            gridTemplateRows: 'repeat(10, 1fr)',
            placeItems: 'center'
          }}
        >
          {Array.from({ length: 100 }, (_, i) => (
            <img
              key={i}
              onClick={() => cell === i && handleCellClick()}
              style={{
                opacity: cell === i ? 1 : 0,
                width: '50px',
                height: '50px',
                cursor: cell === i ? 'pointer' : 'auto'
              }}
              src={logo}
            />
          ))}
        </section>
      )}
      {status === 'init' && (
        <section style={{ display: 'grid', placeContent: 'center' }}>
          <button
            onClick={handleStart}
          >
            Start
          </button>
        </section>
      )}
      {status === 'finished' && (
        <section style={{ display: 'grid', placeContent: 'center', fontSize: 32, gap: 12 }}>
          <p>Game over!</p>
          <button onClick={handleStart}>
            Restart
          </button>
        </section>
      )}
      <footer style={{ placeContent: 'center', display: 'grid' }}>
        <img src={footerLogo} alt="Kopius" style={{ height: '50px' }} />
      </footer>
    </main>
  )
}

export default App
