/**
 * HDD Platter Animation
 * Era 3: 1980s-2000s - The Spinning Disk Era
 * 
 * Visualizes: Spinning platter with read head and magnetic domains
 */

export function initHDDPlatter(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return null;
  
  container.innerHTML = '';
  
  const width = 400;
  const height = 300;
  const centerX = width / 2;
  const centerY = height / 2 + 10;
  
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
    .text('Hard Disk Platter');
  
  // Platter group (will rotate)
  const platterGroup = svg.append('g')
    .attr('class', 'platter-group');
  
  // Outer platter
  platterGroup.append('circle')
    .attr('cx', centerX)
    .attr('cy', centerY)
    .attr('r', 110)
    .attr('fill', '#1a1a2e')
    .attr('stroke', '#333')
    .attr('stroke-width', 2);
  
  // Concentric tracks
  const trackRadii = [95, 75, 55];
  trackRadii.forEach(r => {
    platterGroup.append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', r)
      .attr('fill', 'none')
      .attr('stroke', '#2a2a4a')
      .attr('stroke-width', 1);
  });
  
  // Magnetic domains on tracks (small rectangles)
  const domains = [];
  trackRadii.forEach((r, trackIdx) => {
    const numDomains = 16 + trackIdx * 4;
    for (let i = 0; i < numDomains; i++) {
      const angle = (i / numDomains) * Math.PI * 2;
      domains.push({
        x: centerX + Math.cos(angle) * r,
        y: centerY + Math.sin(angle) * r,
        angle: angle * (180 / Math.PI),
        written: false,
        track: trackIdx,
        index: i
      });
    }
  });
  
  const domainElements = platterGroup.selectAll('.domain')
    .data(domains)
    .enter()
    .append('rect')
    .attr('class', 'domain')
    .attr('x', d => d.x - 4)
    .attr('y', d => d.y - 2)
    .attr('width', 8)
    .attr('height', 4)
    .attr('rx', 1)
    .attr('fill', '#333')
    .attr('transform', d => `rotate(${d.angle}, ${d.x}, ${d.y})`);
  
  // Center spindle
  platterGroup.append('circle')
    .attr('cx', centerX)
    .attr('cy', centerY)
    .attr('r', 25)
    .attr('fill', '#111')
    .attr('stroke', '#444')
    .attr('stroke-width', 2);
  
  // Read/write arm (static, outside rotation group)
  const armGroup = svg.append('g').attr('class', 'arm-group');
  
  // Arm pivot
  armGroup.append('circle')
    .attr('cx', width - 50)
    .attr('cy', height - 40)
    .attr('r', 15)
    .attr('fill', '#555');
  
  // Arm
  const arm = armGroup.append('line')
    .attr('x1', width - 50)
    .attr('y1', height - 40)
    .attr('x2', centerX + 50)
    .attr('y2', centerY)
    .attr('stroke', '#777')
    .attr('stroke-width', 6)
    .attr('stroke-linecap', 'round');
  
  // Read head
  const readHead = armGroup.append('polygon')
    .attr('points', `${centerX + 45},${centerY - 8} ${centerX + 55},${centerY} ${centerX + 45},${centerY + 8}`)
    .attr('fill', '#ff6b6b');
  
  // Animation state
  let hasPlayed = false;
  let rotationAngle = 0;
  let animationTimer = null;
  
  return {
    play: function() {
      if (hasPlayed) return;
      hasPlayed = true;
      
      // Start rotation animation
      function rotate() {
        rotationAngle += 2;
        platterGroup.attr('transform', `rotate(${rotationAngle}, ${centerX}, ${centerY})`);
        
        // Write some domains based on angle
        const writeIdx = Math.floor((rotationAngle % 360) / 10);
        domainElements
          .filter((d, i) => i % 36 === writeIdx % 36)
          .transition()
          .duration(100)
          .attr('fill', d => Math.random() > 0.5 ? '#4ecdc4' : '#ff6b6b');
        
        animationTimer = requestAnimationFrame(rotate);
      }
      
      rotate();
      
      // Arm seeking animation
      function seekArm() {
        const trackY = centerY + (Math.random() - 0.5) * 60;
        arm.transition()
          .duration(300)
          .attr('y2', trackY);
        readHead.transition()
          .duration(300)
          .attr('points', `${centerX + 45},${trackY - 8} ${centerX + 55},${trackY} ${centerX + 45},${trackY + 8}`);
        
        setTimeout(seekArm, 1500 + Math.random() * 1000);
      }
      
      setTimeout(seekArm, 500);
    },
    
    reset: function() {
      hasPlayed = false;
      if (animationTimer) {
        cancelAnimationFrame(animationTimer);
      }
      platterGroup.attr('transform', '');
      domainElements.attr('fill', '#333');
    }
  };
}
