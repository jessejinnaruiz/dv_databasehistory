/**
 * Cloud/Object Store Animation
 * Era 5: 2010s-Present - The Cloud Era
 * 
 * Visualizes: Data chunks replicating across distributed nodes
 * v2: Added latency labels, heartbeat pulses, durability counter
 */

export function initCloudNodes(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return null;
  
  container.innerHTML = '';
  
  const width = 420;
  const height = 300;
  
  const svg = d3.select(container)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('max-width', '420px');
  
  // Define glow filter
  const defs = svg.append('defs');
  const glowFilter = defs.append('filter')
    .attr('id', 'node-glow')
    .attr('x', '-50%')
    .attr('y', '-50%')
    .attr('width', '200%')
    .attr('height', '200%');
  glowFilter.append('feGaussianBlur')
    .attr('stdDeviation', '3')
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
    .text('Distributed Object Storage');
  
  // Node positions (representing data centers)
  const nodes = [
    { x: 90, y: 100, label: 'US-East', latency: 12 },
    { x: 320, y: 80, label: 'EU-West', latency: 85 },
    { x: 210, y: 160, label: 'Primary', latency: 0 },
    { x: 70, y: 210, label: 'US-West', latency: 45 },
    { x: 340, y: 190, label: 'Asia-Pac', latency: 120 }
  ];
  
  // Connections between nodes
  const connections = [
    { source: 2, target: 0, latency: 12 },
    { source: 2, target: 1, latency: 85 },
    { source: 2, target: 3, latency: 45 },
    { source: 2, target: 4, latency: 120 },
    { source: 0, target: 1, latency: 73 },
    { source: 3, target: 4, latency: 95 }
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
    .attr('stroke-width', 1.5)
    .attr('opacity', 0.3);
  
  // Latency labels on connections
  const latencyLabels = svg.selectAll('.latency-label')
    .data(connections.slice(0, 4)) // Only primary connections
    .enter()
    .append('text')
    .attr('class', 'latency-label')
    .attr('x', d => (nodes[d.source].x + nodes[d.target].x) / 2)
    .attr('y', d => (nodes[d.source].y + nodes[d.target].y) / 2 - 5)
    .attr('text-anchor', 'middle')
    .attr('fill', '#555')
    .attr('font-size', '9px')
    .attr('font-family', 'monospace')
    .attr('opacity', 0)
    .text(d => `${d.latency}ms`);
  
  // Draw nodes (circles)
  const nodeGroups = svg.selectAll('.node')
    .data(nodes)
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', d => `translate(${d.x}, ${d.y})`);
  
  // Node circles
  const nodeCircles = nodeGroups.append('circle')
    .attr('r', 22)
    .attr('fill', '#1a3a5a')
    .attr('stroke', '#4a6a8a')
    .attr('stroke-width', 2);
  
  // Node labels
  nodeGroups.append('text')
    .attr('y', 38)
    .attr('text-anchor', 'middle')
    .attr('fill', '#888')
    .attr('font-size', '9px')
    .text(d => d.label);
  
  // Data chunk indicator for primary node (index 2)
  // This is the initial data before replication
  const primaryNode = d3.select(nodeGroups.nodes()[2]);
  primaryNode.append('rect')
    .attr('class', 'primary-chunk')
    .attr('x', -7)
    .attr('y', -7)
    .attr('width', 14)
    .attr('height', 14)
    .attr('rx', 3)
    .attr('fill', '#4ecdc4');
  
  // Flying data chunks (for animation)
  const flyingChunks = [];
  connections.slice(0, 4).forEach((conn, i) => {
    flyingChunks.push({
      source: nodes[conn.source],
      target: nodes[conn.target],
      delay: i * 350,
      latency: conn.latency
    });
  });
  
  const flyingElements = svg.selectAll('.flying-chunk')
    .data(flyingChunks)
    .enter()
    .append('rect')
    .attr('class', 'flying-chunk')
    .attr('width', 10)
    .attr('height', 10)
    .attr('rx', 2)
    .attr('fill', '#4ecdc4')
    .attr('filter', 'url(#node-glow)')
    .attr('x', d => d.source.x - 5)
    .attr('y', d => d.source.y - 5)
    .attr('opacity', 0);
  
  // Replication counter
  const replicationText = svg.append('text')
    .attr('x', width / 2)
    .attr('y', height - 35)
    .attr('text-anchor', 'middle')
    .attr('fill', '#888')
    .attr('font-size', '12px')
    .text('Replication: 1/5 regions');
  
  // Durability indicator
  const durabilityText = svg.append('text')
    .attr('x', width / 2)
    .attr('y', height - 15)
    .attr('text-anchor', 'middle')
    .attr('fill', '#555')
    .attr('font-size', '11px')
    .attr('font-family', 'monospace')
    .text('Durability: calculating...');
  
  // Animation state
  let hasPlayed = false;
  let heartbeatTimer = null;
  
  return {
    play: function() {
      if (hasPlayed) return;
      hasPlayed = true;
      
      // Show latency labels
      latencyLabels
        .transition()
        .delay((d, i) => i * 200)
        .duration(300)
        .attr('opacity', 1);
      
      // Animate connections lighting up
      connectionLines
        .transition()
        .delay((d, i) => i * 150)
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
        .duration(d => 400 + d.latency * 3) // Slower for higher latency
        .ease(d3.easeCubicInOut)
        .attr('x', d => d.target.x - 5)
        .attr('y', d => d.target.y - 5)
        .transition()
        .duration(200)
        .attr('opacity', 0);
      
      // Add chunk indicators to target nodes and update counter
      let replicatedCount = 1;
      const durabilityNines = ['99%', '99.9%', '99.99%', '99.999%', '99.9999999%'];
      
      flyingChunks.forEach((chunk, i) => {
        const arrivalTime = chunk.delay + 400 + chunk.latency * 3 + 100;
        
        setTimeout(() => {
          // Find target node and add chunk
          const targetIdx = connections[i].target;
          const targetNode = d3.select(nodeGroups.nodes()[targetIdx]);
          
          targetNode.append('rect')
            .attr('x', -7)
            .attr('y', -7)
            .attr('width', 14)
            .attr('height', 14)
            .attr('rx', 3)
            .attr('fill', '#4ecdc4')
            .attr('opacity', 0)
            .transition()
            .duration(300)
            .attr('opacity', 1);
          
          // Pulse the node
          targetNode.select('circle')
            .attr('filter', 'url(#node-glow)')
            .transition()
            .duration(300)
            .attr('fill', '#2a5a7a')
            .transition()
            .duration(300)
            .attr('fill', '#1a3a5a');
          
          replicatedCount++;
          replicationText.text(`Replication: ${replicatedCount}/5 regions`);
          durabilityText.text(`Durability: ${durabilityNines[Math.min(replicatedCount - 1, 4)]}`);
          
          if (replicatedCount === 5) {
            replicationText
              .transition()
              .duration(300)
              .attr('fill', '#4ecdc4')
              .text('✓ Replicated to 5 regions');
            
            durabilityText
              .attr('fill', '#4ecdc4')
              .text('Durability: 99.999999999% (11 nines)');
            
            // Start heartbeat animation
            heartbeatTimer = setInterval(() => {
              nodeCircles
                .transition()
                .duration(400)
                .attr('stroke-width', 4)
                .attr('stroke', '#4ecdc4')
                .transition()
                .duration(600)
                .attr('stroke-width', 2)
                .attr('stroke', '#4a6a8a');
            }, 2000);
          }
        }, arrivalTime);
      });
    },
    
    reset: function() {
      hasPlayed = false;
      if (heartbeatTimer) {
        clearInterval(heartbeatTimer);
      }
      connectionLines.attr('opacity', 0.3).attr('stroke', '#2a4a6a');
      latencyLabels.attr('opacity', 0);
      flyingElements.attr('opacity', 0).attr('x', d => d.source.x - 5).attr('y', d => d.source.y - 5);
      nodeCircles.attr('stroke-width', 2).attr('stroke', '#4a6a8a').attr('filter', null);
      replicationText.attr('fill', '#888').text('Replication: 1/5 regions');
      durabilityText.attr('fill', '#555').text('Durability: calculating...');
    }
  };
}
