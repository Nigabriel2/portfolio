// ============================================================
// gabriel@portfolio — shared behaviour across all pages
// ============================================================
(function(){

  /* ---- mobile nav toggle ---- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if(toggle && links){
    var closeMenu = function(){
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    toggle.addEventListener('click', function(){
      var isOpen = links.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && links.classList.contains('open')){
        closeMenu();
        toggle.focus();
      }
    });
  }

  /* ---- active nav link: match current file name ---- */
  var here = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('[data-nav]').forEach(function(a){
    if(a.getAttribute('href') === here){
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });

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

  /* ---- proficiency bar fill (skills.html) ---- */
  var bars = document.querySelectorAll('.bar-fill');
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
        status.textContent = 'Please fill in all fields.';
        status.classList.remove('ok');
        return;
      }
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        status.textContent = 'Please enter a valid email address.';
        status.classList.remove('ok');
        return;
      }
      var subject = encodeURIComponent('Portfolio contact from ' + name);
      var body = encodeURIComponent(msg + '\n\n— ' + name + ' (' + email + ')');
      status.textContent = 'Opening your mail client…';
      status.classList.add('ok');
      window.location.href = 'mailto:niyomugabogabriel0@gmail.com?subject=' + subject + '&body=' + body;
    });
  }

  /* ---- footer year ---- */
  document.querySelectorAll('[data-year]').forEach(function(el){
    el.textContent = new Date().getFullYear();
  });

})();
