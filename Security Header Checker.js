// ==UserScript==
// @name         Security Header Checker
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Check for missing security headers
// @author       Bug Bounty Hunter
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    const securityHeaders = [
        'content-security-policy',
        'strict-transport-security',
        'x-frame-options',
        'x-content-type-options',
        'referrer-policy',
        'permissions-policy'
    ];
    
    function checkHeaders() {
        // This would typically be used with a browser extension
        // that can access response headers
        console.log('🔒 Checking security headers...');
        
        // For demonstration - in real use, you'd need to intercept responses
        securityHeaders.forEach(header => {
            console.log(`Looking for ${header}...`);
        });
    }
    
    // Check headers after page load
    setTimeout(checkHeaders, 3000);
})();
