import { motion } from 'framer-motion';

interface SaltParticlesProps {
  show: boolean;
}

export function SaltParticles({ show }: SaltParticlesProps) {
  if (!show) return null;

  // Create 20 salt particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    delay: i * 0.05,
    duration: 0.8 + Math.random() * 0.4,
    startX: -20 + Math.random() * 40,
    swayX: -30 + Math.random() * 60,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute w-1.5 h-1.5 bg-white rounded-full"
          style={{
            left: '50%',
            top: '20%',
            marginLeft: '-3px',
            marginTop: '-3px',
          }}
          initial={{
            x: particle.startX,
            y: 0,
            opacity: 0.8,
          }}
          animate={{
            x: particle.swayX,
            y: 200,
            opacity: 0,
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  );
}
