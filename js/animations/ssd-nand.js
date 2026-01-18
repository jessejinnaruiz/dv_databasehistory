/**
 * SSD NAND Flash Animation
 * Era 4: 2000s-2010s - The Flash Revolution
 * 
 * Visualizes: Floating gate transistor with electrons tunneling
 * v2: Added voltage indicator, status text, glowing electrons
 */

export function initSSDNand(containerSelector) {
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
  
  // Define glow filter for electrons
  const defs = svg.append('defs');
  const glowFilter = defs.append('filter')
    .attr('id', 'electron-glow')
    .attr('x', '-100%')
    .attr('y', '-100%')
    .attr('width', '300%')
    .attr('height', '300%');
  glowFilter.append('feGaussianBlur')
    .attr('stdDeviation', '2')
    .attr('result', 'coloredBlur');
  const feMerge = glowFilter.append('feMerge');
  feMerge.append('feMergeNode').attr('in', 'coloredBlur');
  feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
  
  // Title
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .attr('fill', '#888')
    .attr('font-size', '12px')
    .text('NAND Flash Cell (Floating Gate Transistor)');
  
  // Gate structure dimensions
  const gateX = 100;
  const gateY = 60;
  const gateWidth = 140;
  const layerHeight = 22;
  
  // Control gate (top)
  svg.append('rect')
    .attr('x', gateX)
    .attr('y', gateY)
    .attr('width', gateWidth)
    .attr('height', layerHeight)
    .attr('fill', '#4a4a6a')
    .attr('stroke', '#666')
    .attr('stroke-width', 1);
  
  svg.append('text')
    .attr('x', gateX + gateWidth + 10)
    .attr('y', gateY + 15)
    .attr('fill', '#888')
    .attr('font-size', '10px')
    .text('Control Gate');
  
  // Voltage indicator
  const voltageText = svg.append('text')
    .attr('x', gateX - 10)
    .attr('y', gateY + 15)
    .attr('text-anchor', 'end')
    .attr('fill', '#444')
    .attr('font-size', '11px')
    .attr('font-family', 'monospace')
    .text('0V');
  
  // Oxide layer 1
  svg.append('rect')
    .attr('x', gateX)
    .attr('y', gateY + layerHeight)
    .attr('width', gateWidth)
    .attr('height', 8)
    .attr('fill', '#2a4a6a');
  
  // Floating gate (where electrons are stored)
  const floatingGate = svg.append('rect')
    .attr('x', gateX)
    .attr('y', gateY + layerHeight + 8)
    .attr('width', gateWidth)
    .attr('height', layerHeight)
    .attr('fill', '#1a3a5a')
    .attr('stroke', '#4a6a8a')
    .attr('stroke-width', 2);
  
  svg.append('text')
    .attr('x', gateX + gateWidth + 10)
    .attr('y', gateY + layerHeight + 22)
    .attr('fill', '#4ecdc4')
    .attr('font-size', '10px')
    .text('Floating Gate');
  
  // Oxide layer 2 (tunnel oxide)
  const tunnelOxide = svg.append('rect')
    .attr('x', gateX)
    .attr('y', gateY + layerHeight * 2 + 8)
    .attr('width', gateWidth)
    .attr('height', 8)
    .attr('fill', '#2a4a6a');
  
  svg.append('text')
    .attr('x', gateX + gateWidth + 10)
    .attr('y', gateY + layerHeight * 2 + 15)
    .attr('fill', '#666')
    .attr('font-size', '9px')
    .text('Tunnel Oxide');
  
  // Silicon substrate
  svg.append('rect')
    .attr('x', gateX - 40)
    .attr('y', gateY + layerHeight * 2 + 16)
    .attr('width', gateWidth + 80)
    .attr('height', 45)
    .attr('fill', '#1a1a2e')
    .attr('stroke', '#333')
    .attr('stroke-width', 1);
  
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', gateY + layerHeight * 2 + 45)
    .attr('text-anchor', 'middle')
    .attr('fill', '#555')
    .attr('font-size', '10px')
    .text('Silicon Channel');
  
  // Source and Drain regions
  svg.append('rect')
    .attr('x', gateX - 30)
    .attr('y', gateY + layerHeight * 2 + 16)
    .attr('width', 25)
    .attr('height', 22)
    .attr('fill', '#ff6b6b')
    .attr('opacity', 0.7);
  
  svg.append('rect')
    .attr('x', gateX + gateWidth + 5)
    .attr('y', gateY + layerHeight * 2 + 16)
    .attr('width', 25)
    .attr('height', 22)
    .attr('fill', '#ff6b6b')
    .attr('opacity', 0.7);
  
  svg.append('text')
    .attr('x', gateX - 17)
    .attr('y', gateY + layerHeight * 2 + 55)
    .attr('text-anchor', 'middle')
    .attr('fill', '#888')
    .attr('font-size', '9px')
    .text('Source');
  
  svg.append('text')
    .attr('x', gateX + gateWidth + 17)
    .attr('y', gateY + layerHeight * 2 + 55)
    .attr('text-anchor', 'middle')
    .attr('fill', '#888')
    .attr('font-size', '9px')
    .text('Drain');
  
  // Electrons (will animate into floating gate)
  const electrons = [];
  for (let i = 0; i < 8; i++) {
    electrons.push({
      startX: gateX + 15 + (i % 4) * 35,
      startY: gateY + layerHeight * 2 + 35,
      endX: gateX + 20 + (i % 4) * 32,
      endY: gateY + layerHeight + 17,
      delay: i * 120
    });
  }
  
  const electronElements = svg.selectAll('.electron')
    .data(electrons)
    .enter()
    .append('circle')
    .attr('class', 'electron')
    .attr('cx', d => d.startX)
    .attr('cy', d => d.startY)
    .attr('r', 4)
    .attr('fill', '#4ecdc4')
    .attr('filter', 'url(#electron-glow)')
    .attr('opacity', 0);
  
  // Status text (large, prominent)
  const statusText = svg.append('text')
    .attr('x', width / 2)
    .attr('y', height - 35)
    .attr('text-anchor', 'middle')
    .attr('fill', '#666')
    .attr('font-size', '13px')
    .attr('font-weight', 'bold')
    .text('IDLE');
  
  // Bit state indicator
  const bitText = svg.append('text')
    .attr('x', width / 2)
    .attr('y', height - 15)
    .attr('text-anchor', 'middle')
    .attr('fill', '#888')
    .attr('font-size', '11px')
    .attr('font-family', 'monospace')
    .text('State: EMPTY → Bit = 1');
  
  // Access time
  svg.append('text')
    .attr('x', 30)
    .attr('y', height - 15)
    .attr('fill', '#555')
    .attr('font-size', '10px')
    .text('~25μs write');
  
  // Animation state
  let hasPlayed = false;
  
  return {
    play: function() {
      if (hasPlayed) return;
      hasPlayed = true;
      
      // Phase 1: Apply voltage
      statusText
        .attr('fill', '#ff6b6b')
        .text('APPLYING VOLTAGE...');
      
      voltageText
        .transition()
        .duration(500)
        .attr('fill', '#ff6b6b')
        .tween('text', function() {
          const i = d3.interpolateNumber(0, 20);
          return function(t) {
            d3.select(this).text(`${Math.round(i(t))}V`);
          };
        });
      
      // Tunnel oxide glows
      tunnelOxide
        .transition()
        .delay(500)
        .duration(300)
        .attr('fill', '#4a7a9a');
      
      // Phase 2: Show electrons
      setTimeout(() => {
        statusText.text('PROGRAMMING...');
        
        electronElements
          .transition()
          .delay(d => d.delay)
          .duration(200)
          .attr('opacity', 1)
          .attr('r', 5);
      }, 600);
      
      // Phase 3: Tunnel electrons
      setTimeout(() => {
        electronElements
          .transition()
          .delay(d => d.delay)
          .duration(600)
          .ease(d3.easeCubicInOut)
          .attr('cx', d => d.endX)
          .attr('cy', d => d.endY)
          .attr('r', 4);
      }, 1200);
      
      // Phase 4: Complete
      setTimeout(() => {
        floatingGate
          .transition()
          .duration(400)
          .attr('fill', '#2a5a7a');
        
        statusText
          .attr('fill', '#4ecdc4')
          .text('✓ PROGRAMMED');
        
        bitText
          .attr('fill', '#4ecdc4')
          .text('State: CHARGED → Bit = 0');
        
        voltageText
          .transition()
          .duration(300)
          .attr('fill', '#4ecdc4');
        
        // Electrons pulse
        electronElements
          .transition()
          .duration(500)
          .attr('r', 6)
          .transition()
          .duration(500)
          .attr('r', 4)
          .on('end', function pulse() {
            d3.select(this)
              .transition()
              .duration(1000)
              .attr('r', 5)
              .transition()
              .duration(1000)
              .attr('r', 4)
              .on('end', pulse);
          });
      }, 2500);
    },
    
    reset: function() {
      hasPlayed = false;
      electronElements
        .interrupt()
        .attr('cx', d => d.startX)
        .attr('cy', d => d.startY)
        .attr('opacity', 0)
        .attr('r', 4);
      floatingGate.attr('fill', '#1a3a5a');
      tunnelOxide.attr('fill', '#2a4a6a');
      statusText.attr('fill', '#666').text('IDLE');
      bitText.attr('fill', '#888').text('State: EMPTY → Bit = 1');
      voltageText.attr('fill', '#444').text('0V');
    }
  };
}
