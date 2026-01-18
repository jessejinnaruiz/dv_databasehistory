/**
 * Punch Card Animation
 * Era 1: 1950s - The Physical Age
 * 
 * Visualizes: Holes punched in card, light shining through
 * v2: Added pulsing glow, "CLICK" indicators
 */

export function initPunchCard(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return null;
  
  // Clear placeholder
  container.innerHTML = '';
  
  // Dimensions
  const width = 400;
  const height = 280;
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
  
  // Define glow filter
  const defs = svg.append('defs');
  const filter = defs.append('filter')
    .attr('id', 'glow')
    .attr('x', '-50%')
    .attr('y', '-50%')
    .attr('width', '200%')
    .attr('height', '200%');
  filter.append('feGaussianBlur')
    .attr('stdDeviation', '3')
    .attr('result', 'coloredBlur');
  const feMerge = filter.append('feMerge');
  feMerge.append('feMergeNode').attr('in', 'coloredBlur');
  feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
  
  // Title text
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .attr('fill', '#888')
    .attr('font-size', '12px')
    .text('IBM 80-Column Punch Card');
  
  // Card background
  svg.append('rect')
    .attr('x', 20)
    .attr('y', 40)
    .attr('width', width - 40)
    .attr('height', height - 90)
    .attr('rx', 4)
    .attr('fill', '#d4a574')
    .attr('stroke', '#8B4513')
    .attr('stroke-width', 2);
  
  // Corner cut (authentic punch card detail)
  svg.append('polygon')
    .attr('points', `${width - 20},40 ${width - 35},40 ${width - 20},55`)
    .attr('fill', 'rgba(0,0,0,0.3)');
  
  // Generate hole positions (some will be "punched")
  const holes = [];
  const startX = 50;
  const startY = 65;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      holes.push({
        x: startX + col * spacing,
        y: startY + row * spacing,
        punched: Math.random() > 0.55,
        delay: (row * cols + col) * 40
      });
    }
  }
  
  // Draw hole positions (unpunched = light rectangle)
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
    .attr('filter', 'url(#glow)')
    .attr('opacity', 0);
  
  // "CLICK" text elements (will appear when punching)
  const clickTexts = svg.selectAll('.click-text')
    .data(holes.filter(h => h.punched).slice(0, 5)) // Only first 5
    .enter()
    .append('text')
    .attr('class', 'click-text')
    .attr('x', d => d.x)
    .attr('y', d => d.y - 15)
    .attr('text-anchor', 'middle')
    .attr('fill', '#ff6b6b')
    .attr('font-size', '10px')
    .attr('font-weight', 'bold')
    .attr('opacity', 0)
    .text('CLICK');
  
  // Counter text
  const counterText = svg.append('text')
    .attr('x', width / 2)
    .attr('y', height - 15)
    .attr('text-anchor', 'middle')
    .attr('fill', '#666')
    .attr('font-size', '11px')
    .attr('font-family', 'monospace')
    .text('Holes punched: 0');
  
  // Animation state
  let hasPlayed = false;
  
  return {
    play: function() {
      if (hasPlayed) return;
      hasPlayed = true;
      
      let punchedCount = 0;
      const totalPunched = holes.filter(h => h.punched).length;
      
      // Animate punching holes
      holeElements
        .filter(d => d.punched)
        .transition()
        .delay(d => d.delay)
        .duration(150)
        .attr('fill', '#1a1a1a')
        .attr('stroke', '#000')
        .on('end', function() {
          punchedCount++;
          counterText.text(`Holes punched: ${punchedCount}`);
        });
      
      // Animate light shining through with pulse
      lightRays
        .transition()
        .delay(d => d.delay + 150)
        .duration(200)
        .attr('opacity', 0.9)
        .transition()
        .duration(500)
        .attr('opacity', 0.6)
        .transition()
        .duration(500)
        .attr('opacity', 0.9)
        .on('end', function pulse() {
          d3.select(this)
            .transition()
            .duration(800)
            .attr('opacity', 0.5)
            .transition()
            .duration(800)
            .attr('opacity', 0.9)
            .on('end', pulse);
        });
      
      // Show CLICK text
      clickTexts
        .transition()
        .delay((d, i) => i * 200)
        .duration(100)
        .attr('opacity', 1)
        .transition()
        .delay(200)
        .duration(300)
        .attr('opacity', 0)
        .attr('y', d => d.y - 25);
    },
    
    reset: function() {
      hasPlayed = false;
      holeElements
        .attr('fill', '#c49a6c')
        .attr('stroke', '#a07850');
      lightRays.attr('opacity', 0);
      clickTexts.attr('opacity', 0);
      counterText.text('Holes punched: 0');
    }
  };
}
