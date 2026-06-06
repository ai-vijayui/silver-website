/**
 * Silver Group — Main JavaScript
 * Nav scroll, mobile menu, scroll animations, form handling
 */

(function () {
  'use strict';

  const navbar = document.querySelector('.navbar, .hero-nav');
  const toggle = document.querySelector('.navbar__toggle, .hero-nav__toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link, .mobile-menu .btn');

  /* Fixed header: solid background after leaving top of page */
  function handleNavScroll() {
    if (!navbar) return;
    const scrollThreshold = 40;
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* Mobile menu */
  function openMenu() {
    toggle?.classList.add('is-open');
    mobileMenu?.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    toggle?.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    toggle?.classList.remove('is-open');
    mobileMenu?.classList.remove('is-open');
    document.body.style.overflow = '';
    toggle?.setAttribute('aria-expanded', 'false');
  }

  toggle?.addEventListener('click', function () {
    if (mobileMenu?.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* Scroll animations — Intersection Observer */
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if (animatedElements.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.1
      }
    );

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    animatedElements.forEach(function (el) {
      el.classList.add('in-view');
    });
  }

  /* Contact form — Web3Forms submission */
  const enquiryForm = document.getElementById('enquiry-form');
  if (enquiryForm) {
    const formPanel = enquiryForm.closest('.contact-section__form-panel, .form-card');
    const formBody = formPanel
      ? formPanel.querySelector('.form-body')
      : document.querySelector('.form-body');
    const formSuccess = formPanel
      ? formPanel.querySelector('.form-success, .contact-section__form-success')
      : document.querySelector('.form-success, .contact-section__form-success');
    const submitBtn = document.getElementById('enquiry-submit');
    const formError = document.getElementById('form-error');
    const formConfig = window.SILVER_FORM || {};

    function showFormError(message) {
      if (!formError) return;
      formError.textContent = message;
      formError.hidden = false;
    }

    function clearFormError() {
      if (!formError) return;
      formError.textContent = '';
      formError.hidden = true;
    }

    function setSubmitting(isSubmitting) {
      if (!submitBtn) return;
      submitBtn.disabled = isSubmitting;
      submitBtn.textContent = isSubmitting ? 'Sending…' : '';
      if (!isSubmitting) {
        submitBtn.innerHTML =
          'Send Enquiry <span class="contact-section__btn-arrow" aria-hidden="true">→</span>';
      }
    }

    function getFormValues() {
      return {
        name: enquiryForm.querySelector('#fullname').value.trim(),
        email: enquiryForm.querySelector('#email').value.trim(),
        phone: enquiryForm.querySelector('#phone').value.trim(),
        project: enquiryForm.querySelector('#project').value,
        propertyType: enquiryForm.querySelector('#property-type').value,
        message: enquiryForm.querySelector('#message').value.trim() || 'No message provided.'
      };
    }

    function notifyWhatsApp(values) {
      const whatsapp = formConfig.whatsapp;
      if (
        !whatsapp ||
        !whatsapp.apiKey ||
        whatsapp.apiKey === 'YOUR_WHATSAPP_API_KEY_HERE' ||
        !whatsapp.phone
      ) {
        return;
      }

      const text = [
        '*New Silver Group Enquiry*',
        '',
        'Name: ' + values.name,
        'Phone: ' + values.phone,
        'Email: ' + values.email,
        'Project: ' + values.project,
        'Property: ' + values.propertyType,
        'Message: ' + values.message
      ].join('\n');

      const url =
        'https://api.callmebot.com/whatsapp.php?phone=' +
        encodeURIComponent(whatsapp.phone) +
        '&apikey=' +
        encodeURIComponent(whatsapp.apiKey) +
        '&text=' +
        encodeURIComponent(text);

      fetch(url).catch(function () {
        /* WhatsApp alert is optional — do not block form success */
      });
    }

    if (formBody && formSuccess) {
      enquiryForm.addEventListener('submit', function (e) {
        e.preventDefault();
        clearFormError();

        const checkbox = enquiryForm.querySelector('#agree-contact');
        if (checkbox && !checkbox.checked) {
          checkbox.focus();
          showFormError('Please agree to be contacted before submitting.');
          return;
        }

        if (!enquiryForm.checkValidity()) {
          enquiryForm.reportValidity();
          return;
        }

        const accessKey = formConfig.accessKey;
        if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
          showFormError('Form is not configured yet. Please add your Web3Forms access key.');
          return;
        }

        const values = getFormValues();
        const formData = new FormData();
        formData.append('access_key', accessKey);
        formData.append('subject', formConfig.subject || 'New Enquiry — Silver Group Website');
        formData.append('from_name', formConfig.fromName || 'Silver Group Website');
        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('Phone Number', values.phone);
        formData.append('Project', values.project);
        formData.append('Property Type', values.propertyType);
        formData.append('message', values.message);
        formData.append('botcheck', '');

        setSubmitting(true);

        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            if (data.success) {
              notifyWhatsApp(values);
              formBody.classList.add('is-hidden');
              formSuccess.classList.add('is-visible');
              enquiryForm.reset();
              return;
            }

            showFormError(
              (data.message || 'Something went wrong. Please try again or call us directly.')
            );
          })
          .catch(function () {
            showFormError('Unable to send your enquiry. Please check your connection or call us.');
          })
          .finally(function () {
            setSubmitting(false);
          });
      });
    }
  }

  /* Active nav link based on current page */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__link, .hero-nav__links a:not(.enquire-link), .mobile-menu__link').forEach(function (link) {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPath = href.split('/').pop();
    if (
      linkPath === currentPath ||
      (currentPath === '' && linkPath === 'index.html') ||
      (currentPath === 'index.html' && linkPath === 'index.html')
    ) {
      link.classList.add('active');
    }
  });

  /* Row hover preview — Foundation & Silver Standard */
  function initRowHoverPreview(config) {
    const body = document.querySelector(config.body);
    const floatPreview = document.querySelector(config.preview);
    if (!body || !floatPreview) return;
    if (!window.matchMedia('(hover: hover) and (min-width: 1025px)').matches) return;

    const rows = body.querySelectorAll(config.row);
    const floatImgs = floatPreview.querySelectorAll(config.img);
    const titleSelector = config.title;
    const textSelector = config.text;
    const rotateDeg = config.rotate || -8;
    const smoothness = config.smoothness || 7.5;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isVisible = false;
    let rafId = null;
    let lastFrameTime = 0;
    let activeRow = null;

    function lerp(start, end, factor) {
      return start + (end - start) * factor;
    }

    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }

    function setActivePreview(key) {
      rows.forEach(function (row) {
        row.classList.toggle('is-active', row.dataset.preview === key);
      });
      floatImgs.forEach(function (img) {
        img.classList.toggle('is-active', img.dataset.preview === key);
      });
    }

    function clearActivePreview() {
      rows.forEach(function (row) {
        row.classList.remove('is-active');
      });
    }

    function updateTargetFromRow(row, e) {
      const bodyRect = body.getBoundingClientRect();
      const title = row.querySelector(titleSelector);
      const text = row.querySelector(textSelector);
      const previewW = floatPreview.offsetWidth || 200;
      const previewH = floatPreview.offsetHeight || 250;

      if (!title || !text) return;

      const titleRect = title.getBoundingClientRect();
      const textRect = text.getBoundingClientRect();
      const rowRect = row.getBoundingClientRect();

      const gapStart = titleRect.right - bodyRect.left;
      const gapEnd = textRect.left - bodyRect.left;
      const gapWidth = gapEnd - gapStart;
      const inset = 10;

      if (gapWidth > previewW + inset * 2) {
        targetX = gapStart + (gapWidth - previewW) / 2;
      } else {
        targetX = gapStart + inset;
      }

      const pointerY = e.clientY - bodyRect.top - previewH * 0.5;
      const rowTop = rowRect.top - bodyRect.top + inset;
      const rowBottom = rowRect.bottom - bodyRect.top - previewH - inset;

      targetY = clamp(pointerY, rowTop, rowBottom);

      const padding = 8;
      targetX = clamp(targetX, padding, bodyRect.width - previewW - padding);
      targetY = clamp(targetY, padding, bodyRect.height - previewH - padding);
    }

    function applyTransform() {
      floatPreview.style.transform =
        'translate3d(' + currentX + 'px,' + currentY + 'px,0) rotate(' + rotateDeg + 'deg)';
    }

    function tick(now) {
      if (!lastFrameTime) {
        lastFrameTime = now;
      }

      const delta = Math.min((now - lastFrameTime) / 1000, 0.032);
      lastFrameTime = now;
      const factor = 1 - Math.exp(-smoothness * delta);

      currentX = lerp(currentX, targetX, factor);
      currentY = lerp(currentY, targetY, factor);
      applyTransform();

      if (isVisible) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
        lastFrameTime = 0;
      }
    }

    function eventFromRow(row) {
      const rect = row.getBoundingClientRect();
      return { clientY: rect.top + rect.height * 0.5 };
    }

    function showPreview(key, row, e) {
      activeRow = row;
      isVisible = true;
      floatPreview.classList.add('is-visible');
      setActivePreview(key);
      updateTargetFromRow(row, e);

      if (!rafId) {
        rafId = requestAnimationFrame(tick);
      }
    }

    function hidePreview() {
      activeRow = null;
      isVisible = false;
      floatPreview.classList.remove('is-visible');
      clearActivePreview();
    }

    rows.forEach(function (row) {
      row.addEventListener('mouseenter', function (e) {
        showPreview(row.dataset.preview, row, e);
      });

      row.addEventListener('mousemove', function (e) {
        if (!isVisible || activeRow !== row) return;
        updateTargetFromRow(row, e);
      });

      row.addEventListener('focus', function () {
        showPreview(row.dataset.preview, row, eventFromRow(row));
      });
    });

    body.addEventListener('mouseleave', hidePreview);

    body.addEventListener('focusout', function (e) {
      if (!body.contains(e.relatedTarget)) {
        hidePreview();
      }
    });

    window.addEventListener('resize', function () {
      if (activeRow && isVisible) {
        updateTargetFromRow(activeRow, eventFromRow(activeRow));
      }
    });
  }

  initRowHoverPreview({
    body: '.about-foundation__body',
    preview: '.about-foundation__float-preview',
    row: '.about-foundation__row[data-preview]',
    img: '.about-foundation__float-img',
    title: '.about-foundation__title',
    text: '.about-foundation__text'
  });

  /* Silver Standard — left panel image sync */
  const standardBody = document.querySelector('.about-standard__body');
  const standardCaption = document.querySelector('.about-standard__visual-caption');
  const standardVisualImgs = document.querySelectorAll('.about-standard__visual-img');

  if (standardBody && standardVisualImgs.length) {
    const standardRows = standardBody.querySelectorAll('.about-standard__row[data-preview]');

    function setStandardActive(key, label) {
      standardRows.forEach(function (row) {
        row.classList.toggle('is-active', row.dataset.preview === key);
      });
      standardVisualImgs.forEach(function (img) {
        img.classList.toggle('is-active', img.dataset.preview === key);
      });
      if (standardCaption && label) {
        standardCaption.textContent = label;
      }
    }

    function getRowLabel(row) {
      if (row.dataset.label) return row.dataset.label;
      var titleEl = row.querySelector('.about-standard__title');
      return titleEl ? titleEl.textContent : '';
    }

    standardRows.forEach(function (row) {
      function activate() {
        setStandardActive(row.dataset.preview, getRowLabel(row));
      }

      row.addEventListener('mouseenter', activate);
      row.addEventListener('focus', activate);
    });

    if (standardBody.closest('.about-standard')) {
      standardBody.addEventListener('mouseleave', function () {
        var first = standardRows[0];
        if (first) {
          setStandardActive(first.dataset.preview, getRowLabel(first));
        }
      });
    }
  }

  /* Projects page — floor plan tabs */
  function initFloorPlanTabs() {
    var tablist = document.querySelector('.project-floors__tabs');
    if (!tablist) return;

    var tabs = tablist.querySelectorAll('.project-floors__tab');
    var panels = document.querySelectorAll('.project-floors__panel');

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var floor = tab.dataset.floor;

        tabs.forEach(function (t) {
          var isActive = t === tab;
          t.classList.toggle('is-active', isActive);
          t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        panels.forEach(function (panel) {
          var isActive = panel.dataset.floor === floor;
          panel.classList.toggle('is-active', isActive);
          if (isActive) {
            panel.removeAttribute('hidden');
          } else {
            panel.setAttribute('hidden', '');
          }
        });
      });
    });

    document.querySelectorAll('.project-floors__frame img').forEach(function (img) {
      function showPlaceholder() {
        var frame = img.closest('.project-floors__frame');
        if (frame) frame.classList.add('is-placeholder');
      }

      img.addEventListener('error', showPlaceholder);

      if (img.complete && img.naturalWidth === 0) {
        showPlaceholder();
      }
    });
  }

  initFloorPlanTabs();

  /* Google Maps embed — set iframe src from shared config */
  function initGoogleMaps() {
    var config = window.SILVER_MAP;
    if (!config || !config.embedSrc) return;

    document.querySelectorAll('[data-google-map]').forEach(function (frame) {
      if (frame.tagName === 'IFRAME') {
        frame.src = config.embedSrc;
        return;
      }

      var iframe = frame.querySelector('iframe');
      if (iframe) {
        iframe.src = config.embedSrc;
      }
    });
  }

  initGoogleMaps();

  /* Brochure download — contact details required before file download */
  function initBrochureDownload() {
    var downloadTriggers = document.querySelectorAll('[data-brochure-download]');
    var modal = document.getElementById('brochure-modal');
    var form = document.getElementById('brochure-form');

    if (!downloadTriggers.length || !modal || !form) return;

    var formConfig = window.SILVER_FORM || {};
    var brochureConfig = formConfig.brochure || {};
    var submitBtn = document.getElementById('brochure-submit');
    var formError = document.getElementById('brochure-form-error');
    var storageKey = 'silver-brochure-unlocked';
    var lastFocusedElement = null;

    function showBrochureError(message) {
      if (!formError) return;
      formError.textContent = message;
      formError.hidden = false;
    }

    function clearBrochureError() {
      if (!formError) return;
      formError.textContent = '';
      formError.hidden = true;
    }

    function setBrochureSubmitting(isSubmitting) {
      if (!submitBtn) return;
      submitBtn.disabled = isSubmitting;
      submitBtn.textContent = isSubmitting ? 'Sending…' : 'Submit & Download Brochure';
    }

    function getBrochureValues() {
      return {
        name: form.querySelector('#brochure-name').value.trim(),
        email: form.querySelector('#brochure-email').value.trim(),
        phone: form.querySelector('#brochure-phone').value.trim()
      };
    }

    function notifyBrochureWhatsApp(values) {
      var whatsapp = formConfig.whatsapp;
      if (
        !whatsapp ||
        !whatsapp.apiKey ||
        whatsapp.apiKey === 'YOUR_WHATSAPP_API_KEY_HERE' ||
        !whatsapp.phone
      ) {
        return;
      }

      var text = [
        '*Brochure Download — Silver Group*',
        '',
        'Name: ' + values.name,
        'Phone: ' + values.phone,
        'Email: ' + values.email,
        'Project: Silver Infinity'
      ].join('\n');

      var url =
        'https://api.callmebot.com/whatsapp.php?phone=' +
        encodeURIComponent(whatsapp.phone) +
        '&apikey=' +
        encodeURIComponent(whatsapp.apiKey) +
        '&text=' +
        encodeURIComponent(text);

      fetch(url).catch(function () {
        /* WhatsApp alert is optional */
      });
    }

    function triggerBrochureDownload() {
      var fileUrl = brochureConfig.file || 'documents/silver-infinity-brochure.pdf';
      var filename = brochureConfig.filename || 'Silver-Infinity-Brochure.pdf';
      var link = document.createElement('a');
      link.href = fileUrl;
      link.download = filename;
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      link.remove();
    }

    function openBrochureModal() {
      lastFocusedElement = document.activeElement;
      modal.hidden = false;
      modal.setAttribute('aria-hidden', 'false');
      modal.classList.add('is-open');
      document.body.classList.add('brochure-modal-open');
      clearBrochureError();
      var firstField = form.querySelector('#brochure-name');
      if (firstField) {
        window.setTimeout(function () {
          firstField.focus();
        }, 50);
      }
    }

    function closeBrochureModal() {
      modal.classList.remove('is-open');
      modal.hidden = true;
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('brochure-modal-open');
      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
      }
    }

    function handleBrochureRequest(event) {
      event.preventDefault();
      if (sessionStorage.getItem(storageKey) === '1') {
        triggerBrochureDownload();
        return;
      }
      openBrochureModal();
    }

    downloadTriggers.forEach(function (trigger) {
      trigger.addEventListener('click', handleBrochureRequest);
    });

    modal.querySelectorAll('[data-brochure-close]').forEach(function (el) {
      el.addEventListener('click', closeBrochureModal);
    });

    document.addEventListener('keydown', function (event) {
      if (!modal.classList.contains('is-open')) return;
      if (event.key === 'Escape') {
        closeBrochureModal();
      }
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      clearBrochureError();

      var agree = form.querySelector('#brochure-agree');
      if (agree && !agree.checked) {
        agree.focus();
        showBrochureError('Please agree to be contacted before downloading.');
        return;
      }

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var accessKey = formConfig.accessKey;
      if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
        showBrochureError('Form is not configured yet. Please add your Web3Forms access key.');
        return;
      }

      var values = getBrochureValues();
      var formData = new FormData();
      formData.append('access_key', accessKey);
      formData.append('subject', brochureConfig.subject || 'Brochure Download Request — Silver Group Website');
      formData.append('from_name', formConfig.fromName || 'Silver Group Website');
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('Phone Number', values.phone);
      formData.append('Project', 'Silver Infinity');
      formData.append('Request Type', 'Brochure Download');
      formData.append('message', 'Brochure download requested from the Silver Infinity project page.');
      formData.append('botcheck', '');

      setBrochureSubmitting(true);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          if (data.success) {
            notifyBrochureWhatsApp(values);
            sessionStorage.setItem(storageKey, '1');
            form.reset();
            closeBrochureModal();
            triggerBrochureDownload();
            return;
          }

          showBrochureError(
            data.message || 'Something went wrong. Please try again or call us directly.'
          );
        })
        .catch(function () {
          showBrochureError('Unable to send your details. Please check your connection or call us.');
        })
        .finally(function () {
          setBrochureSubmitting(false);
        });
    });
  }

  initBrochureDownload();
})();
