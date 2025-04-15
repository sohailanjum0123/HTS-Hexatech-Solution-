(() => {
    // Add preconnect links for performance
    const addPreconnect = (href, crossorigin = false) => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = href;
        if (crossorigin) link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    };

    addPreconnect('https://fonts.googleapis.com');
    addPreconnect('https://fonts.gstatic.com', true);

    // Add Google Fonts link
    const addFontLink = (href) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    };

    addFontLink('https://fonts.googleapis.com/css2?family=Bodoni+Moda+SC:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&display=swap');
    addFontLink('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

    // Add Font Styling
    const styleContent = `
        :root {
            --headlinefont: 'Bodoni Moda SC', serif;
            --contentfont: 'Poppins', sans-serif;
        }
        
        [class="heading"] h1,
        [class="heading"] h2,
        [class="heading"] h3,
        [class="heading"] h4,
        [class*="heading"] h5 {
            font-family: var(--headlinefont) !important;
        }
        
        p {
            font-family: var(--contentfont) !important;
        }
    `;

    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(styleContent));
    document.head.appendChild(style);
})();
