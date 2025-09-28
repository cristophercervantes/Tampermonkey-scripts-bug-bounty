// ==UserScript==
// @name         Authorization Header Logger
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Log all authorization headers for bug bounty
// @author       Bug Bounty Hunter
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    // Intercept fetch requests
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        return originalFetch.apply(this, args).then(response => {
            if (response.headers.has('authorization') || response.headers.has('Authorization')) {
                console.log('🔐 Authorization Header Found:', {
                    url: response.url,
                    headers: Object.fromEntries(response.headers.entries())
                });
            }
            return response;
        });
    };
    
    // Log all requests with auth headers
    console.log('🚀 Authorization Header Logger Activated');
})();
