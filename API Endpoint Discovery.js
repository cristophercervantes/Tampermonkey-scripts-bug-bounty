// ==UserScript==
// @name         API Endpoint Discovery
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Discover and log API endpoints
// @author       Bug Bounty Hunter
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';
    
    const apiKeywords = [
        '/api/', '/graphql', '/rest/', '/v1/', '/v2/', '/v3/', 
        '/admin/', '/internal/', '/private/', '/secret/',
        'oauth', 'auth', 'login', 'register', 'user', 'account'
    ];
    
    const discoveredEndpoints = GM_getValue('discoveredEndpoints', {});
    
    function logEndpoint(url, method) {
        const domain = new URL(url).hostname;
        if (!discoveredEndpoints[domain]) {
            discoveredEndpoints[domain] = [];
        }
        
        const endpoint = { url, method, timestamp: new Date().toISOString() };
        
        // Check if we've already seen this endpoint
        const exists = discoveredEndpoints[domain].some(e => 
            e.url === url && e.method === method
        );
        
        if (!exists) {
            discoveredEndpoints[domain].push(endpoint);
            GM_setValue('discoveredEndpoints', discoveredEndpoints);
            console.log('🔍 New API Endpoint:', endpoint);
        }
    }
    
    // Intercept fetch
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = args[0];
        const method = args[1]?.method || 'GET';
        
        if (apiKeywords.some(keyword => url.includes(keyword))) {
            logEndpoint(url, method);
        }
        
        return originalFetch.apply(this, args);
    };
    
    // Intercept XHR
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (apiKeywords.some(keyword => url.includes(keyword))) {
            logEndpoint(url, method);
        }
        originalOpen.apply(this, arguments);
    };
    
    // Display all discovered endpoints
    console.log('📊 Previously Discovered Endpoints:', discoveredEndpoints);
})();
