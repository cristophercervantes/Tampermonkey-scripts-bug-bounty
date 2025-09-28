// ==UserScript==
// @name         CORS Misconfiguration Detector
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Detect CORS misconfigurations
// @author       Bug Bounty Hunter
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        return originalFetch.apply(this, args).then(response => {
            const corsHeader = response.headers.get('access-control-allow-origin');
            if (corsHeader === '*') {
                console.warn('🚨 INSECURE CORS CONFIGURATION:', {
                    url: response.url,
                    'access-control-allow-origin': corsHeader,
                    'access-control-allow-credentials': response.headers.get('access-control-allow-credentials')
                });
            }
            return response;
        });
    };
    
    console.log('🔍 CORS Misconfiguration Detector Active');
})();
