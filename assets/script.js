// ============================================================
// gabriel@portfolio — shared behaviour across all pages
// ============================================================
(function(){

  /* ---- page load bar + fade-in ---- */
  var bar = document.createElement('div');
  bar.className = 'load-bar';
  document.body.appendChild(bar);
  requestAnimationFrame(function(){ bar.style.width = '72%'; });
  window.addEventListener('load', function(){
    bar.style.width = '100%';
    setTimeout(function(){ bar.classList.add('done'); }, 150);
    document.body.classList.add('ready');
  });
  // fallback in case load already fired
  if(document.readyState === 'complete'){
    document.body.classList.add('ready');
  }

  /* ---- mobile nav toggle ---- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if(toggle && links){
    toggle.addEventListener('click', function(){
      var isOpen = links.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && links.classList.contains('open')){
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ---- active nav link: match current file name ---- */
  var here = (location.pathname.split('/').pop() || 'index.html');
  if(here === '') here = 'index.html';
  document.querySelectorAll('[data-nav]').forEach(function(a){
    var target = a.getAttribute('href');
    if(target === here || (here === 'index.html' && target === './index.html')){
      a.classList.add('active');
    }
  });

  /* ---- in-page scroll-spy (only relevant on index.html which has #anchors) ---- */
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll('[data-nav][href^="#"]'));
  if(navAnchors.length){
    var sections = navAnchors.map(function(a){ return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
    var setActive = function(){
      var pos = window.scrollY + 90;
      var current = sections[0];
      sections.forEach(function(sec){ if(sec.offsetTop <= pos){ current = sec; } });
      if(!current) return;
      navAnchors.forEach(function(a){
        a.classList.toggle('active', a.getAttribute('href') === '#' + current.id);
      });
    };
    document.addEventListener('scroll', setActive, { passive:true });
    window.addEventListener('load', setActive);
  }

  /* ---- scroll reveal via IntersectionObserver ---- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if('IntersectionObserver' in window && revealEls.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold:0.15, rootMargin:'0px 0px -40px 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in-view'); });
  }

  /* ---- skill bar fill (skills.html) ---- */
  var bars = document.querySelectorAll('.skill-bar-fill');
  if('IntersectionObserver' in window && bars.length){
    var barIo = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          var el = entry.target;
          var val = el.getAttribute('data-value') || '0';
          requestAnimationFrame(function(){ el.style.width = val + '%'; });
          barIo.unobserve(el);
        }
      });
    }, { threshold:0.4 });
    bars.forEach(function(el){ barIo.observe(el); });
  } else {
    bars.forEach(function(el){ el.style.width = (el.getAttribute('data-value')||'0') + '%'; });
  }

  /* ---- back-to-top button ---- */
  var toTop = document.createElement('button');
  toTop.className = 'to-top';
  toTop.setAttribute('aria-label','Back to top');
  toTop.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(toTop);
  toTop.addEventListener('click', function(){
    window.scrollTo({ top:0, behavior:'smooth' });
  });
  window.addEventListener('scroll', function(){
    toTop.classList.toggle('show', window.scrollY > 480);
  }, { passive:true });

  /* ---- contact form (contact.html) — client-side only, no backend ---- */
  var form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var status = document.getElementById('formStatus');
      var name = form.querySelector('#cf-name').value.trim();
      var email = form.querySelector('#cf-email').value.trim();
      var msg = form.querySelector('#cf-message').value.trim();
      if(!name || !email || !msg){
        status.textContent = '// error: all fields are required.';
        status.classList.remove('ok');
        return;
      }
      var subject = encodeURIComponent('Portfolio contact from ' + name);
      var body = encodeURIComponent(msg + '\n\n— ' + name + ' (' + email + ')');
      status.textContent = '// opening mail client…';
      status.classList.add('ok');
      window.location.href = 'mailto:niyomugabogabriel0@gmail.com?subject=' + subject + '&body=' + body;
    });
  }

  /* ---- footer year ---- */
  document.querySelectorAll('[data-year]').forEach(function(el){
    el.textContent = new Date().getFullYear();
  });

})();
