/**
 * Magnetic Tape Animation
 * Era 2: 1960s-1970s - The Magnetic Age
 * 
 * Visualizes: Tape reels with magnetic particles flowing
 * v3: Fixed tape path, added guide rollers, proper reel-to-reel connection
 */

export function initMagneticTape(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return null;
  
  container.innerHTML = '';
  
  const width = 400;
  const height = 300;
  
  const svg = d3.select(container)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('max-width', '400px');
  
  // Define gradient for tape
  const defs = svg.append('defs');
  const tapeGradient = defs.append('linearGradient')
    .attr('id', 'tape-gradient')
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '0%')
    .attr('y2', '100%');
  tapeGradient.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', '#5D4037');
  tapeGradient.append('stop')
    .attr('offset', '50%')
    .attr('stop-color', '#3E2723');
  tapeGradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', '#5D4037');
  
  // Title
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', 18)
    .attr('text-anchor', 'middle')
    .attr('fill', '#888')
    .attr('font-size', '12px')
    .text('Magnetic Tape Reel-to-Reel');
  
  // Reel positions
  const leftReelX = 85;
  const rightReelX = 315;
  const reelY = 120;
  const leftReelR = 50;  // Supply reel (larger, more tape)
  const rightReelR = 35; // Takeup reel (smaller, less tape)
  
  // Guide roller positions
  const guideRollers = [
    { x: 150, y: 80, r: 8 },   // Top left
    { x: 250, y: 80, r: 8 },   // Top right
    { x: 200, y: 210, r: 10 }  // Bottom center (at read head)
  ];
  
  // Draw machine housing/base
  svg.append('rect')
    .attr('x', 30)
    .attr('y', 40)
    .attr('width', 340)
    .attr('height', 200)
    .attr('rx', 8)
    .attr('fill', '#1a1a1a')
    .attr('stroke', '#333')
    .attr('stroke-width', 2);
  
  // Draw guide rollers
  guideRollers.forEach(roller => {
    svg.append('circle')
      .attr('cx', roller.x)
      .attr('cy', roller.y)
      .attr('r', roller.r)
      .attr('fill', '#444')
      .attr('stroke', '#555')
      .attr('stroke-width', 1);
    svg.append('circle')
      .attr('cx', roller.x)
      .attr('cy', roller.y)
      .attr('r', roller.r * 0.4)
      .attr('fill', '#333');
  });
  
  // Tape path - complex path connecting reels through rollers
  // Path: Left reel (top) → Top left roller → Read head → Top right roller → Right reel (top)
  // Calculate tangent exit points from reels
  const leftTapeExitX = leftReelX + 10;  // Slightly right of center top
  const leftTapeExitY = reelY - leftReelR + 5;  // Top of reel
  const rightTapeEntryX = rightReelX - 10;  // Slightly left of center top
  const rightTapeEntryY = reelY - rightReelR + 5;  // Top of reel
  
  const tapePath = svg.append('path')
    .attr('d', `
      M ${leftTapeExitX} ${leftTapeExitY}
      L ${guideRollers[0].x} ${guideRollers[0].y + guideRollers[0].r}
      L ${guideRollers[2].x} ${guideRollers[2].y - guideRollers[2].r}
      L ${guideRollers[1].x} ${guideRollers[1].y + guideRollers[1].r}
      L ${rightTapeEntryX} ${rightTapeEntryY}
    `)
    .attr('fill', 'none')
    .attr('stroke', 'url(#tape-gradient)')
    .attr('stroke-width', 5)
    .attr('stroke-linejoin', 'round');
  
  // Tape wrapped around left reel (supply) - partial arc visible
  svg.append('path')
    .attr('d', d3.arc()({
      innerRadius: leftReelR - 10,
      outerRadius: leftReelR - 2,
      startAngle: -Math.PI * 0.6,
      endAngle: Math.PI * 0.8
    }))
    .attr('transform', `translate(${leftReelX}, ${reelY})`)
    .attr('fill', '#4a3728')
    .attr('opacity', 0.9);
  
  // Tape wrapped around right reel (takeup) - less tape, partial arc
  svg.append('path')
    .attr('d', d3.arc()({
      innerRadius: rightReelR - 8,
      outerRadius: rightReelR - 2,
      startAngle: -Math.PI * 0.8,
      endAngle: Math.PI * 0.6
    }))
    .attr('transform', `translate(${rightReelX}, ${reelY})`)
    .attr('fill', '#4a3728')
    .attr('opacity', 0.9);
  
  // Left reel group (will rotate)
  const leftReelGroup = svg.append('g')
    .attr('class', 'left-reel');
  
  // Left reel flange
  leftReelGroup.append('circle')
    .attr('cx', leftReelX)
    .attr('cy', reelY)
    .attr('r', leftReelR)
    .attr('fill', 'none')
    .attr('stroke', '#555')
    .attr('stroke-width', 3);
  
  // Left reel spokes
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2;
    leftReelGroup.append('line')
      .attr('x1', leftReelX + Math.cos(angle) * 12)
      .attr('y1', reelY + Math.sin(angle) * 12)
      .attr('x2', leftReelX + Math.cos(angle) * (leftReelR - 2))
      .attr('y2', reelY + Math.sin(angle) * (leftReelR - 2))
      .attr('stroke', '#666')
      .attr('stroke-width', 3);
  }
  
  // Left reel hub
  leftReelGroup.append('circle')
    .attr('cx', leftReelX)
    .attr('cy', reelY)
    .attr('r', 12)
    .attr('fill', '#333')
    .attr('stroke', '#444')
    .attr('stroke-width', 2);
  
  // Right reel group (will rotate opposite)
  const rightReelGroup = svg.append('g')
    .attr('class', 'right-reel');
  
  // Right reel flange
  rightReelGroup.append('circle')
    .attr('cx', rightReelX)
    .attr('cy', reelY)
    .attr('r', rightReelR)
    .attr('fill', 'none')
    .attr('stroke', '#555')
    .attr('stroke-width', 3);
  
  // Right reel spokes
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2;
    rightReelGroup.append('line')
      .attr('x1', rightReelX + Math.cos(angle) * 10)
      .attr('y1', reelY + Math.sin(angle) * 10)
      .attr('x2', rightReelX + Math.cos(angle) * (rightReelR - 2))
      .attr('y2', reelY + Math.sin(angle) * (rightReelR - 2))
      .attr('stroke', '#666')
      .attr('stroke-width', 3);
  }
  
  // Right reel hub
  rightReelGroup.append('circle')
    .attr('cx', rightReelX)
    .attr('cy', reelY)
    .attr('r', 10)
    .attr('fill', '#333')
    .attr('stroke', '#444')
    .attr('stroke-width', 2);
  
  // Read head assembly
  const readHeadY = guideRollers[2].y;
  
  // Read head housing
  svg.append('rect')
    .attr('x', 185)
    .attr('y', readHeadY - 5)
    .attr('width', 30)
    .attr('height', 35)
    .attr('rx', 3)
    .attr('fill', '#555')
    .attr('stroke', '#666')
    .attr('stroke-width', 1);
  
  // Read head gap (where tape contacts)
  svg.append('rect')
    .attr('x', 195)
    .attr('y', readHeadY - 8)
    .attr('width', 10)
    .attr('height', 6)
    .attr('fill', '#222');
  
  // Read head indicator light
  const readLight = svg.append('circle')
    .attr('cx', 200)
    .attr('cy', readHeadY + 18)
    .attr('r', 4)
    .attr('fill', '#333');
  
  // Magnetic particles on tape (flowing along path)
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
  
  // Each particle shows magnetic polarity
  particleElements.append('rect')
    .attr('x', -4)
    .attr('y', -2)
    .attr('width', 8)
    .attr('height', 4)
    .attr('rx', 1)
    .attr('fill', d => d.direction > 0 ? '#ff6b6b' : '#4ecdc4');
  
  // Labels
  svg.append('text')
    .attr('x', leftReelX)
    .attr('y', reelY + leftReelR + 20)
    .attr('text-anchor', 'middle')
    .attr('fill', '#666')
    .attr('font-size', '10px')
    .text('SUPPLY');
  
  svg.append('text')
    .attr('x', rightReelX)
    .attr('y', reelY + rightReelR + 20)
    .attr('text-anchor', 'middle')
    .attr('fill', '#666')
    .attr('font-size', '10px')
    .text('TAKEUP');
  
  // READ/WRITE text
  const readText = svg.append('text')
    .attr('x', 200)
    .attr('y', readHeadY + 45)
    .attr('text-anchor', 'middle')
    .attr('fill', '#555')
    .attr('font-size', '10px')
    .attr('font-weight', 'bold')
    .text('READ/WRITE');
  
  // Speed and counter
  svg.append('text')
    .attr('x', 50)
    .attr('y', height - 15)
    .attr('fill', '#555')
    .attr('font-size', '10px')
    .attr('font-family', 'monospace')
    .text('75 IPS');
  
  const bitCounter = svg.append('text')
    .attr('x', width / 2)
    .attr('y', height - 15)
    .attr('text-anchor', 'middle')
    .attr('fill', '#666')
    .attr('font-size', '11px')
    .attr('font-family', 'monospace')
    .text('Bytes: 0');
  
  svg.append('text')
    .attr('x', width - 50)
    .attr('y', height - 15)
    .attr('text-anchor', 'end')
    .attr('fill', '#555')
    .attr('font-size', '10px')
    .attr('font-family', 'monospace')
    .text('9-track');
  
  // Animation state
  let hasPlayed = false;
  let animationTimer = null;
  let leftAngle = 0;
  let rightAngle = 0;
  let bytesRead = 0;
  
  // Path segments for particle movement
  // Must match the tapePath coordinates
  const pathSegments = [
    { x1: leftTapeExitX, y1: leftTapeExitY, x2: guideRollers[0].x, y2: guideRollers[0].y + guideRollers[0].r },
    { x1: guideRollers[0].x, y1: guideRollers[0].y + guideRollers[0].r, x2: guideRollers[2].x, y2: guideRollers[2].y - guideRollers[2].r },
    { x1: guideRollers[2].x, y1: guideRollers[2].y - guideRollers[2].r, x2: guideRollers[1].x, y2: guideRollers[1].y + guideRollers[1].r },
    { x1: guideRollers[1].x, y1: guideRollers[1].y + guideRollers[1].r, x2: rightTapeEntryX, y2: rightTapeEntryY }
  ];
  
  // Calculate total path length and segment proportions
  let totalLength = 0;
  pathSegments.forEach(seg => {
    seg.length = Math.sqrt(Math.pow(seg.x2 - seg.x1, 2) + Math.pow(seg.y2 - seg.y1, 2));
    totalLength += seg.length;
  });
  
  let cumulative = 0;
  pathSegments.forEach(seg => {
    seg.startT = cumulative / totalLength;
    cumulative += seg.length;
    seg.endT = cumulative / totalLength;
  });
  
  function getPointOnPath(t) {
    // Find which segment
    for (const seg of pathSegments) {
      if (t >= seg.startT && t <= seg.endT) {
        const segT = (t - seg.startT) / (seg.endT - seg.startT);
        return {
          x: seg.x1 + (seg.x2 - seg.x1) * segT,
          y: seg.y1 + (seg.y2 - seg.y1) * segT
        };
      }
    }
    return { x: rightReelX - rightReelR, y: reelY };
  }
  
  // Read head position as proportion of path
  const readHeadT = 0.5; // Middle of path
  
  return {
    play: function() {
      if (hasPlayed) return;
      hasPlayed = true;
      
      // Fade in particles
      particleElements
        .transition()
        .delay((d, i) => i * 60)
        .duration(200)
        .attr('opacity', 1);
      
      // Animate reels and particles
      function animate() {
        // Rotate reels (both rotate clockwise as tape moves from left to right)
        leftAngle += 1.5;
        rightAngle += 2;
        leftReelGroup.attr('transform', `rotate(${leftAngle}, ${leftReelX}, ${reelY})`);
        rightReelGroup.attr('transform', `rotate(${rightAngle}, ${rightReelX}, ${reelY})`);
        
        // Move particles along path
        particles.forEach(p => {
          p.t = (p.t + 0.008) % 1;
        });
        
        particleElements.attr('transform', d => {
          const pos = getPointOnPath(d.t);
          return `translate(${pos.x}, ${pos.y})`;
        });
        
        // Flash read light when particle passes read head
        let anyAtHead = false;
        particles.forEach(p => {
          if (p.t > 0.45 && p.t < 0.55) {
            anyAtHead = true;
          }
        });
        
        if (anyAtHead) {
          readLight.attr('fill', '#4ecdc4');
          readText.attr('fill', '#4ecdc4');
          bytesRead += 8; // 8 bytes per pass
          if (bytesRead < 1024) {
            bitCounter.text(`Bytes: ${bytesRead}`);
          } else {
            bitCounter.text(`Bytes: ${(bytesRead / 1024).toFixed(1)}K`);
          }
        } else {
          readLight.attr('fill', '#333');
          readText.attr('fill', '#555');
        }
        
        animationTimer = requestAnimationFrame(animate);
      }
      
      setTimeout(animate, 300);
    },
    
    reset: function() {
      hasPlayed = false;
      bytesRead = 0;
      if (animationTimer) {
        cancelAnimationFrame(animationTimer);
      }
      particleElements.attr('opacity', 0);
      leftReelGroup.attr('transform', '');
      rightReelGroup.attr('transform', '');
      bitCounter.text('Bytes: 0');
      readLight.attr('fill', '#333');
      readText.attr('fill', '#555');
    }
  };
}
