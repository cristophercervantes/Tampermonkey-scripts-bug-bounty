// ==UserScript==
// @name         Google Results Extractor - Compact Layout
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Copy URLs, titles, domains and file types from Google results - Compact layout
// @author       YourName
// @match        https://www.google.com/search?q=*
// @match        https://www.google.com/*/search?q=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        panelPosition: { top: '120px', right: '20px' },
        togglePosition: { top: '80px', right: '20px' },
        colors: {
            primary: '#1a73e8',
            secondary: '#5f6368',
            success: '#0b8043'
        }
    };

    // Extract all search results
    function extractResults() {
        const results = [];
        
        // Multiple selector strategies
        const selectors = [
            'a[jsname="UWckNb"]',
            '.yuRUbf a',
            '.tF2Cxc a', 
            '.MBeuO a',
            'a[data-ved]',
            '.g a'
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                try {
                    let href = element.getAttribute('href');
                    
                    // Handle Google redirects
                    if (href && href.startsWith('/url?')) {
                        const urlParams = new URLSearchParams(href.replace('/url?', ''));
                        href = urlParams.get('q') || urlParams.get('url');
                    }

                    // Get title
                    let title = '';
                    if (element.querySelector('h3')) {
                        title = element.querySelector('h3').textContent;
                    } else {
                        title = element.textContent || element.innerText;
                    }

                    if (href && href.startsWith('http') && title) {
                        href = href.trim();
                        title = title.trim().replace(/\s+/g, ' ');
                        const domain = new URL(href).hostname;
                        
                        // Avoid duplicates
                        const exists = results.some(item => item.href === href);
                        if (!exists) {
                            results.push({ href, title, domain });
                        }
                    }
                } catch (e) {
                    // Skip invalid URLs
                }
            });
        });

        return results;
    }

    // Copy to clipboard with notification
    function copyToClipboard(text, message) {
        if (!text || text.trim() === '') {
            alert('No data to copy!');
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            // Simple alert instead of notification
            alert(message);
        }).catch(err => {
            // Fallback method
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert(message);
        });
    }

    // Create compact button matching your screenshot style
    function createButton(text, onClick, isSmall = false) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.cssText = `
            display: block;
            width: ${isSmall ? '140px' : '160px'};
            padding: ${isSmall ? '6px 8px' : '8px 12px'};
            margin: 4px 0;
            background: #4285f4;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: ${isSmall ? '11px' : '12px'};
            font-family: Arial, sans-serif;
            text-align: left;
        `;
        button.addEventListener('click', onClick);
        return button;
    }

    // Create the main panel matching your screenshot
    function createMainPanel() {
        const panel = document.createElement('div');
        panel.id = 'extractor-panel';
        panel.style.cssText = `
            position: fixed;
            top: ${CONFIG.panelPosition.top};
            right: ${CONFIG.panelPosition.right};
            background: white;
            border: 1px solid #dadce0;
            border-radius: 8px;
            padding: 10px;
            z-index: 9999;
            font-family: Arial, sans-serif;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            max-height: 80vh;
            overflow-y: auto;
        `;

        // Create two columns container
        const columnsContainer = document.createElement('div');
        columnsContainer.style.cssText = `
            display: flex;
            gap: 10px;
        `;
        panel.appendChild(columnsContainer);

        // Left column - File types
        const leftColumn = document.createElement('div');
        leftColumn.style.flex = '1';
        columnsContainer.appendChild(leftColumn);

        // Right column - Main functions
        const rightColumn = document.createElement('div');
        rightColumn.style.flex = '1';
        columnsContainer.appendChild(rightColumn);

        // === LEFT COLUMN - File Types ===

        // First section in left column - Office files
        const officeSection = document.createElement('div');
        officeSection.style.marginBottom = '15px';
        
        const officeFiles = [
            { text: 'Copy PPT URLs', ext: '.ppt' },
            { text: 'Copy PPTX URLs', ext: '.pptx' },
            { text: 'Copy DOC URLs', ext: '.doc' },
            { text: 'Copy DOCX URLs', ext: '.docx' },
            { text: 'Copy CSV URLs', ext: '.csv' }
        ];

        officeFiles.forEach(file => {
            officeSection.appendChild(createButton(file.text, () => {
                const data = extractResults();
                const filtered = data.filter(item => item.href.toLowerCase().endsWith(file.ext));
                if (filtered.length > 0) {
                    copyToClipboard(filtered.map(item => item.href).join('\n'), `Copied ${filtered.length} ${file.ext} URLs`);
                } else {
                    alert(`No ${file.ext} URLs found`);
                }
            }, true));
        });

        leftColumn.appendChild(officeSection);

        // Second section in left column - Config/Backup files
        const configSection = document.createElement('div');
        
        const configFiles = [
            { text: 'Copy INI URLs', ext: '.ini' },
            { text: 'Copy ENV URLs', ext: '.env' },
            { text: 'Copy SH URLs', ext: '.sh' },
            { text: 'Copy BAK URLs', ext: '.bak' },
            { text: 'Copy BACKUP URLs', ext: '.backup' },
            { text: 'Copy ZIP URLs', ext: '.zip' },
            { text: 'Copy TAR URLs', ext: '.tar' },
            { text: 'Copy YML URLs', ext: '.yml' },
            { text: 'Copy SWP URLs', ext: '.swp' },
            { text: 'Copy OLD URLs', ext: '.old' },
            { text: 'Copy SVN URLs', ext: '.svn' },
            { text: 'Copy HTPASSWD URLs', ext: '.htpasswd' },
            { text: 'Copy HTACCESS URLs', ext: '.htaccess' }
        ];

        configFiles.forEach(file => {
            configSection.appendChild(createButton(file.text, () => {
                const data = extractResults();
                const filtered = data.filter(item => item.href.toLowerCase().endsWith(file.ext));
                if (filtered.length > 0) {
                    copyToClipboard(filtered.map(item => item.href).join('\n'), `Copied ${filtered.length} ${file.ext} URLs`);
                } else {
                    alert(`No ${file.ext} URLs found`);
                }
            }, true));
        });

        leftColumn.appendChild(configSection);

        // === RIGHT COLUMN - Main Functions ===

        // Basic functions section
        const basicSection = document.createElement('div');
        basicSection.style.marginBottom = '15px';

        basicSection.appendChild(createButton('Copy URLs', () => {
            const data = extractResults();
            if (data.length > 0) {
                copyToClipboard(data.map(item => item.href).join('\n'), `Copied ${data.length} URLs`);
            } else {
                alert('No URLs found!');
            }
        }));

        basicSection.appendChild(createButton('Copy Titles', () => {
            const data = extractResults();
            if (data.length > 0) {
                copyToClipboard(data.map(item => item.title).join('\n'), `Copied ${data.length} titles`);
            } else {
                alert('No titles found!');
            }
        }));

        basicSection.appendChild(createButton('Copy URLs and Titles', () => {
            const data = extractResults();
            if (data.length > 0) {
                copyToClipboard(data.map(item => `${item.href} [${item.title}]`).join('\n'), `Copied ${data.length} URLs + titles`);
            } else {
                alert('No data found!');
            }
        }));

        basicSection.appendChild(createButton('Copy Domains and Titles', () => {
            const data = extractResults();
            if (data.length > 0) {
                copyToClipboard(data.map(item => `${item.domain} [${item.title}]`).join('\n'), `Copied ${data.length} domains + titles`);
            } else {
                alert('No data found!');
            }
        }));

        basicSection.appendChild(createButton('Copy Domains', () => {
            const data = extractResults();
            if (data.length > 0) {
                copyToClipboard(data.map(item => item.domain).join('\n'), `Copied ${data.length} domains`);
            } else {
                alert('No domains found!');
            }
        }));

        rightColumn.appendChild(basicSection);

        // Server files section
        const serverSection = document.createElement('div');
        serverSection.style.marginBottom = '15px';

        const serverFiles = [
            { text: 'Copy PHP URLs', ext: '.php' },
            { text: 'Copy ASPX URLs', ext: '.aspx' },
            { text: 'Copy ASP URLs', ext: '.asp' },
            { text: 'Copy JSP URLs', ext: '.jsp' },
            { text: 'Copy JSPX URLs', ext: '.jspx' },
            { text: 'Copy DO URLs', ext: '.do' }
        ];

        serverFiles.forEach(file => {
            serverSection.appendChild(createButton(file.text, () => {
                const data = extractResults();
                const filtered = data.filter(item => item.href.toLowerCase().endsWith(file.ext));
                if (filtered.length > 0) {
                    copyToClipboard(filtered.map(item => item.href).join('\n'), `Copied ${filtered.length} ${file.ext} URLs`);
                } else {
                    alert(`No ${file.ext} URLs found`);
                }
            }, true));
        });

        rightColumn.appendChild(serverSection);

        // Special URLs section
        const specialSection = document.createElement('div');

        specialSection.appendChild(createButton('Copy URLs with "="', () => {
            const data = extractResults();
            const filtered = data.filter(item => item.href.includes('='));
            if (filtered.length > 0) {
                copyToClipboard(filtered.map(item => item.href).join('\n'), `Copied ${filtered.length} URLs with "="`);
            } else {
                alert('No URLs with "=" found');
            }
        }, true));

        specialSection.appendChild(createButton('Copy GIT URLs', () => {
            const data = extractResults();
            const filtered = data.filter(item => item.href.includes('/.git'));
            if (filtered.length > 0) {
                copyToClipboard(filtered.map(item => item.href).join('\n'), `Copied ${filtered.length} GIT URLs`);
            } else {
                alert('No GIT URLs found');
            }
        }, true));

        rightColumn.appendChild(specialSection);

        return panel;
    }

    // Create container for manage buttons (checkbox panel)
    function createManagePanel() {
        const managePanel = document.createElement('div');
        managePanel.id = 'manage-panel';
        managePanel.style.cssText = `
            position: fixed;
            top: 150px;
            right: 350px;
            background: white;
            border: 1px solid #dadce0;
            border-radius: 8px;
            padding: 10px;
            z-index: 9998;
            font-family: Arial, sans-serif;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            display: none;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 14px;
        `;
        header.textContent = 'Manage Buttons';
        managePanel.appendChild(header);

        // Add some sample checkboxes (you can expand this)
        const checkboxes = [
            'Show Office Files',
            'Show Config Files', 
            'Show Server Files',
            'Show Special URLs'
        ];

        checkboxes.forEach(text => {
            const label = document.createElement('label');
            label.style.cssText = `
                display: block;
                margin: 5px 0;
                font-size: 12px;
            `;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = true;
            checkbox.style.marginRight = '5px';
            
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(text));
            managePanel.appendChild(label);
        });

        return managePanel;
    }

    // Create toggle button
    function createToggleButton() {
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = 'Copy URLs';
        toggleBtn.style.cssText = `
            position: fixed;
            top: ${CONFIG.togglePosition.top};
            right: ${CONFIG.togglePosition.right};
            z-index: 10000;
            padding: 8px 16px;
            background: #4285f4;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;

        toggleBtn.addEventListener('click', () => {
            const panel = document.getElementById('extractor-panel');
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });

        return toggleBtn;
    }

    // Create Manage Buttons toggle
    function createManageButton() {
        const manageBtn = document.createElement('button');
        manageBtn.textContent = 'Manage Buttons';
        manageBtn.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            z-index: 10000;
            padding: 6px 12px;
            background: #34a853;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-family: Arial, sans-serif;
            font-size: 12px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;

        manageBtn.addEventListener('click', () => {
            const managePanel = document.getElementById('manage-panel');
            managePanel.style.display = managePanel.style.display === 'none' ? 'block' : 'none';
        });

        return manageBtn;
    }

    // Initialize
    function init() {
        const toggleBtn = createToggleButton();
        const manageBtn = createManageButton();
        const panel = createMainPanel();
        const managePanel = createManagePanel();
        
        // Hide panels initially
        panel.style.display = 'none';
        
        document.body.appendChild(toggleBtn);
        document.body.appendChild(manageBtn);
        document.body.appendChild(panel);
        document.body.appendChild(managePanel);

        // Keyboard shortcut (Ctrl+Shift+C)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                const panel = document.getElementById('extractor-panel');
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            }
        });
    }

    // Start the script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
