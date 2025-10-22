/**
 * Helper script to monitor SSR cache performance
 * Usage: node server/ssr/cache-monitor.js [interval_seconds]
 */

const http = require('http');

const CACHE_STATS_URL = 'http://localhost:3001/api/ssr-cache/stats';
const INTERVAL = (process.argv[2] || 30) * 1000; // Default 30 seconds

console.log('🔍 SSR Cache Monitor');
console.log(`📊 Polling every ${INTERVAL / 1000} seconds`);
console.log(`📍 Endpoint: ${CACHE_STATS_URL}\n`);
console.log('Press Ctrl+C to stop\n');

let previousStats = null;

function fetchStats() {
  http.get(CACHE_STATS_URL, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        const stats = response.stats;
        const timestamp = new Date().toLocaleTimeString();

        console.log(`\n⏰ ${timestamp}`);
        console.log('━'.repeat(60));
        console.log(`📦 Cache Size:       ${stats.size}/${stats.maxSize} entries`);
        console.log(`✅ Cache Hits:       ${stats.hits}`);
        console.log(`❌ Cache Misses:     ${stats.misses}`);
        console.log(`🎯 Hit Rate:         ${stats.hitRate}`);

        // Calculate performance indicators
        const total = stats.hits + stats.misses;
        const utilizationPercent = ((stats.size / stats.maxSize) * 100).toFixed(1);

        console.log(`📈 Utilization:      ${utilizationPercent}%`);

        // Show delta if we have previous stats
        if (previousStats) {
          const hitsDelta = stats.hits - previousStats.hits;
          const missesDelta = stats.misses - previousStats.misses;
          const totalDelta = hitsDelta + missesDelta;

          if (totalDelta > 0) {
            const intervalHitRate = ((hitsDelta / totalDelta) * 100).toFixed(2);
            console.log(`\n🔄 Last interval:`);
            console.log(`   Requests:        ${totalDelta}`);
            console.log(`   Hits:            ${hitsDelta} (${intervalHitRate}%)`);
            console.log(`   Misses:          ${missesDelta}`);
          }
        }

        // Performance recommendations
        console.log('\n💡 Recommendations:');
        if (parseFloat(stats.hitRate) < 50) {
          console.log('   ⚠️  Low hit rate (<50%) - consider increasing TTL');
        } else if (parseFloat(stats.hitRate) > 90) {
          console.log('   ✅ Excellent hit rate (>90%)');
        } else {
          console.log('   ✅ Good hit rate (50-90%)');
        }

        if (stats.size >= stats.maxSize * 0.9) {
          console.log('   ⚠️  Cache is nearly full (>90%) - consider increasing maxSize');
        } else if (stats.size < stats.maxSize * 0.3) {
          console.log('   ℹ️  Low utilization (<30%) - maxSize could be reduced');
        }

        previousStats = stats;
      } catch (error) {
        console.error('❌ Error parsing stats:', error.message);
      }
    });
  }).on('error', (error) => {
    console.error(`❌ Connection error: ${error.message}`);
    console.log('   Make sure the server is running on localhost:3001');
  });
}

// Initial fetch
fetchStats();

// Poll at interval
setInterval(fetchStats, INTERVAL);

