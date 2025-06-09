//get current website url 
const currentUrl = window.location.href;

document.addEventListener("DOMContentLoaded", () => {
  const commandHistory = [];
  let historyIndex = -1;
  const input = document.getElementById("terminal-input");
  const output = document.getElementById("terminal-output");
  const saveButton = document.getElementById("save-command");
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  saveButton?.addEventListener("click", () => {
    alert('This form is a mockup — connect it to backend/plugin for saving.');
  });
  const pagesMap = {};

  async function fetchPages() {
    try {
      const response = await fetch(currentUrl + '/wp-json/wp/v2/pages?per_page=100');
      const pages = await response.json();
      pages.forEach(p => {
        const cmd = p.title.rendered.trim().toLowerCase().replace(/\s+/g, '-');
        pagesMap[cmd] = p.link;
      });
      return Object.keys(pagesMap).map(p => ` - ${p}`).join("<br>");
    } catch {
      return "Error loading pages.";
    }
  }

  let blogPage = 1;
  let blogTotalPages = 1;

  async function fetchPosts(page = 1) {
    try {
      const response = await fetch(`/wp-json/wp/v2/posts?per_page=5&page=${page}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const posts = await response.json();
      blogPage = page;
      blogTotalPages = parseInt(response.headers.get('X-WP-TotalPages')) || 1;

      return posts.map(p => ` - <a href="${p.link}" target="_blank">${p.title.rendered}</a>`).join("<br>") +
        `<br><br>Page ${blogPage} of ${blogTotalPages}<br>` +
        (blogPage > 1 ? `Type <code>blog prev</code> ` : '') +
        (blogPage < blogTotalPages ? `Type <code>blog next</code>` : '');
    } catch (err) {
      return "Error loading posts: " + err.message;
    }
  }

  let portfolioPage = 1;
  let portfolioTotalPages = 1;

  async function fetchPortfolio(page = 1) {
    try {
      const response = await fetch(`/wp-json/wp/v2/portfolio?per_page=5&page=${page}`);
      const items = await response.json();
      portfolioPage = page;
      portfolioTotalPages = parseInt(response.headers.get('X-WP-TotalPages')) || 1;

      return items.map(p => {
        const pfTitle = p.title?.rendered || "";
        const pfLink = p.link || "#";
        const pfDescription = p.excerpt?.rendered || "";
        return `<div class="portfolio-item">
          <a href="${pfLink}" target="_blank"><strong>${pfTitle}</strong></a><br>${pfDescription}
        </div>`;
      }).join("<br>") +
        `<br><br>Page ${portfolioPage} of ${portfolioTotalPages}<br>` +
        (portfolioPage > 1 ? `Type <code>portfolio prev</code> ` : '') +
        (portfolioPage < portfolioTotalPages ? `Type <code>portfolio next</code>` : '');
    } catch {
      return "Error loading portfolio.";
    }
  }

  async function fetchCategories() {
    try {
      const response = await fetch(currentUrl + '/wp-json/wp/v2/categories');
      const cats = await response.json();
      return cats.map(c => ` - <a href="/category/${c.slug}" target="_blank">${c.name}</a>`).join("<br>");

    } catch {
      return "Error loading categories.";
    }
  }

  // 🔄 Loading Animation
  let loadingInterval;
  function showLoading() {
    const loadingFrames = [".", ". .", ". . .", ". .", "."];
    let index = 0;
    const loadingSpan = document.createElement("span");
    loadingSpan.id = "loading";
    output.appendChild(loadingSpan);

    loadingInterval = setInterval(() => {
      loadingSpan.textContent = "Loading " + loadingFrames[index];
      index = (index + 1) % loadingFrames.length;
    }, 300);
  }

  function hideLoading() {
    clearInterval(loadingInterval);
    const loadingSpan = document.getElementById("loading");
    if (loadingSpan) loadingSpan.remove();
  }

  input?.addEventListener("keydown", async function (event) {
    if (event.key === "ArrowUp") {
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        historyIndex++;
        input.value = commandHistory[commandHistory.length - 1 - historyIndex];
      }
      return;
    }
    if (event.key === "ArrowDown") {
      if (historyIndex > 0) {
        historyIndex--;
        input.value = commandHistory[commandHistory.length - 1 - historyIndex];
      } else {
        historyIndex = -1;
        input.value = '';
      }
      return;
    }

    if (event.key === "Enter") {
      const commandRaw = input.value.trim();
      const command = commandRaw.toLowerCase();
      const normalizedCommand = command.replace(/\s+/g, '-');
      let response = "";

      showLoading();

      try {
        if (normalizedCommand === "help") {
          const pagesList = await fetchPages();
          response = `Available commands:<br> - help<br> - clear<br> - blog<br> - portfolio<br> - categories<br>${pagesList}`;
        } else if (normalizedCommand === "clear") {
          output.innerHTML = "";
          input.value = "";
          hideLoading();
          return;
        } else if (normalizedCommand === "blog") {
          response = await fetchPosts(1);
        } else if (normalizedCommand === "blog-next") {
          const nextPage = blogPage + 1;
          if (nextPage <= blogTotalPages) {
            response = await fetchPosts(nextPage);
          } else {
            response = "You're already on the last page.";
          }
        } else if (normalizedCommand === "blog-prev") {
          const prevPage = blogPage - 1;
          if (prevPage >= 1) {
            response = await fetchPosts(prevPage);
          } else {
            response = "You're already on the first page.";
          }
        } else if (normalizedCommand.startsWith("blog-page-")) {
          const pageNum = parseInt(normalizedCommand.replace("blog-page-", ""));
          if (!isNaN(pageNum)) {
            response = await fetchPosts(pageNum);
          } else {
            response = "Invalid blog page number.";
          }
        } else if (normalizedCommand === "portfolio") {
          response = await fetchPortfolio(1);
        } else if (normalizedCommand === "categories") {
          response = await fetchCategories();
        } else if (pagesMap[normalizedCommand]) {
          let pageHtml = "";
          try {
            pageHtml = await fetch(pagesMap[normalizedCommand]).then(res => res.text());
          } catch (e) {
            pageHtml = "<p>Error loading page.</p>";
          }
          let pageDoc = new DOMParser().parseFromString(pageHtml, "text/html");
          const content = pageDoc.querySelector(".entry-content, .wp-block-post-content")?.innerHTML || "<p>No content found.</p>";
          const title = pageDoc.querySelector("h1")?.textContent || command;
          response = `<strong>${title}</strong><br>${content}`;
        } else {
          response = `Command not found: ${commandRaw}`;
        }
      } catch (err) {
        response = "Error: " + err.message;
      }

      hideLoading();

      const fullResponse = `<br><strong>user@terminal:</strong>~$ ${commandRaw}<br>${response}`;
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = fullResponse;
      const children = Array.from(tempDiv.childNodes);
      let childIndex = 0;
      let charIndex = 0;

      function typeNode() {
        if (childIndex >= children.length) return;
        const child = children[childIndex];
        if (child.nodeType === 3) {
          const text = child.textContent;
          const textSpan = document.createElement("span");
          textSpan.textContent = "";
          output.appendChild(textSpan);

          function typeText() {
            if (charIndex < text.length) {
              textSpan.textContent += text.charAt(charIndex);
              charIndex++;
              setTimeout(typeText, 10);
            } else {
              charIndex = 0;
              childIndex++;
              typeNode();
            }
          }
          typeText();
        } else {
          output.appendChild(child.cloneNode(true));
          childIndex++;
          typeNode();
        }
      }

      typeNode();
      commandHistory.push(commandRaw);
      historyIndex = -1;
      input.value = "";
    }
  });

  fetchPages();
});

