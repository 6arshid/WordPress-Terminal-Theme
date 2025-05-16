

(async () => {

document.addEventListener("DOMContentLoaded", () => {
  const commandHistory = [];
  let historyIndex = -1;
  const input = document.getElementById("terminal-input");
  const output = document.querySelector(".terminal-output");
  const pagesMap = {};

  async function fetchPages() {
    try {
      const response = await fetch(currentUrl+'/wp-json/wp/v2/pages?per_page=100');
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
      
const posts = await response.json();
blogPage = page;
blogTotalPages = parseInt(response.headers.get('X-WP-TotalPages')) || 1;

      
return posts.map(p => ` - <a href="${p.link}" target="_blank">${p.title.rendered}</a>`).join("<br>") +
`<br><br>Page ${blogPage} of ${blogTotalPages}<br>` +
(blogPage > 1 ? `Type <code>blog prev</code> ` : '') +
(blogPage < blogTotalPages ? `Type <code>blog next</code>` : '');

    } catch {
      return "Error loading posts.";
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

    const output = items.map(p => {
      const pfTitle = p.title?.rendered || "";
      const pfLink = p.link || "#";
      const pfDescription = p.excerpt?.rendered || "";
      return `<div style='margin-bottom:1rem;'>
        <a href="${pfLink}" target="_blank"><strong>${pfTitle}</strong></a><br>${pfDescription}
      </div>`;
    }).join("<br>");

    return output +
      `<br><br>Page ${portfolioPage} of ${portfolioTotalPages}<br>` +
      (portfolioPage > 1 ? `Type <code>portfolio prev</code> ` : '') +
      (portfolioPage < portfolioTotalPages ? `Type <code>portfolio next</code>` : '');
  } catch (error) {
    return "Error loading portfolio.";
  }
}

</div>`;
}).join("<br>") +
`<br><br>Page ${portfolioPage} of ${portfolioTotalPages}<br>` +
(portfolioPage > 1 ? `Type <code>portfolio prev</code> ` : '') +
(portfolioPage < portfolioTotalPages ? `Type <code>portfolio next</code>` : '');

      <a href="${portfolioLink}" target="_blank"><strong>${title}</strong></a><br>${description}
    </div>`;
    
      }).join("<br>");
    } catch {
      return "Error loading portfolio.";
    }
  }

  async function fetchCategories() {
    try {
      const response = await fetch(currentUrl+'/wp-json/wp/v2/categories');
      const cats = await response.json();
      return cats.map(c => ` - ${c.name}`).join("<br>");
    } catch {
      return "Error loading categories.";
    }
  }

  input?.addEventListener("keydown", async function(event) {
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
      const command = commandRaw.toLowerCase().replace(/\s+/g, '-');
      let response = "";

      if (command === "help") {
        const pagesList = await fetchPages();
        response = `Available commands:<br> - help<br> - clear<br> - blog<br> - portfolio<br> - categories<br>${pagesList}`;
      } else if (command === "clear") {
        output.innerHTML = "";
        commandHistory.push(commandRaw);
historyIndex = -1;
input.value = "";
        return;
      } 

} else if (command === "blog") {
  response = await fetchPosts(1);
} else if (command === "blog next") {
  const nextPage = blogPage + 1;
  if (nextPage <= blogTotalPages) {
    response = await fetchPosts(nextPage);
  } else {
    response = "You're already on the last page.";
  }
} else if (command === "blog prev") {
  const prevPage = blogPage - 1;
  if (prevPage >= 1) {
    response = await fetchPosts(prevPage);
  } else {
    response = "You're already on the first page.";
  }
} else if (command.startsWith("blog page ")) {
  const pageNum = parseInt(command.replace("blog page ", ""));
  if (!isNaN(pageNum)) {
    response = await fetchPosts(pageNum);
  } else {
    response = "Invalid blog page number.";
  }
} else if (command.startsWith("blog search ")) {
  const keyword = commandRaw.replace("blog search ", "");
  const res = await fetch(`/wp-json/wp/v2/posts?per_page=5&search=${encodeURIComponent(keyword)}`);
  const posts = await res.json();
  response = posts.length > 0 ? posts.map(p => ` - <a href="${p.link}" target="_blank">${p.title.rendered}</a>`).join("<br>") : "No results found.";
} else if (command === "portfolio") {
  response = await fetchPortfolio(1);
} else if (command === "portfolio next") {
  const nextPage = portfolioPage + 1;
  if (nextPage <= portfolioTotalPages) {
    response = await fetchPortfolio(nextPage);
  } else {
    response = "You're already on the last portfolio page.";
  }
} else if (command === "portfolio prev") {
  const prevPage = portfolioPage - 1;
  if (prevPage >= 1) {
    response = await fetchPortfolio(prevPage);
  } else {
    response = "You're already on the first portfolio page.";
  }
} else if (command.startsWith("portfolio page ")) {
  const pageNum = parseInt(command.replace("portfolio page ", ""));
  if (!isNaN(pageNum)) {
    response = await fetchPortfolio(pageNum);
  } else {
    response = "Invalid portfolio page number.";
  }

  response = await fetchPosts(1);
} else if (command === "blog next") {
  const nextPage = blogPage + 1;
  response = await fetchPosts(nextPage);
} else if (command === "blog prev") {
  const prevPage = blogPage - 1;
  if (prevPage >= 1) {
    response = await fetchPosts(prevPage);
  } else {
    response = "You're already on the first page.";
  }
} else if (command.startsWith("blog page ")) {
  const pageNum = parseInt(command.replace("blog page ", ""));
  if (!isNaN(pageNum)) {
    response = await fetchPosts(pageNum);
  } else {
    response = "Invalid blog page number.";
  }

        response = await fetchPosts();
      } else if (command === "portfolio") {
        response = await fetchPortfolio();
      } 
    else if (command === "resume") {
      response = `<a href='/wp-content/uploads/resume.pdf' target='_blank'>Download Resume</a>`;
    } else if (command === "categories") {
    
        response = await fetchCategories();
      } else if (pagesMap[command]) {
        
    let pageHtml = ""; try { pageHtml = await fetch(pagesMap[command]).then(res => res.text()); } catch (e) { pageHtml = "<p>Error loading page.</p>"; }
      .then(res => res.text())
      .catch(() => "<p>Error loading page.</p>");

    let pageDoc = new DOMParser().parseFromString(pageHtml, "text/html");
    const content = pageDoc.querySelector(".entry-content, .wp-block-post-content")?.innerHTML || "<p>No content found.</p>";
    const title = pageDoc.querySelector("h1")?.textContent || command;
    response = `<strong>${title}</strong><br>${content}`;
    
      } else if (command.startsWith("go ")) {
        const dest = command.slice(3);
        if (pagesMap[dest]) {
          window.location.href = pagesMap[dest];
          return;
        } else {
          response = `No page found for: ${dest}`;
        }
      } else {
        response = `Command not found: ${commandRaw}`;
      }

      
const fullResponse = `<br><strong>user@terminal:</strong>~$ ${commandRaw}<br>${response}`;
const tempDiv = document.createElement("div");
tempDiv.innerHTML = fullResponse;
const children = Array.from(tempDiv.childNodes);
let childIndex = 0;
let charIndex = 0;

function typeNode() {
  if (childIndex >= children.length) return;

  const child = children[childIndex];
  let span = document.createElement("span");
  if (child.nodeType === 3) {
    // Text node
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
    // Element node
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

})();




    document.addEventListener("DOMContentLoaded", () => {
      const input = document.getElementById("terminal-input");
      const output = document.querySelector(".terminal-output");

      const pagesMap = {};

      async function fetchPages() {
        try {
          const response = await fetch(currentUrl+'/wp-json/wp/v2/pages?per_page=100');
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

      async function fetchPosts() {
        try {
          const response = await fetch(currentUrl+'/wp-json/wp/v2/posts?per_page=5');
          const posts = await response.json();
          return posts.map(p => ` - <a href="${p.link}" target="_blank">${p.title.rendered}</a>`).join("<br>");
        } catch {
          return "Error loading posts.";
        }
      }

      async function fetchPortfolio() {
        try {
          const response = await fetch(currentUrl+'/wp-json/wp/v2/portfolio?per_page=5');
          const items = await response.json();
          return items.map(p => {
            const title = p.title.rendered;
            const link = p.link;
            const excerpt = p.excerpt?.rendered || "";
            return ` - <a href="${link}" target="_blank">${title}</a><br>${excerpt}`;
          }).join("<br>");
        } catch {
          return "Error loading portfolio.";
        }
      }

      input.addEventListener("keydown", async function(event) {
        if (event.key === "Enter") {
          const commandRaw = input.value.trim();
          const command = commandRaw.toLowerCase().replace(/\s+/g, '-');
          let response = "";

          if (command === "help") {
            const pagesList = await fetchPages();
            response = `Available commands:<br> - help<br> - clear<br> - blog<br> - portfolio<br> - categories<br>${pagesList}<br> - blog<br> - portfolio<br> - clear`;
          } else if (command === "clear") {
            output.innerHTML = "";
            input.value = "";
            return;
          } else if (command === "blog") {
            response = await fetchPosts();
          } else if (command === "portfolio") {
            response = await fetchPortfolio();
          } else if (pagesMap[command]) {
            response = `Open page: <a href="${pagesMap[command]}" target="_blank">${command}</a>`;
          } else if (command.startsWith("go ")) {
            const dest = command.slice(3);
            if (pagesMap[dest]) {
              window.location.href = pagesMap[dest];
              return;
            } else {
              response = `No page found for: ${dest}`;
            }
          } else {
            response = `Command not found: ${commandRaw}`;
          }

          output.innerHTML += `<br><strong>user@terminal:</strong>~$ ${commandRaw}<br>${response}`;
          input.value = "";
        }
      });

      fetchPages();
    });
  
      async function fetchCategories() {
        try {
          const response = await fetch(currentUrl+'/wp-json/wp/v2/categories');
          const cats = await response.json();
          return cats.map(c => ` - ${c.name}`).join("<br>");
        } catch {
          return "Error loading categories.";
        }
      }

      // Add handler
      if (command === "categories") {
        response = await fetchCategories();
      } else


document.write(new Date().getFullYear())



(async () => {

document.addEventListener("DOMContentLoaded", () => {
  const commandHistory = [];
  let historyIndex = -1;
  const input = document.getElementById("terminal-input");
  const output = document.querySelector(".terminal-output");
  const pagesMap = {};

  async function fetchPages() {
    try {
      const response = await fetch(currentUrl+'/wp-json/wp/v2/pages?per_page=100');
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
      
const posts = await response.json();
blogPage = page;
blogTotalPages = parseInt(response.headers.get('X-WP-TotalPages')) || 1;

      
return posts.map(p => ` - <a href="${p.link}" target="_blank">${p.title.rendered}</a>`).join("<br>") +
`<br><br>Page ${blogPage} of ${blogTotalPages}<br>` +
(blogPage > 1 ? `Type <code>blog prev</code> ` : '') +
(blogPage < blogTotalPages ? `Type <code>blog next</code>` : '');

    } catch {
      return "Error loading posts.";
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

    const output = items.map(p => {
      const pfTitle = p.title?.rendered || "";
      const pfLink = p.link || "#";
      const pfDescription = p.excerpt?.rendered || "";
      return `<div style='margin-bottom:1rem;'>
        <a href="${pfLink}" target="_blank"><strong>${pfTitle}</strong></a><br>${pfDescription}
      </div>`;
    }).join("<br>");

    return output +
      `<br><br>Page ${portfolioPage} of ${portfolioTotalPages}<br>` +
      (portfolioPage > 1 ? `Type <code>portfolio prev</code> ` : '') +
      (portfolioPage < portfolioTotalPages ? `Type <code>portfolio next</code>` : '');
  } catch (error) {
    return "Error loading portfolio.";
  }
}

</div>`;
}).join("<br>") +
`<br><br>Page ${portfolioPage} of ${portfolioTotalPages}<br>` +
(portfolioPage > 1 ? `Type <code>portfolio prev</code> ` : '') +
(portfolioPage < portfolioTotalPages ? `Type <code>portfolio next</code>` : '');

      <a href="${portfolioLink}" target="_blank"><strong>${title}</strong></a><br>${description}
    </div>`;
    
      }).join("<br>");
    } catch {
      return "Error loading portfolio.";
    }
  }

  async function fetchCategories() {
    try {
      const response = await fetch(currentUrl+'/wp-json/wp/v2/categories');
      const cats = await response.json();
      return cats.map(c => ` - ${c.name}`).join("<br>");
    } catch {
      return "Error loading categories.";
    }
  }

  input?.addEventListener("keydown", async function(event) {
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
      const command = commandRaw.toLowerCase().replace(/\s+/g, '-');
      let response = "";

      if (command === "help") {
        const pagesList = await fetchPages();
        response = `Available commands:<br> - help<br> - clear<br> - blog<br> - portfolio<br> - categories<br>${pagesList}`;
      } else if (command === "clear") {
        output.innerHTML = "";
        commandHistory.push(commandRaw);
historyIndex = -1;
input.value = "";
        return;
      } 

} else if (command === "blog") {
  response = await fetchPosts(1);
} else if (command === "blog next") {
  const nextPage = blogPage + 1;
  if (nextPage <= blogTotalPages) {
    response = await fetchPosts(nextPage);
  } else {
    response = "You're already on the last page.";
  }
} else if (command === "blog prev") {
  const prevPage = blogPage - 1;
  if (prevPage >= 1) {
    response = await fetchPosts(prevPage);
  } else {
    response = "You're already on the first page.";
  }
} else if (command.startsWith("blog page ")) {
  const pageNum = parseInt(command.replace("blog page ", ""));
  if (!isNaN(pageNum)) {
    response = await fetchPosts(pageNum);
  } else {
    response = "Invalid blog page number.";
  }
} else if (command.startsWith("blog search ")) {
  const keyword = commandRaw.replace("blog search ", "");
  const res = await fetch(`/wp-json/wp/v2/posts?per_page=5&search=${encodeURIComponent(keyword)}`);
  const posts = await res.json();
  response = posts.length > 0 ? posts.map(p => ` - <a href="${p.link}" target="_blank">${p.title.rendered}</a>`).join("<br>") : "No results found.";
} else if (command === "portfolio") {
  response = await fetchPortfolio(1);
} else if (command === "portfolio next") {
  const nextPage = portfolioPage + 1;
  if (nextPage <= portfolioTotalPages) {
    response = await fetchPortfolio(nextPage);
  } else {
    response = "You're already on the last portfolio page.";
  }
} else if (command === "portfolio prev") {
  const prevPage = portfolioPage - 1;
  if (prevPage >= 1) {
    response = await fetchPortfolio(prevPage);
  } else {
    response = "You're already on the first portfolio page.";
  }
} else if (command.startsWith("portfolio page ")) {
  const pageNum = parseInt(command.replace("portfolio page ", ""));
  if (!isNaN(pageNum)) {
    response = await fetchPortfolio(pageNum);
  } else {
    response = "Invalid portfolio page number.";
  }

  response = await fetchPosts(1);
} else if (command === "blog next") {
  const nextPage = blogPage + 1;
  response = await fetchPosts(nextPage);
} else if (command === "blog prev") {
  const prevPage = blogPage - 1;
  if (prevPage >= 1) {
    response = await fetchPosts(prevPage);
  } else {
    response = "You're already on the first page.";
  }
} else if (command.startsWith("blog page ")) {
  const pageNum = parseInt(command.replace("blog page ", ""));
  if (!isNaN(pageNum)) {
    response = await fetchPosts(pageNum);
  } else {
    response = "Invalid blog page number.";
  }

        response = await fetchPosts();
      } else if (command === "portfolio") {
        response = await fetchPortfolio();
      } 
    else if (command === "resume") {
      response = `<a href='/wp-content/uploads/resume.pdf' target='_blank'>Download Resume</a>`;
    } else if (command === "categories") {
    
        response = await fetchCategories();
      } else if (pagesMap[command]) {
        
    let pageHtml = ""; try { pageHtml = await fetch(pagesMap[command]).then(res => res.text()); } catch (e) { pageHtml = "<p>Error loading page.</p>"; }
      .then(res => res.text())
      .catch(() => "<p>Error loading page.</p>");

    let pageDoc = new DOMParser().parseFromString(pageHtml, "text/html");
    const content = pageDoc.querySelector(".entry-content, .wp-block-post-content")?.innerHTML || "<p>No content found.</p>";
    const title = pageDoc.querySelector("h1")?.textContent || command;
    response = `<strong>${title}</strong><br>${content}`;
    
      } else if (command.startsWith("go ")) {
        const dest = command.slice(3);
        if (pagesMap[dest]) {
          window.location.href = pagesMap[dest];
          return;
        } else {
          response = `No page found for: ${dest}`;
        }
      } else {
        response = `Command not found: ${commandRaw}`;
      }

      
const fullResponse = `<br><strong>user@terminal:</strong>~$ ${commandRaw}<br>${response}`;
const tempDiv = document.createElement("div");
tempDiv.innerHTML = fullResponse;
const children = Array.from(tempDiv.childNodes);
let childIndex = 0;
let charIndex = 0;

function typeNode() {
  if (childIndex >= children.length) return;

  const child = children[childIndex];
  let span = document.createElement("span");
  if (child.nodeType === 3) {
    // Text node
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
    // Element node
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

})();

