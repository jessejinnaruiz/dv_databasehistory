/**
 * Punch Card Animation
 * Era 1: 1950s - The Physical Age
 * 
 * Visualizes: Holes punched in card, light shining through
 */

export function initPunchCard(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return null;
  
  // Clear placeholder
  container.innerHTML = '';
  
  // Dimensions
  const width = 400;
  const height = 250;
  const cols = 12;
  const rows = 5;
  const holeSize = 16;
  const spacing = 28;
  
  // Create SVG
  const svg = d3.select(container)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('max-width', '400px');
  
  // Card background
  svg.append('rect')
    .attr('x', 20)
    .attr('y', 30)
    .attr('width', width - 40)
    .attr('height', height - 60)
    .attr('rx', 4)
    .attr('fill', '#d4a574')
    .attr('stroke', '#8B4513')
    .attr('stroke-width', 2);
  
  // Title text
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .attr('fill', '#888')
    .attr('font-size', '12px')
    .text('IBM 80-Column Punch Card');
  
  // Generate hole positions (some will be "punched")
  const holes = [];
  const startX = 50;
  const startY = 55;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      holes.push({
        x: startX + col * spacing,
        y: startY + row * spacing,
        punched: Math.random() > 0.6,  // 40% chance of being punched
        delay: (row * cols + col) * 30
      });
    }
  }
  
  // Draw hole positions (unpunched = light circle, punched = dark)
  const holeElements = svg.selectAll('.hole')
    .data(holes)
    .enter()
    .append('rect')
    .attr('class', 'hole')
    .attr('x', d => d.x - holeSize/2)
    .attr('y', d => d.y - holeSize/2)
    .attr('width', holeSize)
    .attr('height', holeSize * 0.6)
    .attr('rx', 2)
    .attr('fill', '#c49a6c')
    .attr('stroke', '#a07850')
    .attr('stroke-width', 0.5);
  
  // Light rays behind (will show through punched holes)
  const lightRays = svg.selectAll('.light-ray')
    .data(holes.filter(h => h.punched))
    .enter()
    .append('rect')
    .attr('class', 'light-ray')
    .attr('x', d => d.x - holeSize/2)
    .attr('y', d => d.y - holeSize/2)
    .attr('width', holeSize)
    .attr('height', holeSize * 0.6)
    .attr('rx', 2)
    .attr('fill', '#ffeb3b')
    .attr('opacity', 0);
  
  // Animation state
  let hasPlayed = false;
  
  return {
    play: function() {
      if (hasPlayed) return;
      hasPlayed = true;
      
      // Animate punching holes
      holeElements
        .filter(d => d.punched)
        .transition()
        .delay(d => d.delay)
        .duration(200)
        .attr('fill', '#1a1a1a')
        .attr('stroke', '#000');
      
      // Animate light shining through
      lightRays
        .transition()
        .delay(d => d.delay + 200)
        .duration(300)
        .attr('opacity', 0.8);
    },
    
    reset: function() {
      hasPlayed = false;
      holeElements
        .attr('fill', '#c49a6c')
        .attr('stroke', '#a07850');
      lightRays.attr('opacity', 0);
    }
  };
}
