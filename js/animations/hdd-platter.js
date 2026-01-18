/**
 * HDD Platter Animation
 * Era 3: 1980s-2000s - The Spinning Disk Era
 * 
 * Visualizes: Spinning platter with read head and magnetic domains
 * v2: Added RPM counter, access time indicator, shine effect
 */

export function initHDDPlatter(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return null;
  
  container.innerHTML = '';
  
  const width = 400;
  const height = 320;
  const centerX = width / 2;
  const centerY = height / 2;
  
  const svg = d3.select(container)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('max-width', '400px');
  
  // Define gradient for platter shine
  const defs = svg.append('defs');
  const shineGradient = defs.append('radialGradient')
    .attr('id', 'platter-shine')
    .attr('cx', '30%')
    .attr('cy', '30%');
  shineGradient.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', '#3a3a5e')
    .attr('stop-opacity', 0.8);
  shineGradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', '#1a1a2e')
    .attr('stop-opacity', 1);
  
  // Title
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', 18)
    .attr('text-anchor', 'middle')
    .attr('fill', '#888')
    .attr('font-size', '12px')
    .text('Hard Disk Drive');
  
  // Platter group (will rotate)
  const platterGroup = svg.append('g')
    .attr('class', 'platter-group');
  
  // Outer platter with gradient
  platterGroup.append('circle')
    .attr('cx', centerX)
    .attr('cy', centerY)
    .attr('r', 100)
    .attr('fill', 'url(#platter-shine)')
    .attr('stroke', '#333')
    .attr('stroke-width', 2);
  
  // Concentric tracks
  const trackRadii = [85, 70, 55, 40];
  trackRadii.forEach(r => {
    platterGroup.append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', r)
      .attr('fill', 'none')
      .attr('stroke', '#2a2a4a')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '2,2');
  });
  
  // Magnetic domains on tracks (small rectangles)
  const domains = [];
  trackRadii.forEach((r, trackIdx) => {
    const numDomains = 20 + trackIdx * 6;
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
    .attr('x', d => d.x - 3)
    .attr('y', d => d.y - 1.5)
    .attr('width', 6)
    .attr('height', 3)
    .attr('rx', 1)
    .attr('fill', '#333')
    .attr('transform', d => `rotate(${d.angle}, ${d.x}, ${d.y})`);
  
  // Center spindle
  platterGroup.append('circle')
    .attr('cx', centerX)
    .attr('cy', centerY)
    .attr('r', 20)
    .attr('fill', '#111')
    .attr('stroke', '#444')
    .attr('stroke-width', 2);
  
  // Spindle center detail
  platterGroup.append('circle')
    .attr('cx', centerX)
    .attr('cy', centerY)
    .attr('r', 8)
    .attr('fill', '#222');
  
  // Read/write arm (static, outside rotation group)
  const armGroup = svg.append('g').attr('class', 'arm-group');
  
  // Arm pivot
  armGroup.append('circle')
    .attr('cx', width - 40)
    .attr('cy', height - 50)
    .attr('r', 12)
    .attr('fill', '#555');
  
  // Arm
  const arm = armGroup.append('line')
    .attr('x1', width - 40)
    .attr('y1', height - 50)
    .attr('x2', centerX + 40)
    .attr('y2', centerY)
    .attr('stroke', '#777')
    .attr('stroke-width', 5)
    .attr('stroke-linecap', 'round');
  
  // Read head
  const readHead = armGroup.append('polygon')
    .attr('points', `${centerX + 35},${centerY - 6} ${centerX + 45},${centerY} ${centerX + 35},${centerY + 6}`)
    .attr('fill', '#ff6b6b');
  
  // RPM counter
  const rpmText = svg.append('text')
    .attr('x', 50)
    .attr('y', height - 20)
    .attr('fill', '#4ecdc4')
    .attr('font-size', '14px')
    .attr('font-family', 'monospace')
    .attr('font-weight', 'bold')
    .text('0 RPM');
  
  // Access time indicator
  const accessTimeText = svg.append('text')
    .attr('x', width - 50)
    .attr('y', height - 20)
    .attr('text-anchor', 'end')
    .attr('fill', '#666')
    .attr('font-size', '11px')
    .attr('font-family', 'monospace')
    .text('Seek: --ms');
  
  // Bytes written counter
  const bytesText = svg.append('text')
    .attr('x', width / 2)
    .attr('y', height - 20)
    .attr('text-anchor', 'middle')
    .attr('fill', '#666')
    .attr('font-size', '11px')
    .attr('font-family', 'monospace')
    .text('0 bytes');
  
  // Animation state
  let hasPlayed = false;
  let rotationAngle = 0;
  let animationTimer = null;
  let currentRPM = 0;
  let bytesWritten = 0;
  
  return {
    play: function() {
      if (hasPlayed) return;
      hasPlayed = true;
      
      // Spin up sequence
      const spinUpInterval = setInterval(() => {
        currentRPM = Math.min(currentRPM + 400, 7200);
        rpmText.text(`${currentRPM} RPM`);
        if (currentRPM >= 7200) {
          clearInterval(spinUpInterval);
        }
      }, 100);
      
      // Start rotation animation
      function rotate() {
        rotationAngle += 3;
        platterGroup.attr('transform', `rotate(${rotationAngle}, ${centerX}, ${centerY})`);
        
        // Write domains as platter spins
        if (rotationAngle % 15 === 0) {
          const writeIdx = Math.floor(Math.random() * domains.length);
          domainElements
            .filter((d, i) => i === writeIdx)
            .transition()
            .duration(50)
            .attr('fill', Math.random() > 0.5 ? '#4ecdc4' : '#ff6b6b');
          
          bytesWritten += 512;
          if (bytesWritten < 1024) {
            bytesText.text(`${bytesWritten} bytes`);
          } else if (bytesWritten < 1048576) {
            bytesText.text(`${(bytesWritten / 1024).toFixed(1)} KB`);
          } else {
            bytesText.text(`${(bytesWritten / 1048576).toFixed(1)} MB`);
          }
        }
        
        animationTimer = requestAnimationFrame(rotate);
      }
      
      rotate();
      
      // Arm seeking animation with access time
      function seekArm() {
        const trackIdx = Math.floor(Math.random() * trackRadii.length);
        const targetY = centerY + (trackIdx - 1.5) * 15;
        const seekTime = Math.floor(5 + Math.random() * 10);
        
        accessTimeText
          .attr('fill', '#ff6b6b')
          .text(`Seek: ${seekTime}ms`);
        
        arm.transition()
          .duration(seekTime * 20)
          .attr('y2', targetY)
          .on('end', () => {
            accessTimeText.attr('fill', '#4ecdc4');
          });
        
        readHead.transition()
          .duration(seekTime * 20)
          .attr('points', `${centerX + 35},${targetY - 6} ${centerX + 45},${targetY} ${centerX + 35},${targetY + 6}`);
        
        setTimeout(seekArm, 1000 + Math.random() * 1500);
      }
      
      setTimeout(seekArm, 800);
    },
    
    reset: function() {
      hasPlayed = false;
      currentRPM = 0;
      bytesWritten = 0;
      if (animationTimer) {
        cancelAnimationFrame(animationTimer);
      }
      platterGroup.attr('transform', '');
      domainElements.attr('fill', '#333');
      rpmText.text('0 RPM');
      bytesText.text('0 bytes');
      accessTimeText.text('Seek: --ms');
    }
  };
}
