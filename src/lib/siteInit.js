/**
 * Page effects — forms, maps, scroll animations, interactive sections.
 * Nav and mobile menu are handled in React layout components.
 */

import { FORM, MAP } from '../config/site';

export function initPageEffects(pathname = '/') {
  window.SILVER_FORM = FORM;
  window.SILVER_MAP = MAP;

  const cleanups = [];

  if (pathname === '/contact') {
    const enquiryCleanup = initEnquiryForm();
    if (enquiryCleanup) cleanups.push(enquiryCleanup);
    initGoogleMaps();
  }

  if (pathname === '/about') {
    initRowHoverPreview({
      body: '.about-foundation__body',
      preview: '.about-foundation__float-preview',
      row: '.about-foundation__row[data-preview]',
      img: '.about-foundation__float-img',
      title: '.about-foundation__title',
      text: '.about-foundation__text',
    });
    initSilverStandard();
  }

  if (pathname === '/projects') {
    initFloorPlanTabs();
    initBrochureDownload();
    initGoogleMaps();
  }

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}

function initEnquiryForm() {
  const enquiryForm = document.getElementById('enquiry-form');
  if (!enquiryForm) return undefined;

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

  const showFormError = (message) => {
    if (!formError) return;
    formError.textContent = message;
    formError.hidden = false;
  };

  const clearFormError = () => {
    if (!formError) return;
    formError.textContent = '';
    formError.hidden = true;
  };

  const setSubmitting = (isSubmitting) => {
    if (!submitBtn) return;
    submitBtn.disabled = isSubmitting;
    submitBtn.textContent = isSubmitting ? 'Sending…' : '';
    if (!isSubmitting) {
      submitBtn.innerHTML =
        'Send Enquiry <span class="contact-section__btn-arrow" aria-hidden="true">→</span>';
    }
  };

  const getFormValues = () => ({
    name: enquiryForm.querySelector('#fullname').value.trim(),
    email: enquiryForm.querySelector('#email').value.trim(),
    phone: enquiryForm.querySelector('#phone').value.trim(),
    project: enquiryForm.querySelector('#project').value,
    propertyType: enquiryForm.querySelector('#property-type').value,
    message: enquiryForm.querySelector('#message').value.trim() || 'No message provided.',
  });

  const notifyWhatsApp = (values) => {
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
      `Name: ${values.name}`,
      `Phone: ${values.phone}`,
      `Email: ${values.email}`,
      `Project: ${values.project}`,
      `Property: ${values.propertyType}`,
      `Message: ${values.message}`,
    ].join('\n');

    const url =
      'https://api.callmebot.com/whatsapp.php?phone=' +
      encodeURIComponent(whatsapp.phone) +
      '&apikey=' +
      encodeURIComponent(whatsapp.apiKey) +
      '&text=' +
      encodeURIComponent(text);

    fetch(url).catch(() => {});
  };

  if (!formBody || !formSuccess) return undefined;

  const onSubmit = (e) => {
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

    fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          notifyWhatsApp(values);
          formBody.classList.add('is-hidden');
          formSuccess.classList.add('is-visible');
          enquiryForm.reset();
          return;
        }
        showFormError(data.message || 'Something went wrong. Please try again or call us directly.');
      })
      .catch(() => {
        showFormError('Unable to send your enquiry. Please check your connection or call us.');
      })
      .finally(() => setSubmitting(false));
  };

  enquiryForm.addEventListener('submit', onSubmit);

  return () => {
    enquiryForm.removeEventListener('submit', onSubmit);
    formBody.classList.remove('is-hidden');
    formSuccess.classList.remove('is-visible');
    clearFormError();
    enquiryForm.reset();
    setSubmitting(false);
  };
}

