# [Google Results Extractor — Tampermonkey Script](https://github.com/cristophercervantes/Tampermonkey-scripts-bug-bounty/blob/main/Copy%20URLs%2C%20Titles%2C%20Domains%2C%20and%20Specific%20URLs.js)

A powerful Tampermonkey userscript that extracts URLs, titles, domains, and specific file types from Google search results with a clean, compact interface.

---

## 🚀 Features

* **Basic Extraction**

  * Copy URLs — Extract all result URLs
  * Copy Titles — Extract only page titles
  * Copy URLs + Titles — Combined format: `URL [Title]`
  * Copy Domains + Titles — `domain.com [Title]`
  * Copy Domains — Extract only domain names

* **File Type Extraction**

  * Office files: `PPT`, `PPTX`, `DOC`, `DOCX`, `CSV`
  * Server files: `PHP`, `ASPX`, `ASP`, `JSP`, `JSPX`, `DO`
  * Configuration files: `INI`, `ENV`, `SH`, `YML`, `JSON`, `TXT`, `XML`
  * Backup & archive: `BAK`, `BACKUP`, `ZIP`, `TAR`, `SWP`, `OLD`
  * Version control: `SVN`, `.git` folders
  * Web-server files: `HTPASSWD`, `.htaccess`

* **🔍 Special URL Patterns**

  * Parameterized URLs (URLs containing `=`)
  * `.git` repository exposures
  * Admin / login / API endpoints

* **🛠 UI & UX**

  * Compact two-column design
  * Button groups for quick extraction
  * Keyboard shortcuts
  * Smart notifications and manual copy fallback

* **🔒 Privacy & Security**

  * Runs locally in your browser (no external requests)
  * No data collection
  * Open-source (MIT License)

---

## 🎯 Installation

1. **Install Tampermonkey**

   * Chrome: Chrome Web Store
   * Firefox: Firefox Add-ons
   * Edge: Microsoft Store

2. **Install the Script**

   * Click the Tampermonkey extension icon
   * Select **Create a new script**
   * Delete the default template
   * Copy and paste the userscript code (or this script's source)
   * Press `Ctrl + S` to save

3. **Enable the Script**

   * Ensure the script is enabled in Tampermonkey (toggle ON)
   * The script will automatically run on Google search pages

---

## 🎯 Usage

### Basic Operation

1. Go to Google and perform a search.
2. Look for the **Copy URLs** button in the top-right corner of the search results page.
3. Click it to expand the extraction panel.
4. Click any extraction button to copy the desired data to clipboard.

### Interface Layout (visual)

```
┌─────────────────────────────────────────┐
│              Google Search Bar           │
└─────────────────────────────────────────┘
                    │
                    ▼
    [Copy URLs] [Manage Buttons]  ← Control Buttons
                    │
                    ▼
    ┌─────────────┬─────────────┐
    │   Left Column             │   Right Column
    │   • PPT URLs              │   • Copy URLs
    │   • DOC URLs              │   • Copy Titles  
    │   • CSV URLs              │   • URLs + Titles
    │   • INI URLs              │   • Domains
    │   • ENV URLs              │   • PHP URLs
    │   • Backup URLs           │   • ASPX URLs
    │   • ZIP URLs              │   • JSP URLs
    │   • Config URLs           │   • URLs with "="
    │   • HTAccess URLs         │   • GIT URLs
    └─────────────┴─────────────┘
```

### Keyboard Shortcuts

* `Ctrl + Shift + C` — Toggle the extraction panel
* `Ctrl + Shift + M` — Toggle manage buttons panel

---

## 🔧 Customization

### Adding New File Types

Edit the `fileTypes` array in the script configuration. Example:

```javascript
const fileTypes = [
  '.php', '.aspx', '.asp', '.jsp', '.jspx', '.do',
  // Add your custom file types here
  '.your-extension'
];
```

### Adding Custom Patterns

Modify the `customPatterns` array to add named patterns the UI can target:

```javascript
const customPatterns = [
  { name: 'Your Pattern', pattern: 'your-keyword' },
  { name: 'API URLs', pattern: '/api/' },
  // Add more patterns as needed
];
```

---

## 🐛 Troubleshooting

* **Script not working?**

  * Verify Tampermonkey is installed and the script is enabled.
  * Refresh the Google search page.
  * Check the browser console (F12) for errors — Google may change HTML structure, requiring selector updates.

* **No URLs found?**

  * Ensure search results have fully loaded.
  * Try a popular search like `github` or `stackoverflow` to test selectors.

* **Clipboard issues?**

  * Ensure the browser allows clipboard access (some browsers require a gesture).
  * Clipboard API requires HTTPS (Google is HTTPS) and permissions.
  * Script includes a manual copy fallback if automatic clipboard access fails.

---

## 📊 Output Formats

* **URL List**

```
https://example.com/page1
https://example.com/page2
https://example.com/page3
```

* **URL + Title Format**

```
https://example.com/page1 [Example Page Title 1]
https://example.com/page2 [Example Page Title 2]
```

* **Domain + Title Format**

```
example.com [Example Page Title 1]
example.org [Example Page Title 2]
```

---

## 🎨 UI Features

* Compact, minimal interface that doesn't interfere with browsing
* Two-column layout with grouped extraction buttons
* Hover effects for visual feedback
* Smart notifications (success / failure / fallback)
* Responsive layout for different screen sizes

---

## 🤝 Contributing

Contributions welcome! Common improvements:

* Add new file types or extraction patterns
* Improve URL detection and selectors
* Enhance UI/UX or add export formats (CSV, JSON)
* Add support for other search engines (Bing, DuckDuckGo)

If you make improvements, please share a PR or copy of your updated script.

---

## 📝 License

This project is released under the **MIT License**.

---

## 🆘 Support

If you encounter issues:

1. Check this README for troubleshooting steps
2. Verify Tampermonkey is installed and the script is enabled
3. Test with several different Google queries
4. Check the browser console (F12) for errors

Happy bug bounty hunting! 🐛💰

---

*Generated: Google Results Extractor — Tampermonkey Script (README markdown)*
