/**
 * SSD NAND Flash Animation
 * Era 4: 2000s-2010s - The Flash Revolution
 * 
 * Visualizes: Floating gate transistor with electrons tunneling
 */

export function initSSDNand(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return null;
  
  container.innerHTML = '';
  
  const width = 400;
  const height = 280;
  
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
    .text('NAND Flash Cell (Floating Gate)');
  
  // Gate structure
  const gateX = 120;
  const gateY = 80;
  const gateWidth = 160;
  const layerHeight = 25;
  
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
    .attr('y', gateY + 17)
    .attr('fill', '#888')
    .attr('font-size', '11px')
    .text('Control Gate');
  
  // Oxide layer 1
  svg.append('rect')
    .attr('x', gateX)
    .attr('y', gateY + layerHeight)
    .attr('width', gateWidth)
    .attr('height', 10)
    .attr('fill', '#2a4a6a');
  
  // Floating gate (where electrons are stored)
  const floatingGate = svg.append('rect')
    .attr('x', gateX)
    .attr('y', gateY + layerHeight + 10)
    .attr('width', gateWidth)
    .attr('height', layerHeight)
    .attr('fill', '#1a3a5a')
    .attr('stroke', '#4a6a8a')
    .attr('stroke-width', 2);
  
  svg.append('text')
    .attr('x', gateX + gateWidth + 10)
    .attr('y', gateY + layerHeight + 25)
    .attr('fill', '#4ecdc4')
    .attr('font-size', '11px')
    .text('Floating Gate');
  
  // Oxide layer 2 (tunnel oxide)
  svg.append('rect')
    .attr('x', gateX)
    .attr('y', gateY + layerHeight * 2 + 10)
    .attr('width', gateWidth)
    .attr('height', 10)
    .attr('fill', '#2a4a6a');
    
  svg.append('text')
    .attr('x', gateX + gateWidth + 10)
    .attr('y', gateY + layerHeight * 2 + 18)
    .attr('fill', '#666')
    .attr('font-size', '10px')
    .text('Tunnel Oxide');
  
  // Silicon substrate
  svg.append('rect')
    .attr('x', gateX - 40)
    .attr('y', gateY + layerHeight * 2 + 20)
    .attr('width', gateWidth + 80)
    .attr('height', 50)
    .attr('fill', '#1a1a2e')
    .attr('stroke', '#333')
    .attr('stroke-width', 1);
  
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', gateY + layerHeight * 2 + 50)
    .attr('text-anchor', 'middle')
    .attr('fill', '#666')
    .attr('font-size', '11px')
    .text('Silicon Substrate');
  
  // Source and Drain regions
  svg.append('rect')
    .attr('x', gateX - 30)
    .attr('y', gateY + layerHeight * 2 + 20)
    .attr('width', 30)
    .attr('height', 25)
    .attr('fill', '#ff6b6b')
    .attr('opacity', 0.7);
  
  svg.append('rect')
    .attr('x', gateX + gateWidth)
    .attr('y', gateY + layerHeight * 2 + 20)
    .attr('width', 30)
    .attr('height', 25)
    .attr('fill', '#ff6b6b')
    .attr('opacity', 0.7);
  
  svg.append('text')
    .attr('x', gateX - 15)
    .attr('y', gateY + layerHeight * 2 + 65)
    .attr('text-anchor', 'middle')
    .attr('fill', '#888')
    .attr('font-size', '10px')
    .text('Source');
  
  svg.append('text')
    .attr('x', gateX + gateWidth + 15)
    .attr('y', gateY + layerHeight * 2 + 65)
    .attr('text-anchor', 'middle')
    .attr('fill', '#888')
    .attr('font-size', '10px')
    .text('Drain');
  
  // Electrons (will animate into floating gate)
  const electrons = [];
  for (let i = 0; i < 8; i++) {
    electrons.push({
      startX: gateX + 20 + (i % 4) * 40,
      startY: gateY + layerHeight * 2 + 40,
      endX: gateX + 30 + (i % 4) * 35,
      endY: gateY + layerHeight + 18,
      delay: i * 150
    });
  }
  
  const electronElements = svg.selectAll('.electron')
    .data(electrons)
    .enter()
    .append('circle')
    .attr('class', 'electron')
    .attr('cx', d => d.startX)
    .attr('cy', d => d.startY)
    .attr('r', 5)
    .attr('fill', '#4ecdc4')
    .attr('opacity', 0);
  
  // State indicator
  const stateText = svg.append('text')
    .attr('x', width / 2)
    .attr('y', height - 20)
    .attr('text-anchor', 'middle')
    .attr('fill', '#888')
    .attr('font-size', '12px')
    .text('State: Empty (Bit = 1)');
  
  // Animation state
  let hasPlayed = false;
  
  return {
    play: function() {
      if (hasPlayed) return;
      hasPlayed = true;
      
      // Fade in electrons
      electronElements
        .transition()
        .delay(d => d.delay)
        .duration(200)
        .attr('opacity', 1);
      
      // Move electrons up through tunnel oxide (quantum tunneling!)
      electronElements
        .transition()
        .delay(d => d.delay + 500)
        .duration(800)
        .ease(d3.easeCubicInOut)
        .attr('cx', d => d.endX)
        .attr('cy', d => d.endY);
      
      // Change floating gate color
      setTimeout(() => {
        floatingGate
          .transition()
          .duration(500)
          .attr('fill', '#2a5a7a');
        
        stateText
          .transition()
          .duration(300)
          .attr('fill', '#4ecdc4')
          .text('State: Charged (Bit = 0)');
      }, 2000);
    },
    
    reset: function() {
      hasPlayed = false;
      electronElements
        .attr('cx', d => d.startX)
        .attr('cy', d => d.startY)
        .attr('opacity', 0);
      floatingGate.attr('fill', '#1a3a5a');
      stateText.attr('fill', '#888').text('State: Empty (Bit = 1)');
    }
  };
}
