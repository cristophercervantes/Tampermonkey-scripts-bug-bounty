// ==UserScript==
// @name         JWT Token Extractor
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Extract and analyze JWT tokens from requests
// @author       Bug Bounty Hunter
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';
    
    function parseJWT(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    }
    
    // Intercept all requests
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this.addEventListener('readystatechange', function() {
            if (this.readyState === 4) {
                const authHeader = this.getResponseHeader('Authorization') || 
                                 this.getResponseHeader('authorization');
                if (authHeader && authHeader.startsWith('Bearer ')) {
                    const token = authHeader.substring(7);
                    const payload = parseJWT(token);
                    if (payload) {
                        console.log('🎯 JWT Token Found:', {
                            url: url,
                            token: token,
                            payload: payload,
                            header: parseJWT(token.split('.')[0] + '.')
                        });
                    }
                }
            }
        });
        originalOpen.apply(this, arguments);
    };
})();
