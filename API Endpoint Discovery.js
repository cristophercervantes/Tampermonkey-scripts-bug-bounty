// ==UserScript==
// @name         Advanced API Endpoint Discovery
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Discover, log, and export API endpoints
// @author       Bug Bounty Hunter
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';
    
    const apiKeywords = [
        '/api/', '/graphql', '/rest/', '/v1/', '/v2/', '/v3/', '/v4/',
        '/admin/', '/internal/', '/private/', '/secret/', '/backend/',
        'oauth', 'auth', 'login', 'register', 'user', 'account',
        'token', 'password', 'reset', 'verify', 'confirm',
        'admin', 'moderator', 'superuser', 'root'
    ];
    
    let discoveredEndpoints = GM_getValue('discoveredEndpoints', {});
    
    function logEndpoint(url, method, status) {
        try {
            const domain = new URL(url).hostname;
            if (!discoveredEndpoints[domain]) {
                discoveredEndpoints[domain] = [];
            }
            
            const endpoint = { 
                url, 
                method, 
                status: status || 'unknown',
                timestamp: new Date().toISOString(),
                domain: domain
            };
            
            // Check for duplicates
            const exists = discoveredEndpoints[domain].some(e => 
                e.url === url && e.method === method
            );
            
            if (!exists) {
                discoveredEndpoints[domain].push(endpoint);
                GM_setValue('discoveredEndpoints', discoveredEndpoints);
                
                console.log('🎯 NEW API ENDPOINT:', {
                    'Domain': domain,
                    'Method': method,
                    'URL': url,
                    'Status': status,
                    'Time': new Date().toLocaleTimeString()
                });
            }
        } catch (e) {
            console.log('⚠️ Could not process URL:', url);
        }
    }
    
    // Enhanced fetch interceptor
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = args[0];
        const method = args[1]?.method || 'GET';
        
        return originalFetch.apply(this, args).then(response => {
            if (typeof url === 'string' && apiKeywords.some(keyword => url.toLowerCase().includes(keyword))) {
                logEndpoint(url, method, response.status);
            }
            return response;
        }).catch(error => {
            if (typeof url === 'string' && apiKeywords.some(keyword => url.toLowerCase().includes(keyword))) {
                logEndpoint(url, method, 'FAILED');
            }
            throw error;
        });
    };
    
    // Enhanced XHR interceptor
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this.addEventListener('load', function() {
            if (typeof url === 'string' && apiKeywords.some(keyword => url.toLowerCase().includes(keyword))) {
                logEndpoint(url, method, this.status);
            }
        });
        
        this.addEventListener('error', function() {
            if (typeof url === 'string' && apiKeywords.some(keyword => url.toLowerCase().includes(keyword))) {
                logEndpoint(url, method, 'ERROR');
            }
        });
        
        originalOpen.apply(this, arguments);
    };
    
    // Export functionality
    function exportEndpoints() {
        const endpoints = GM_getValue('discoveredEndpoints', {});
        const dataStr = JSON.stringify(endpoints, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `api-endpoints-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    function showStats() {
        const endpoints = GM_getValue('discoveredEndpoints', {});
        let total = 0;
        Object.keys(endpoints).forEach(domain => {
            total += endpoints[domain].length;
        });
        
        console.log('📊 API ENDPOINT STATISTICS:');
        console.log('Total domains:', Object.keys(endpoints).length);
        console.log('Total endpoints:', total);
        Object.keys(endpoints).forEach(domain => {
            console.log(`- ${domain}: ${endpoints[domain].length} endpoints`);
        });
    }
    
    function clearEndpoints() {
        GM_setValue('discoveredEndpoints', {});
        discoveredEndpoints = {};
        console.log('🗑️ All endpoints cleared!');
    }
    
    // Register menu commands
    GM_registerMenuCommand('📊 Show Endpoint Stats', showStats);
    GM_registerMenuCommand('📥 Export Endpoints', exportEndpoints);
    GM_registerMenuCommand('🗑️ Clear All Endpoints', clearEndpoints);
    
    console.log('🚀 Advanced API Endpoint Discovery Active!');
    console.log('💡 Use Tampermonkey menu commands to manage endpoints');
})();
