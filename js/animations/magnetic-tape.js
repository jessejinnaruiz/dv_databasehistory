/**
 * Magnetic Tape Animation
 * Era 2: 1960s-1970s - The Magnetic Age
 * 
 * Visualizes: Tape reels with magnetic particles flowing
 */

export function initMagneticTape(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return null;
  
  container.innerHTML = '';
  
  const width = 400;
  const height = 250;
  
  const svg = d3.select(container)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('max-width', '400px');
  
  // Title
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .attr('fill', '#888')
    .attr('font-size', '12px')
    .text('Magnetic Tape Reel');
  
  // Left reel
  svg.append('circle')
    .attr('cx', 100)
    .attr('cy', 130)
    .attr('r', 60)
    .attr('fill', '#2a2a2a')
    .attr('stroke', '#444')
    .attr('stroke-width', 3);
  
  svg.append('circle')
    .attr('cx', 100)
    .attr('cy', 130)
    .attr('r', 20)
    .attr('fill', '#1a1a1a');
  
  // Right reel
  svg.append('circle')
    .attr('cx', 300)
    .attr('cy', 130)
    .attr('r', 45)
    .attr('fill', '#2a2a2a')
    .attr('stroke', '#444')
    .attr('stroke-width', 3);
  
  svg.append('circle')
    .attr('cx', 300)
    .attr('cy', 130)
    .attr('r', 20)
    .attr('fill', '#1a1a1a');
  
  // Tape path (connecting line)
  const tapePath = svg.append('path')
    .attr('d', 'M160,130 Q200,180 240,130')
    .attr('fill', 'none')
    .attr('stroke', '#8B4513')
    .attr('stroke-width', 8)
    .attr('stroke-linecap', 'round');
  
  // Magnetic particles (small arrows showing direction)
  const particles = [];
  for (let i = 0; i < 12; i++) {
    particles.push({
      id: i,
      t: i / 12,
      direction: Math.random() > 0.5 ? 1 : -1
    });
  }
  
  const particleGroup = svg.append('g').attr('class', 'particles');
  
  const particleElements = particleGroup.selectAll('.particle')
    .data(particles)
    .enter()
    .append('g')
    .attr('class', 'particle')
    .attr('opacity', 0);
  
  // Each particle is a small arrow
  particleElements.append('polygon')
    .attr('points', '-6,0 0,-4 6,0 0,4')
    .attr('fill', d => d.direction > 0 ? '#ff6b6b' : '#4ecdc4');
  
  // Animation state
  let hasPlayed = false;
  let animationTimer = null;
  
  // Function to get point along the tape path
  function getPointOnPath(t) {
    // Simple quadratic bezier: P0(160,130), P1(200,180), P2(240,130)
    const p0 = { x: 160, y: 130 };
    const p1 = { x: 200, y: 180 };
    const p2 = { x: 240, y: 130 };
    
    const x = (1-t)*(1-t)*p0.x + 2*(1-t)*t*p1.x + t*t*p2.x;
    const y = (1-t)*(1-t)*p0.y + 2*(1-t)*t*p1.y + t*t*p2.y;
    
    return { x, y };
  }
  
  return {
    play: function() {
      if (hasPlayed) return;
      hasPlayed = true;
      
      // Fade in particles
      particleElements
        .transition()
        .delay((d, i) => i * 100)
        .duration(300)
        .attr('opacity', 1);
      
      // Animate particles along path
      function animateParticles() {
        particles.forEach(p => {
          p.t = (p.t + 0.01) % 1;
        });
        
        particleElements
          .attr('transform', d => {
            const pos = getPointOnPath(d.t);
            const rotation = d.direction > 0 ? 0 : 180;
            return `translate(${pos.x}, ${pos.y}) rotate(${rotation})`;
          });
        
        animationTimer = requestAnimationFrame(animateParticles);
      }
      
      setTimeout(animateParticles, 1000);
    },
    
    reset: function() {
      hasPlayed = false;
      if (animationTimer) {
        cancelAnimationFrame(animationTimer);
      }
      particleElements.attr('opacity', 0);
    }
  };
}
