"use strict";

function init() {
  var lab = document.querySelector(".error404-lab");
  if (!lab) return;

  var topologySvg = document.getElementById("topologySvg");
  var reconnectHint = document.getElementById("reconnectHint");
  var missingNodeLabel = document.getElementById("missingNodeLabel");
  var reconnectEdge = document.getElementById("edge-miss-home");
  var brokenEdge = document.getElementById("edge-gw-missing");
  var bgGrid = document.getElementById("bgGrid");

  var insightHeadlineEl = document.getElementById("insightHeadline");
  var insightCopyEl = document.getElementById("insightCopy");
  var insightLinkEl = document.getElementById("insightLink");
  var insightLinkText = document.getElementById("insightLinkText");
  var insightCounter = document.getElementById("insightCounter");
  var insightProgressBar = document.getElementById("insightProgressBar");

  var routePath = window.location.pathname || "/";
  var shortPath =
    routePath.length > 16 ? routePath.slice(0, 13) + "..." : routePath;
  var labelText = routePath === "/" || routePath === "" ? "404" : shortPath;

  if (missingNodeLabel) missingNodeLabel.textContent = labelText;

  var insights = [
    {
      headline: "No YAML. Just your mesh.",
      copy: "Drag, drop, and wire entire service topologies visually — Kanvas turns infra into something you can actually see.",
      href: "https://kanvas.new",
      cta: "Try Kanvas Designer",
    },
    {
      headline: "Your cluster, made visible.",
      copy: "Kanvas renders live Kubernetes topology in real-time, pulling state directly from your cluster.",
      href: "https://docs.kanvas.new",
      cta: "See how it works",
    },
    {
      headline: "Infra design is a team sport.",
      copy: "Multiple engineers can edit the same topology at the same time — like Figma, but for Kubernetes.",
      href: "https://kanvas.new",
      cta: "Explore collaboration",
    },
    {
      headline: "220+ integrations. One canvas.",
      copy: "Prometheus, Argo, Istio, Linkerd — if it runs in your cluster, Kanvas can map it.",
      href: "https://layer5.io/cloud-native-management/meshery/integrations",
      cta: "View integrations",
    },
    {
      headline: "Design is the source of truth.",
      copy: "Every change in Kanvas syncs directly to cluster state — your diagram is never out of date.",
      href: "https://docs.kanvas.new",
      cta: "Read the docs",
    },
    {
      headline: "CNCF-backed. Production-ready.",
      copy: "Kanvas is built on Meshery, the CNCF-hosted lifecycle manager trusted by thousands of engineers.",
      href: "https://layer5.io/cloud-native-management/kanvas",
      cta: "Learn about Meshery",
    },
    {
      headline: "Reuse. Don't reinvent.",
      copy: "Kanvas has a built-in catalog of battle-tested design patterns your whole team can fork and deploy.",
      href: "https://cloud.layer5.io/catalog",
      cta: "Open the catalog",
    },
    {
      headline: "Every drag is a GitOps event.",
      copy: "Topology changes in Kanvas Designer are git-trackable — full audit trail, zero extra tooling.",
      href: "https://docs.kanvas.new",
      cta: "Explore GitOps support",
    },
  ];

  var lastInsight = null;
  var insightIndex = 0;
  var typeTimer = null;
  var CYCLE_MS = 9000;

  function pickInsight() {
    if (insights.length <= 1) return insights[0];
    var item;
    do {
      item = insights[Math.floor(Math.random() * insights.length)];
    } while (item === lastInsight);
    return item;
  }

  function updateCounter(idx) {
    if (!insightCounter) return;
    var n = String(idx + 1).padStart(2, "0");
    var tot = String(insights.length).padStart(2, "0");
    insightCounter.textContent = n + " / " + tot;
    insightCounter.setAttribute(
      "aria-label",
      "Insight " + (idx + 1) + " of " + insights.length,
    );
  }

  function startProgress() {
    if (!insightProgressBar) return;
    insightProgressBar.style.transition = "none";
    insightProgressBar.style.width = "0%";
    insightProgressBar.offsetWidth;
    insightProgressBar.style.transition =
      "width " + CYCLE_MS / 1000 + "s linear";
    insightProgressBar.style.width = "100%";
  }

  function typeText(el, text, speed, onDone) {
    if (!el) {
      if (onDone) onDone();
      return;
    }
    clearTimeout(typeTimer);
    el.textContent = "";
    var i = 0;
    function tick() {
      if (i < text.length) {
        el.textContent += text[i++];
        typeTimer = setTimeout(tick, speed);
      } else if (onDone) {
        onDone();
      }
    }
    tick();
  }

  function setInsight(animate) {
    var next = pickInsight();
    lastInsight = next;
    insightIndex = insights.indexOf(next);

    if (!insightCopyEl || !insightLinkEl) return;

    if (insightLinkText) insightLinkText.textContent = next.cta;
    insightLinkEl.href = next.href;
    updateCounter(insightIndex);

    function show() {
      insightHeadlineEl && (insightHeadlineEl.style.opacity = "1");
      insightCopyEl && (insightCopyEl.style.opacity = "0");

      typeText(insightHeadlineEl, next.headline, 28, function () {
        setTimeout(function () {
          insightCopyEl.textContent = next.copy;
          insightCopyEl.style.opacity = "1";
          startProgress();
        }, 120);
      });
    }

    if (animate) {
      insightHeadlineEl && (insightHeadlineEl.style.opacity = "0");
      insightCopyEl && (insightCopyEl.style.opacity = "0");
      setTimeout(show, 200);
    } else {
      show();
    }
  }

  function runEntrance() {
    if (typeof gsap === "undefined") return;
    gsap
      .timeline({ defaults: { ease: "power2.out" } })
      .from(".error404-insight", {
        y: 24,
        opacity: 0,
        duration: 0.65,
        scale: 0.97,
      })
      .from(
        ".error404-topology-wrap",
        { y: 20, opacity: 0, duration: 0.55 },
        "-=0.22",
      )
      .from(".error404-actions", { opacity: 0, duration: 0.4 }, "-=0.15");
  }

  function onMouseParallax(e) {
    if (!bgGrid) return;
    var cx = window.innerWidth / 2;
    var cy = window.innerHeight / 2;
    var dx = (e.clientX - cx) / cx;
    var dy = (e.clientY - cy) / cy;
    bgGrid.style.transform =
      "translate(" + (dx * 9).toFixed(1) + "px, " + (dy * 7).toFixed(1) + "px)";
  }

  if (!topologySvg) {
    setInsight(false);
    setInterval(function () {
      setInsight(true);
    }, CYCLE_MS);
    runEntrance();
    document.addEventListener("mousemove", onMouseParallax);
    return;
  }

  var VBW = 860;
  var VBH = 320;

  var BASE = {
    ingress: { x: 70, y: 185, pinned: true },
    auth: { x: 210, y: 185 },
    gateway: { x: 370, y: 150 },
    catalog: { x: 370, y: 250 },
    policy: { x: 530, y: 120 },
    mesh: { x: 530, y: 205 },
    home: { x: 700, y: 185, pinned: true },
    missing: { x: 530, y: 58 },
  };

  var state = {};
  Object.keys(BASE).forEach(function (k) {
    var b = BASE[k];
    state[k] = {
      x: b.x,
      y: b.y,
      baseX: b.x,
      baseY: b.y,
      vx: 0,
      vy: 0,
      pinned: !!b.pinned,
    };
  });

  var nodeCircles = {};
  var nodeLabels = {};
  var nodeHomeG = document.getElementById("node-home");

  Object.keys(BASE).forEach(function (k) {
    var g = document.querySelector("#node-" + k);
    if (!g) return;
    nodeCircles[k] = g.querySelector("circle.node");
    nodeLabels[k] = g.querySelector("text");
    if (k === "missing") {
      nodeCircles["missing-ring"] = g.querySelector(".node-missing-ring");
    }
  });

  var edgeDefs = [
    ["edge-ing-auth", "ingress", "auth"],
    ["edge-auth-gw", "auth", "gateway"],
    ["edge-gw-pol", "gateway", "policy"],
    ["edge-pol-home", "policy", "home"],
    ["edge-auth-cat", "auth", "catalog"],
    ["edge-cat-mesh", "catalog", "mesh"],
    ["edge-mesh-home", "mesh", "home"],
    ["edge-gw-cat", "gateway", "catalog"],
    ["edge-gw-missing", "gateway", "missing"],
    ["edge-miss-home", "missing", "home"],
  ];

  var edgeEls = {};
  edgeDefs.forEach(function (d) {
    edgeEls[d[0]] = document.getElementById(d[0]);
  });

  var packetA = document.getElementById("packetA");
  var packetB = document.getElementById("packetB");
  var packetC = document.getElementById("packetC");
  var packetDrop = document.getElementById("packetDrop");

  var pointer = { x: -9999, y: -9999 };
  var dragging = null;
  var dragLastX = 0;
  var dragLastY = 0;
  var burst = 0;
  var raf = 0;
  var t = 0;
  var ticks = 0;
  var reconnected = false;

  function svgXY(e) {
    var rect = topologySvg.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (VBW / rect.width),
      y: (e.clientY - rect.top) * (VBH / rect.height),
    };
  }

  function stirTopology(power) {
    var p = power || 1;
    burst = Math.max(burst, 1.1 * p);
    Object.keys(BASE).forEach(function (k) {
      var n = state[k];
      if (n.pinned) return;
      n.vx += (Math.random() - 0.5) * 3.2 * p;
      n.vy += (Math.random() - 0.5) * 3.2 * p;
    });
  }

  function interpolate(keys, p) {
    var clamped = Math.max(0, Math.min(0.999, p));
    var seg = (keys.length - 1) * clamped;
    var i = Math.floor(seg);
    var f = seg - i;
    var a = state[keys[i]];
    var b = state[keys[i + 1]];
    return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
  }

  var pathA = ["ingress", "auth", "gateway", "policy", "home"];
  var pathB = ["auth", "catalog", "mesh", "home"];
  var pathC = ["gateway", "policy"];
  var pathRecon = ["ingress", "auth", "gateway", "missing", "home"];

  function paint() {
    edgeDefs.forEach(function (d) {
      var e = edgeEls[d[0]];
      if (!e) return;
      var a = state[d[1]];
      var b = state[d[2]];
      e.setAttribute("x1", a.x.toFixed(1));
      e.setAttribute("y1", a.y.toFixed(1));
      e.setAttribute("x2", b.x.toFixed(1));
      e.setAttribute("y2", b.y.toFixed(1));
    });

    Object.keys(BASE).forEach(function (k) {
      var n = state[k];
      var c = nodeCircles[k];
      var l = nodeLabels[k];
      var ring = k === "missing" ? nodeCircles["missing-ring"] : null;
      var above = k === "gateway" || k === "policy" || k === "missing";

      if (c) {
        c.setAttribute("cx", n.x.toFixed(1));
        c.setAttribute("cy", n.y.toFixed(1));
      }
      if (ring) {
        ring.setAttribute("cx", n.x.toFixed(1));
        ring.setAttribute("cy", n.y.toFixed(1));
      }
      if (l) {
        l.setAttribute("x", n.x.toFixed(1));
        l.setAttribute("y", (n.y + (above ? -25 : 27)).toFixed(1));
      }
    });
  }

  function reconnect() {
    reconnected = true;

    var m = state.missing;
    m.x = 570;
    m.y = 90;
    m.baseX = m.x;
    m.baseY = m.y;
    m.vx = 0;
    m.vy = 0;
    m.pinned = true;

    if (reconnectEdge) reconnectEdge.classList.remove("edge-hidden");
    if (brokenEdge) {
      brokenEdge.classList.remove("edge-broken");
      brokenEdge.classList.add("edge-active");
    }

    var mc = nodeCircles["missing"];
    if (mc) {
      mc.classList.remove("node-missing");
      mc.classList.add("node-hub");
    }

    var ring = nodeCircles["missing-ring"];
    if (ring) ring.style.display = "none";

    if (missingNodeLabel) {
      missingNodeLabel.classList.remove("node-label-missing");
      missingNodeLabel.textContent = labelText;
    }

    if (packetDrop) packetDrop.setAttribute("opacity", "0");

    lab.classList.add("is-reconnected");

    clearTimeout(typeTimer);
    if (insightHeadlineEl) insightHeadlineEl.textContent = "Route restored.";
    if (insightCopyEl) insightCopyEl.textContent = "Taking you home\u2026";
    if (insightLinkEl) insightLinkEl.style.display = "none";
    if (insightProgressBar) {
      insightProgressBar.style.transition = "none";
      insightProgressBar.style.width = "100%";
      insightProgressBar.style.background = "#00d3a9";
    }

    if (reconnectHint)
      reconnectHint.textContent = "Topology healed \u2014 redirecting\u2026";

    stirTopology(1.1);

    setTimeout(function () {
      window.location.href = "/";
    }, 1800);
  }

  function loop() {
    t += 0.0085;
    ticks += 1;
    if (ticks % 300 === 0) stirTopology(0.58);

    Object.keys(BASE).forEach(function (k) {
      var n = state[k];
      if (n.pinned || dragging === k) return;

      var dx = pointer.x - n.x;
      var dy = pointer.y - n.y;
      var d2 = dx * dx + dy * dy;
      if (d2 < 28000) {
        var f = (28000 - d2) / 28000;
        n.vx -= (dx / 1200) * f;
        n.vy -= (dy / 1200) * f;
      }

      n.vx += (n.baseX - n.x) * 0.007;
      n.vy += (n.baseY - n.y) * 0.007;

      if (burst > 0.001) {
        var bx = n.x - pointer.x;
        var by = n.y - pointer.y;
        var bl = Math.sqrt(bx * bx + by * by) || 1;
        n.vx += (bx / bl) * burst * 0.34;
        n.vy += (by / bl) * burst * 0.34;
      }

      n.vx *= 0.925;
      n.vy *= 0.925;
      n.x += n.vx;
      n.y += n.vy;
    });

    burst *= 0.88;
    paint();

    if (packetA) {
      var pA = interpolate(
        reconnected ? pathRecon : pathA,
        Math.sin(t * 1.9) * 0.5 + 0.5,
      );
      packetA.setAttribute("cx", pA.x.toFixed(1));
      packetA.setAttribute("cy", pA.y.toFixed(1));
      packetA.setAttribute("r", (3.6 + Math.sin(t * 7) * 1.1).toFixed(1));
    }

    if (packetB) {
      var pB = interpolate(pathB, Math.sin(t * 1.52 + 2.1) * 0.5 + 0.5);
      packetB.setAttribute("cx", pB.x.toFixed(1));
      packetB.setAttribute("cy", pB.y.toFixed(1));
      packetB.setAttribute("r", (3.1 + Math.cos(t * 6.1) * 0.9).toFixed(1));
    }

    if (packetC) {
      var pC = interpolate(pathC, Math.sin(t * 2.8 + 1.0) * 0.5 + 0.5);
      packetC.setAttribute("cx", pC.x.toFixed(1));
      packetC.setAttribute("cy", pC.y.toFixed(1));
    }

    if (packetDrop && !reconnected) {
      var cycle = (t * 0.52) % 1;
      var progress = cycle < 0.6 ? cycle / 0.6 : 1;
      var alpha = cycle < 0.5 ? 1 : Math.max(0, 1 - (cycle - 0.5) / 0.12);
      var gw = state.gateway;
      var ms = state.missing;
      packetDrop.setAttribute(
        "cx",
        (gw.x + (ms.x - gw.x) * progress).toFixed(1),
      );
      packetDrop.setAttribute(
        "cy",
        (gw.y + (ms.y - gw.y) * progress).toFixed(1),
      );
      packetDrop.setAttribute("opacity", alpha.toFixed(2));
    }

    raf = requestAnimationFrame(loop);
  }

  function onPointerMove(e) {
    var p = svgXY(e);
    pointer.x = p.x;
    pointer.y = p.y;

    if (dragging) {
      var n = state[dragging];
      var nx = Math.max(20, Math.min(840, p.x));
      var ny = Math.max(20, Math.min(300, p.y));
      n.vx = (nx - n.x) * 0.42;
      n.vy = (ny - n.y) * 0.42;
      n.x = nx;
      n.y = ny;
      dragLastX = nx;
      dragLastY = ny;
      topologySvg.style.cursor = "grabbing";

      if (dragging === "missing" && nodeHomeG) {
        var h = state.home;
        var ddx = n.x - h.x;
        var ddy = n.y - h.y;
        if (Math.sqrt(ddx * ddx + ddy * ddy) < 90) {
          nodeHomeG.classList.add("node-home-attract");
          if (reconnectHint)
            reconnectHint.textContent = "Release to reconnect!";
        } else {
          nodeHomeG.classList.remove("node-home-attract");
          if (reconnectHint) {
            reconnectHint.innerHTML =
              'Drag the <span class="hint-em">broken node</span> onto home to restore the route';
          }
        }
      }
    }
  }

  function onPointerLeave() {
    pointer.x = -9999;
    pointer.y = -9999;
  }

  function onPointerDown(e) {
    var p = svgXY(e);
    pointer.x = p.x;
    pointer.y = p.y;

    var keys = Object.keys(BASE);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var n = state[k];
      if (n.pinned) continue;
      var dx = n.x - p.x;
      var dy = n.y - p.y;
      if (Math.sqrt(dx * dx + dy * dy) < 22) {
        dragging = k;
        dragLastX = n.x;
        dragLastY = n.y;
        topologySvg.style.cursor = "grabbing";
        break;
      }
    }

    if (!dragging) stirTopology(1.0);
  }

  function onPointerUp() {
    if (!dragging) return;
    var n = state[dragging];
    n.vx += (n.x - dragLastX) * 0.06;
    n.vy += (n.y - dragLastY) * 0.06;

    if (dragging === "missing" && !reconnected) {
      var h = state.home;
      var dx = n.x - h.x;
      var dy = n.y - h.y;
      if (Math.sqrt(dx * dx + dy * dy) < 65) {
        reconnect();
      } else {
        if (nodeHomeG) nodeHomeG.classList.remove("node-home-attract");
        if (reconnectHint) {
          reconnectHint.innerHTML =
            'Drag the <span class="hint-em">broken node</span> onto home to restore the route';
        }
      }
    }

    dragging = null;
    topologySvg.style.cursor = "grab";
  }

  topologySvg.addEventListener("pointermove", onPointerMove);
  topologySvg.addEventListener("pointerleave", onPointerLeave);
  topologySvg.addEventListener("pointerdown", onPointerDown);
  topologySvg.addEventListener("pointerup", onPointerUp);
  document.addEventListener("mousemove", onMouseParallax);

  setInsight(false);
  setInterval(function () {
    setInsight(true);
  }, CYCLE_MS);
  runEntrance();
  paint();
  loop();

  window.addEventListener("pagehide", function () {
    if (raf) {
      cancelAnimationFrame(raf);
    }
    document.removeEventListener("mousemove", onMouseParallax);
  });
}

init();
