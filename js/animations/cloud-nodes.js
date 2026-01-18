/**
 * Cloud/Object Store Animation
 * Era 5: 2010s-Present - The Cloud Era
 * 
 * Visualizes: Data chunks replicating across distributed nodes
 */

export function initCloudNodes(containerSelector) {
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
    .text('Distributed Object Storage');
  
  // Node positions (representing data centers)
  const nodes = [
    { x: 100, y: 100, label: 'US-East' },
    { x: 300, y: 80, label: 'EU-West' },
    { x: 200, y: 180, label: 'Primary' },
    { x: 80, y: 220, label: 'US-West' },
    { x: 320, y: 200, label: 'Asia' }
  ];
  
  // Connections between nodes
  const connections = [
    { source: 2, target: 0 },
    { source: 2, target: 1 },
    { source: 2, target: 3 },
    { source: 2, target: 4 },
    { source: 0, target: 1 },
    { source: 3, target: 4 }
  ];
  
  // Draw connections (lines)
  const connectionLines = svg.selectAll('.connection')
    .data(connections)
    .enter()
    .append('line')
    .attr('class', 'connection')
    .attr('x1', d => nodes[d.source].x)
    .attr('y1', d => nodes[d.source].y)
    .attr('x2', d => nodes[d.target].x)
    .attr('y2', d => nodes[d.target].y)
    .attr('stroke', '#2a4a6a')
    .attr('stroke-width', 1)
    .attr('opacity', 0.3);
  
  // Draw nodes (circles)
  const nodeGroups = svg.selectAll('.node')
    .data(nodes)
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', d => `translate(${d.x}, ${d.y})`);
  
  nodeGroups.append('circle')
    .attr('r', 25)
    .attr('fill', '#1a3a5a')
    .attr('stroke', '#4a6a8a')
    .attr('stroke-width', 2);
  
  nodeGroups.append('text')
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    .attr('fill', '#888')
    .attr('font-size', '10px')
    .text(d => d.label);
  
  // Data chunk indicators inside nodes
  const chunkIndicators = nodeGroups.append('g')
    .attr('class', 'chunks');
  
  // Primary node has initial data
  svg.select('.node:nth-child(5) .chunks')
    .append('rect')
    .attr('x', -8)
    .attr('y', -8)
    .attr('width', 16)
    .attr('height', 16)
    .attr('rx', 3)
    .attr('fill', '#4ecdc4');
  
  // Flying data chunks (for animation)
  const flyingChunks = [];
  connections.slice(0, 4).forEach((conn, i) => {
    flyingChunks.push({
      source: nodes[conn.source],
      target: nodes[conn.target],
      delay: i * 400
    });
  });
  
  const flyingElements = svg.selectAll('.flying-chunk')
    .data(flyingChunks)
    .enter()
    .append('rect')
    .attr('class', 'flying-chunk')
    .attr('width', 12)
    .attr('height', 12)
    .attr('rx', 2)
    .attr('fill', '#4ecdc4')
    .attr('x', d => d.source.x - 6)
    .attr('y', d => d.source.y - 6)
    .attr('opacity', 0);
  
  // Replication status text
  const statusText = svg.append('text')
    .attr('x', width / 2)
    .attr('y', height - 15)
    .attr('text-anchor', 'middle')
    .attr('fill', '#888')
    .attr('font-size', '11px')
    .text('Replication: 1/5 nodes');
  
  // Animation state
  let hasPlayed = false;
  
  return {
    play: function() {
      if (hasPlayed) return;
      hasPlayed = true;
      
      // Animate connections lighting up
      connectionLines
        .transition()
        .delay((d, i) => i * 200)
        .duration(300)
        .attr('opacity', 0.8)
        .attr('stroke', '#4ecdc4');
      
      // Animate flying chunks
      flyingElements
        .transition()
        .delay(d => d.delay)
        .duration(100)
        .attr('opacity', 1)
        .transition()
        .duration(800)
        .ease(d3.easeCubicInOut)
        .attr('x', d => d.target.x - 6)
        .attr('y', d => d.target.y - 6)
        .transition()
        .duration(200)
        .attr('opacity', 0);
      
      // Add chunk indicators to target nodes
      let replicatedCount = 1;
      flyingChunks.forEach((chunk, i) => {
        setTimeout(() => {
          const targetNode = svg.selectAll('.node')
            .filter((d, idx) => idx === connections[i].target);
          
          targetNode.select('.chunks')
            .append('rect')
            .attr('x', -8)
            .attr('y', -8)
            .attr('width', 16)
            .attr('height', 16)
            .attr('rx', 3)
            .attr('fill', '#4ecdc4')
            .attr('opacity', 0)
            .transition()
            .duration(300)
            .attr('opacity', 1);
          
          replicatedCount++;
          statusText.text(`Replication: ${replicatedCount}/5 nodes`);
          
          if (replicatedCount === 5) {
            statusText
              .transition()
              .duration(300)
              .attr('fill', '#4ecdc4')
              .text('✓ Data replicated across 5 regions');
          }
        }, chunk.delay + 900);
      });
    },
    
    reset: function() {
      hasPlayed = false;
      connectionLines.attr('opacity', 0.3).attr('stroke', '#2a4a6a');
      flyingElements.attr('opacity', 0);
      // Note: would need to remove added chunk rects for full reset
      statusText.attr('fill', '#888').text('Replication: 1/5 nodes');
    }
  };
}
