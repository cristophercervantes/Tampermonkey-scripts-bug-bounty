// ==UserScript==
// @name         Hidden Parameter Finder
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Find hidden parameters in forms and URLs
// @author       Bug Bounty Hunter
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    function findHiddenParameters() {
        // Check forms
        const forms = document.querySelectorAll('form');
        forms.forEach((form, index) => {
            const hiddenInputs = form.querySelectorAll('input[type="hidden"]');
            if (hiddenInputs.length > 0) {
                console.log(`📋 Form ${index} Hidden Parameters:`, 
                    Array.from(hiddenInputs).map(input => ({
                        name: input.name,
                        value: input.value
                    }))
                );
            }
        });
        
        // Check URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.toString()) {
            console.log('🔗 URL Parameters:', Object.fromEntries(urlParams.entries()));
        }
        
        // Check localStorage and sessionStorage for potential parameters
        if (localStorage.length > 0) {
            console.log('💾 localStorage items:', Object.keys(localStorage));
        }
        if (sessionStorage.length > 0) {
            console.log('💾 sessionStorage items:', Object.keys(sessionStorage));
        }
    }
    
    // Run on page load
    setTimeout(findHiddenParameters, 2000);
    
    // Also run when forms are submitted
    document.addEventListener('submit', function(e) {
        setTimeout(findHiddenParameters, 1000);
    });
})();
