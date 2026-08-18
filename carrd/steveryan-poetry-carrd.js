(() => {
  const supabaseUrl = "https://dmivbuwrdmfeiqtfkyby.supabase.co";
  const publishableKey = "sb_publishable_aLNqJS6nDZjWdAwClv69MQ_RFF11x54";
  const defaults = {
    formSubmitEndpoint: "https://formsubmit.co/ajax/info@steveryan.com",
    appsScriptWebhook: "https://script.google.com/macros/s/AKfycbzbihllSEYI7ubFqnMB7OQLmJZKfpEwSNdk8fpNcwFkhfpl4owKCMLmutb-RwsOQUmp/exec",
  };
  const safeUrl = (value) => { try { return new URL(value).protocol === "https:"; } catch { return false; } };
  const setText = (node, value) => { if (node && typeof value === "string") node.textContent = value; };
  const setLines = (node, value) => {
    if (!node || typeof value !== "string") return;
    node.replaceChildren();
    value.split("\n").forEach((line, index) => {
      if (index) node.append(document.createElement("br"));
      node.append(document.createTextNode(line));
    });
  };
  const setLink = (node, value) => { if (node && safeUrl(value)) node.href = value; };
  const setImage = (node, value) => { if (node && safeUrl(value)) node.src = value; };

  const applyHero = (root, section) => {
    const hero = root?.querySelector(".sr-inner-hero");
    if (!hero || !section) return;
    setText(hero.querySelector(".sr-eyebrow"), section.label);
    setText(hero.querySelector("h1"), section.title);
    setText(hero.querySelector("p:not(.sr-eyebrow)"), section.body);
  };
  const videoCard = (template, video) => {
    const card = template.cloneNode(true);
    const media = card.querySelector(".sr-video-media");
    setLink(media, video.link_url);
    setImage(media?.querySelector("img"), video.media_url);
    setText(card.querySelector("h3"), video.title);
    setText(card.querySelector("p"), video.label);
    return card;
  };
  const renderVideos = (root, selector, videos) => {
    const container = root?.querySelector(selector);
    const template = container?.querySelector(".sr-video");
    if (!container || !template || !videos.length) return;
    const fragment = document.createDocumentFragment();
    videos.forEach((video) => fragment.append(videoCard(template, video)));
    container.replaceChildren(fragment);
  };
  const renderPoems = (root, poems) => {
    if (!root || !poems.length) return;
    const [featured, ...remaining] = poems;
    const feature = root.querySelector(".sr-poem-feature");
    setText(feature?.querySelector("h2"), featured.title);
    setLines(feature?.querySelector(".sr-poem-lines"), featured.body);
    const list = root.querySelector(".sr-poems-list");
    const template = list?.querySelector(".sr-poem-detail");
    if (!list || !template) return;
    setText(root.querySelector(".sr-poems-list-head span"), `${String(remaining.length).padStart(2, "0")} poems`);
    const fragment = document.createDocumentFragment();
    remaining.forEach((poem, index) => {
      const detail = template.cloneNode(true);
      setText(detail.querySelector("summary span"), String(index + 2).padStart(2, "0"));
      setText(detail.querySelector("summary small"), poem.label);
      setText(detail.querySelector("summary strong"), poem.title);
      setLines(detail.querySelector(".sr-poem-lines"), poem.body);
      fragment.append(detail);
    });
    list.querySelectorAll(".sr-poem-detail").forEach((detail) => detail.remove());
    list.append(fragment);
  };
  const applyContent = (items) => {
    const sections = Object.fromEntries(items.filter((item) => item.content_type === "section").map((item) => [item.slug, item]));
    const poems = items.filter((item) => item.content_type === "poem");
    const videos = items.filter((item) => item.content_type === "video");
    const home = document.getElementById("sr-carrd-home");
    const homeHero = sections["home-hero"];
    if (home && homeHero) {
      const copy = home.querySelector(".sr-home-copy");
      setText(copy?.querySelector(".sr-eyebrow"), homeHero.label);
      setText(copy?.querySelector("h1"), homeHero.title);
      const paragraphs = copy ? [...copy.querySelectorAll(":scope > p")] : [];
      homeHero.body?.split("\n\n").forEach((paragraph, index) => setText(paragraphs[index], paragraph));
    }
    const book = sections["featured-book"];
    document.querySelectorAll(".sr-book").forEach((card) => {
      if (!book) return;
      setText(card.querySelector(".sr-label span"), book.label);
      setText(card.querySelector("h2"), book.title);
      setText(card.querySelector("p"), book.body);
      setImage(card.querySelector("img"), book.media_url);
      setLink(card.querySelector(".sr-button"), book.link_url);
    });
    if (poems.length) {
      const feature = home?.querySelector(".sr-feature-poem");
      setText(feature?.querySelector(".sr-label span"), poems[0].label);
      setText(feature?.querySelector("h2"), poems[0].title);
      setLines(feature?.querySelector(".sr-poem-lines"), poems[0].body);
    }
    renderVideos(home, ".sr-feature-videos-row", videos);
    renderVideos(document.getElementById("sr-carrd-videos"), ".sr-videos-grid", videos);
    applyHero(document.getElementById("sr-carrd-poems"), sections["poems-hero"]);
    applyHero(document.getElementById("sr-carrd-videos"), sections["videos-hero"]);
    applyHero(document.getElementById("sr-carrd-about"), sections["about-hero"]);
    applyHero(document.getElementById("sr-carrd-contact"), sections["contact-hero"]);
    renderPoems(document.getElementById("sr-carrd-poems"), poems);
    const about = sections["about-hero"];
    if (about) {
      document.querySelectorAll("#sr-carrd-about .sr-about-photo img").forEach((image) => setImage(image, about.media_url));
      document.querySelectorAll("#sr-carrd-about .sr-button").forEach((link) => setLink(link, about.link_url));
    }
  };
  const bind = (settings) => {
    const embeds = [...document.querySelectorAll(".sr-embed")];
    const home = document.getElementById("sr-carrd-home");
    if (home) document.querySelectorAll(".sr-embed:not(#sr-carrd-home) .sr-header").forEach((header) => (header.style.display = "none"));
    document.querySelectorAll("[data-sr-menu]").forEach((button) => {
      if (button.dataset.srMenu) return;
      button.dataset.srMenu = "1";
      button.addEventListener("click", () => button.closest(".sr-embed")?.classList.toggle("sr-menu-open"));
    });
    document.querySelectorAll("[data-sr-route]").forEach((link) => {
      if (link.dataset.srRoute) return;
      link.dataset.srRoute = "1";
      link.addEventListener("click", () => embeds.forEach((embed) => embed.classList.remove("sr-menu-open")));
    });
    document.querySelectorAll("[data-sr-form]").forEach((form) => {
      if (form.dataset.srBound) return;
      form.dataset.srBound = "1";
      const submit = form.querySelector("[data-sr-submit]");
      let status = form.querySelector("[data-sr-status]");
      if (!submit) return;
      if (!status) {
        status = document.createElement("small");
        status.dataset.srStatus = "";
        status.setAttribute("aria-live", "polite");
        status.style.cssText = "display:block;min-height:1.35em;margin-top:10px;color:#711c24;font:500 12px/1.35 Arial,sans-serif;letter-spacing:.01em";
        form.append(status);
      }
      submit.addEventListener("click", () => {
        const values = {};
        let valid = true;
        form.querySelectorAll("[data-sr-field]").forEach((field) => {
          if (!field.checkValidity()) { valid = false; field.reportValidity(); }
          values[field.dataset.srField] = field.value.trim();
        });
        if (!valid) return;
        const contact = form.dataset.srForm === "contact";
        const originalLabel = submit.innerHTML;
        submit.disabled = true;
        submit.innerHTML = "SENDING…";
        form.setAttribute("aria-busy", "true");
        if (status) { status.textContent = "Sending securely…"; status.dataset.state = "sending"; }
        const payload = { ...values, _subject: `Steve Ryan Poetry — new ${contact ? "contact message" : "newsletter signup"}`, _captcha: "false", source_page: form.dataset.srSource || "Steve Ryan Poetry" };
        const lead = { name: values.name || "", email: values.email || "", message: values.message || "", source_page: payload.source_page };
        Promise.all([
          fetch(settings.formSubmitEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) }).then((response) => { if (!response.ok) throw new Error("FormSubmit request failed"); }),
          fetch(settings.appsScriptWebhook, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=UTF-8" }, body: JSON.stringify(lead) }),
        ]).then(() => {
          form.querySelectorAll("[data-sr-field]").forEach((field) => (field.value = ""));
          if (status) { status.textContent = contact ? "Thank you — your message was sent." : "Thank you — you’re signed up."; status.dataset.state = "success"; }
        }).catch(() => {
          if (status) { status.textContent = "We could not send this yet. Please try again."; status.dataset.state = "error"; }
        }).finally(() => {
          submit.disabled = false;
          submit.innerHTML = originalLabel;
          form.removeAttribute("aria-busy");
        });
      });
    });
  };
  const load = async () => {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/content_items?select=content_type,slug,title,label,body,media_url,link_url,sort_order&published=eq.true&order=sort_order.asc`, { headers: { apikey: publishableKey, Authorization: `Bearer ${publishableKey}` } });
      if (!response.ok) throw new Error("Supabase request failed");
      const items = await response.json();
      applyContent(items);
      const settings = { ...defaults };
      items.filter((item) => item.content_type === "setting").forEach((item) => {
        if (item.slug === "contact-formsubmit" && safeUrl(item.link_url)) settings.formSubmitEndpoint = item.link_url.replace("https://formsubmit.co/", "https://formsubmit.co/ajax/");
        if (item.slug === "contact-webhook" && safeUrl(item.link_url)) settings.appsScriptWebhook = item.link_url;
      });
      return settings;
    } catch { return defaults; }
  };
  const start = async () => bind(await load());
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", start) : start();
})();