function initRowHoverPreview(config) {
  const body = document.querySelector(config.body);
  const floatPreview = document.querySelector(config.preview);
  if (!body || !floatPreview) return;
  if (!window.matchMedia('(hover: hover) and (min-width: 1025px)').matches) return;

  const rows = body.querySelectorAll(config.row);
  const floatImgs = floatPreview.querySelectorAll(config.img);
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let isVisible = false;
  let rafId = null;
  let activeRow = null;

  const lerp = (start, end, factor) => start + (end - start) * factor;

  const setActivePreview = (key) => {
    floatImgs.forEach((img) => {
      img.classList.toggle('is-active', img.dataset.preview === key);
    });
  };

  const clearActivePreview = () => {
    floatImgs.forEach((img) => img.classList.remove('is-active'));
  };

  const updateTargetFromRow = (row, e) => {
    const rect = row.getBoundingClientRect();
    targetX = e.clientX - rect.left + 24;
    targetY = e.clientY - rect.top - 40;
  };

  const applyTransform = () => {
    floatPreview.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(-8deg)`;
  };

  const tick = (time) => {
    const factor = 0.12;
    currentX = lerp(currentX, targetX, factor);
    currentY = lerp(currentY, targetY, factor);
    applyTransform();
    if (isVisible) rafId = requestAnimationFrame(tick);
    else {
      rafId = null;
    }
  };

  const eventFromRow = (row) => {
    const rect = row.getBoundingClientRect();
    return { clientY: rect.top + rect.height * 0.5, clientX: rect.left + rect.width * 0.5 };
  };

  const showPreview = (key, row, e) => {
    activeRow = row;
    isVisible = true;
    floatPreview.classList.add('is-visible');
    setActivePreview(key);
    updateTargetFromRow(row, e);
    if (!rafId) rafId = requestAnimationFrame(tick);
  };

  const hidePreview = () => {
    activeRow = null;
    isVisible = false;
    floatPreview.classList.remove('is-visible');
    clearActivePreview();
  };

  rows.forEach((row) => {
    row.addEventListener('mouseenter', (e) => showPreview(row.dataset.preview, row, e));
    row.addEventListener('mousemove', (e) => {
      if (!isVisible || activeRow !== row) return;
      updateTargetFromRow(row, e);
    });
    row.addEventListener('focus', () => showPreview(row.dataset.preview, row, eventFromRow(row)));
  });

  body.addEventListener('mouseleave', hidePreview);
  body.addEventListener('focusout', (e) => {
    if (!body.contains(e.relatedTarget)) hidePreview();
  });
}

function initSilverStandard() {
  const standardBody = document.querySelector('.about-standard__body');
  const standardCaption = document.querySelector('.about-standard__visual-caption');
  const standardVisualImgs = document.querySelectorAll('.about-standard__visual-img');
  if (!standardBody || !standardVisualImgs.length) return;

  const standardRows = standardBody.querySelectorAll('.about-standard__row[data-preview]');

  const setStandardActive = (key, label) => {
    standardRows.forEach((row) => row.classList.toggle('is-active', row.dataset.preview === key));
    standardVisualImgs.forEach((img) => img.classList.toggle('is-active', img.dataset.preview === key));
    if (standardCaption && label) standardCaption.textContent = label;
  };

  const getRowLabel = (row) => {
    if (row.dataset.label) return row.dataset.label;
    const titleEl = row.querySelector('.about-standard__title');
    return titleEl ? titleEl.textContent : '';
  };

  standardRows.forEach((row) => {
    const activate = () => setStandardActive(row.dataset.preview, getRowLabel(row));
    row.addEventListener('mouseenter', activate);
    row.addEventListener('focus', activate);
  });

  if (standardBody.closest('.about-standard')) {
    standardBody.addEventListener('mouseleave', () => {
      const first = standardRows[0];
      if (first) setStandardActive(first.dataset.preview, getRowLabel(first));
    });
  }
}

function initFloorPlanTabs() {
  const tablist = document.querySelector('.project-floors__tabs');
  if (!tablist) return;

  const tabs = tablist.querySelectorAll('.project-floors__tab');
  const panels = document.querySelectorAll('.project-floors__panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const floor = tab.dataset.floor;
      tabs.forEach((t) => {
        const isActive = t === tab;
        t.classList.toggle('is-active', isActive);
        t.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
      panels.forEach((panel) => {
        const isActive = panel.dataset.floor === floor;
        panel.classList.toggle('is-active', isActive);
        if (isActive) panel.removeAttribute('hidden');
        else panel.setAttribute('hidden', '');
      });
    });
  });

  document.querySelectorAll('.project-floors__frame img').forEach((img) => {
    const showPlaceholder = () => {
      const frame = img.closest('.project-floors__frame');
      if (frame) frame.classList.add('is-placeholder');
    };
    img.addEventListener('error', showPlaceholder);
    if (img.complete && img.naturalWidth === 0) showPlaceholder();
  });
}

function initGoogleMaps() {
  const config = window.SILVER_MAP;
  if (!config || !config.embedSrc) return;

  document.querySelectorAll('[data-google-map]').forEach((frame) => {
    if (frame.tagName === 'IFRAME') {
      frame.src = config.embedSrc;
      return;
    }
    const iframe = frame.querySelector('iframe');
    if (iframe) iframe.src = config.embedSrc;
  });
}

function initBrochureDownload() {
  const downloadTriggers = document.querySelectorAll('[data-brochure-download]');
  const modal = document.getElementById('brochure-modal');
  const form = document.getElementById('brochure-form');
  if (!downloadTriggers.length || !modal || !form) return;

  const formConfig = window.SILVER_FORM || {};
  const brochureConfig = formConfig.brochure || {};
  const submitBtn = document.getElementById('brochure-submit');
  const formError = document.getElementById('brochure-form-error');
  const storageKey = 'silver-brochure-unlocked';
  let lastFocusedElement = null;

  const showBrochureError = (message) => {
    if (!formError) return;
    formError.textContent = message;
    formError.hidden = false;
  };

  const clearBrochureError = () => {
    if (!formError) return;
    formError.textContent = '';
    formError.hidden = true;
  };

  const setBrochureSubmitting = (isSubmitting) => {
    if (!submitBtn) return;
    submitBtn.disabled = isSubmitting;
    submitBtn.textContent = isSubmitting ? 'Sending…' : 'Submit & Download Brochure';
  };

  const getBrochureValues = () => ({
    name: form.querySelector('#brochure-name').value.trim(),
    email: form.querySelector('#brochure-email').value.trim(),
    phone: form.querySelector('#brochure-phone').value.trim(),
  });

  const triggerBrochureDownload = () => {
    const fileUrl = brochureConfig.file || '/documents/silver-infinity-brochure.pdf';
    const filename = brochureConfig.filename || 'Silver-Infinity-Brochure.pdf';
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = filename;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const openBrochureModal = () => {
    lastFocusedElement = document.activeElement;
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('is-open');
    document.body.classList.add('brochure-modal-open');
    clearBrochureError();
    const firstField = form.querySelector('#brochure-name');
    if (firstField) window.setTimeout(() => firstField.focus(), 50);
  };

  const closeBrochureModal = () => {
    modal.classList.remove('is-open');
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('brochure-modal-open');
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  };

  const handleBrochureRequest = (event) => {
    event.preventDefault();
    if (sessionStorage.getItem(storageKey) === '1') {
      triggerBrochureDownload();
      return;
    }
    openBrochureModal();
  };

  downloadTriggers.forEach((trigger) => trigger.addEventListener('click', handleBrochureRequest));
  modal.querySelectorAll('[data-brochure-close]').forEach((el) => {
    el.addEventListener('click', closeBrochureModal);
  });

  document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeBrochureModal();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearBrochureError();

    const agree = form.querySelector('#brochure-agree');
    if (agree && !agree.checked) {
      agree.focus();
      showBrochureError('Please agree to be contacted before downloading.');
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const accessKey = formConfig.accessKey;
    if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
      showBrochureError('Form is not configured yet. Please add your Web3Forms access key.');
      return;
    }

    const values = getBrochureValues();
    const formData = new FormData();
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

    fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          sessionStorage.setItem(storageKey, '1');
          form.reset();
          closeBrochureModal();
          triggerBrochureDownload();
          return;
        }
        showBrochureError(data.message || 'Something went wrong. Please try again or call us directly.');
      })
      .catch(() => {
        showBrochureError('Unable to send your details. Please check your connection or call us.');
      })
      .finally(() => setBrochureSubmitting(false));
  });
}
