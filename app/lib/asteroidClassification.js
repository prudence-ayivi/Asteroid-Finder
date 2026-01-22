// Asteroid and small body orbital classification
export const ORBIT_TYPES = [
  {
    code: 'IEO',
    kind: 'A',
    title: 'Atira',
    description: 'An asteroid orbit contained entirely within the orbit of the Earth (Q < 0.983 au).'
  },
  {
    code: 'ATE',
    kind: 'A',
    title: 'Aten',
    description: 'Near-Earth asteroid orbits similar to that of 2062 Aten (a < 1.0 au; Q > 0.983 au).'
  },
  {
    code: 'APO',
    kind: 'A',
    title: 'Apollo',
    description: 'Near-Earth asteroid orbits which cross the Earth\'s orbit similar to that of 1862 Apollo (a > 1.0 au; q < 1.017 au).'
  },
  {
    code: 'AMO',
    kind: 'A',
    title: 'Amor',
    description: 'Near-Earth asteroid orbits similar to that of 1221 Amor (1.017 au < q < 1.3 au).'
  },
  {
    code: 'MCA',
    kind: 'A',
    title: 'Mars-crossing Asteroid',
    description: 'Asteroids that cross the orbit of Mars constrained by (1.3 au < q < 1.666 au; a < 3.2 au).'
  },
  {
    code: 'IMB',
    kind: 'A',
    title: 'Inner Main-belt Asteroid',
    description: 'Asteroids with orbital elements constrained by (a < 2.0 au; q > 1.666 au).'
  },
  {
    code: 'MBA',
    kind: 'A',
    title: 'Main-belt Asteroid',
    description: 'Asteroids with orbital elements constrained by (2.0 au < a < 3.2 au; q > 1.666 au).'
  },
  {
    code: 'OMB',
    kind: 'A',
    title: 'Outer Main-belt Asteroid',
    description: 'Asteroids with orbital elements constrained by (3.2 au < a < 4.6 au).'
  },
  {
    code: 'TJN',
    kind: 'A',
    title: 'Jupiter Trojan',
    description: 'Asteroids trapped in Jupiter\'s L4/L5 Lagrange points (4.6 au < a < 5.5 au; e < 0.3).'
  },
  {
    code: 'AST',
    kind: 'A',
    title: 'Asteroid',
    description: 'Asteroid orbit not matching any defined orbit class.'
  },
  {
    code: 'CEN',
    kind: 'A',
    title: 'Centaur',
    description: 'Objects with orbits between Jupiter and Neptune (5.5 au < a < 30.1 au).'
  },
  {
    code: 'TNO',
    kind: 'A',
    title: 'Trans-Neptunian Object',
    description: 'Objects with orbits outside Neptune (a > 30.1 au).'
  },
  {
    code: 'PAA',
    kind: 'A',
    title: 'Parabolic Asteroid',
    description: 'Asteroids on parabolic orbits (e = 1.0).'
  },
  {
    code: 'HYA',
    kind: 'A',
    title: 'Hyperbolic Asteroid',
    description: 'Asteroids on hyperbolic orbits (e > 1.0).'
  },
  {
    code: 'ETc',
    kind: 'C',
    title: 'Encke-type Comet',
    description: 'Encke-type comet, as defined by Levison and Duncan (Tj > 3; a < aJ).'
  },
  {
    code: 'JFc',
    kind: 'C',
    title: 'Jupiter-family Comet',
    description: 'Jupiter-family comet, as defined by Levison and Duncan (2 < Tj < 3).'
  },
  {
    code: 'JFC',
    kind: 'C',
    title: 'Jupiter-family Comet',
    description: 'Jupiter-family comet, classical definition (P < 20 y).'
  },
  {
    code: 'CTc',
    kind: 'C',
    title: 'Chiron-type Comet',
    description: 'Chiron-type comet, as defined by Levison and Duncan (Tj > 3; a > aJ).'
  },
  {
    code: 'HTC',
    kind: 'C',
    title: 'Halley-type Comet',
    description: 'Halley-type comet, classical definition (20 y < P < 200 y).'
  },
  {
    code: 'PAR',
    kind: 'C',
    title: 'Parabolic Comet',
    description: 'Comets on parabolic orbits (e = 1.0).'
  },
  {
    code: 'HYP',
    kind: 'C',
    title: 'Hyperbolic Comet',
    description: 'Comets on hyperbolic orbits (e > 1.0).'
  },
  {
    code: 'COM',
    kind: 'C',
    title: 'Comet',
    description: 'Comet orbit not matching any defined orbit class.'
  }
];

/**
 * Get orbit type info by code
 */
export function getOrbitType(code) {
  return ORBIT_TYPES.find(type => type.code === code) || null;
}

/**
 * Get orbit type title and code formatted
 */
export function getOrbitTypeLabel(code) {
  const orbitType = getOrbitType(code);
  if (!orbitType) return code;
  return `${orbitType.title} (${orbitType.code})`;
}
