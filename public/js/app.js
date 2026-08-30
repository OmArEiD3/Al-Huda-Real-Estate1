/**
 * Al Huda Real Estate - Main Client Application Logic
 * Specialized for Sheikh Zayed City, Egypt | Currency: EGP
 */

// State Management
const state = {
  properties: [],
  filteredProperties: [],
  wishlist: JSON.parse(localStorage.getItem('alhuda_wishlist') || '[]'),
  selectedProperty: null,
  selectedPropertyMedia: [],
  activeGalleryIndex: 0,
  filters: {
    search: '',
    status: 'all',
    district: 'all',
    type: 'all',
    minPrice: '',
    maxPrice: '',
    bedrooms: 'all',
    amenity: 'all'
  }
};

// ==========================================================================
// Media Helpers (Images & Videos)
// ==========================================================================
const VIDEO_FILE_EXTENSIONS = ['.mp4', '.mov', '.webm', '.avi', '.mkv'];

// Detects whether a given media URL is a video based on its file extension
function isVideoUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const clean = url.split('?')[0].split('#')[0].toLowerCase();
  return VIDEO_FILE_EXTENSIONS.some(ext => clean.endsWith(ext));
}

// Combines a property's images[] and videos[] into a single ordered media list
function getPropertyMedia(prop) {
  const images = Array.isArray(prop?.images) ? prop.images.filter(Boolean) : [];
  const videos = Array.isArray(prop?.videos) ? prop.videos.filter(Boolean) : [];
  const combined = [...images, ...videos];
  return combined.length > 0 ? combined : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c'];
}

// Returns the best thumbnail URL for a property card (prefers an actual image over a video)
function getPropertyThumbnail(prop) {
  const media = getPropertyMedia(prop);
  const firstImage = media.find(url => !isVideoUrl(url));
  return firstImage || media[0];
}

// Renders either an <img> or <video> into the gallery's main media container
function renderGalleryMainMedia(url) {
  const container = document.getElementById('galleryMainMedia');
  if (!container || !url) return;
  if (isVideoUrl(url)) {
    container.innerHTML = `<video src="${url}" style="width:100%;height:100%;object-fit:cover;" controls playsinline preload="metadata"></video>`;
  } else {
    container.innerHTML = `<img src="${url}" alt="Property View" style="width:100%;height:100%;object-fit:cover;" />`;
  }
}

// ==========================================================================
// Initialization
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  fetchProperties();
  updateWishlistUI();
  initMortgageCalculator();
  initHeaderScroll();
});

// Listen to language changes from i18n
window.addEventListener('alhuda_language_changed', () => {
  renderProperties();
  if (state.selectedProperty) {
    updateModalContent(state.selectedProperty);
  }
  updateWishlistUI();
  calculateMortgage();
});

// ==========================================================================
// API Calls & Data Fetching
// ==========================================================================
async function fetchProperties() {
  const container = document.getElementById('propertiesGrid');
  if (container) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem;">
        <i class="fas fa-spinner fa-spin" style="font-size: 2.5rem; color: var(--gold-primary);"></i>
        <p style="margin-top: 1rem; color: var(--text-secondary);">${t('loading')}</p>
      </div>
    `;
  }

  try {
    const params = new URLSearchParams();
    if (state.filters.search) params.append('search', state.filters.search);
    if (state.filters.status !== 'all') params.append('status', state.filters.status);
    if (state.filters.district !== 'all') params.append('district', state.filters.district);
    if (state.filters.type !== 'all') params.append('type', state.filters.type);
    if (state.filters.minPrice) params.append('minPrice', state.filters.minPrice);
    if (state.filters.maxPrice) params.append('maxPrice', state.filters.maxPrice);
    if (state.filters.bedrooms !== 'all') params.append('bedrooms', state.filters.bedrooms);
    if (state.filters.amenity !== 'all') params.append('amenity', state.filters.amenity);

    const res = await fetch(`/api/properties?${params.toString()}`);
    const json = await res.json();

    if (json.success) {
      state.properties = json.data;
      state.filteredProperties = json.data;
      renderProperties();
      renderFeaturedProperties();
    }
  } catch (err) {
    console.error('Failed to fetch properties:', err);
    if (container) {
      container.innerHTML = `<p style="text-align: center; color: var(--danger);">Failed to load properties. Please refresh.</p>`;
    }
  }
}

// ==========================================================================
// Property Rendering (Grid & Featured with Full Card Clickability)
// ==========================================================================
function renderProperties() {
  const container = document.getElementById('propertiesGrid');
  const countEl = document.getElementById('resultsCount');

  if (!container) return;

  if (countEl) {
    countEl.innerHTML = t('filter_results_count', { count: `<strong>${state.filteredProperties.length}</strong>` });
  }

  if (state.filteredProperties.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--gold-border);">
        <i class="fas fa-search" style="font-size: 3rem; color: var(--gold-primary); margin-bottom: 1rem; opacity: 0.5;"></i>
        <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem;">${t('filter_no_results')}</h3>
        <button class="btn-luxury" style="margin-top: 1rem;" onclick="resetFilters()">${t('btn_reset_filters')}</button>
      </div>
    `;
    return;
  }

  container.innerHTML = state.filteredProperties.map(prop => createPropertyCardHTML(prop)).join('');
}

function renderFeaturedProperties() {
  const featuredContainer = document.getElementById('featuredGrid');
  if (!featuredContainer) return;

  const featured = state.properties.filter(p => p.featured);
  featuredContainer.innerHTML = featured.slice(0, 3).map(prop => createPropertyCardHTML(prop)).join('');
}

function createPropertyCardHTML(prop) {
  const isWishlisted = state.wishlist.includes(prop.id);
  const title = getPropText(prop.title);
  const desc = getPropText(prop.description);
  const district = getPropText(prop.location?.district);
  const badgeText = getPropText(prop.badge);

  // Status Class and Label
  let statusClass = 'badge-sale';
  let statusLabel = t('status_for_sale');
  if (prop.status === 'for-rent') {
    statusClass = 'badge-rent';
    statusLabel = t('status_for_rent');
  } else if (prop.status === 'furnished-rent') {
    statusClass = 'badge-gold';
    statusLabel = t('status_furnished_rent');
  }

  const mainMedia = getPropertyThumbnail(prop);
  const mainIsVideo = isVideoUrl(mainMedia);

  return `
    <div class="property-card" data-id="${prop.id}" onclick="openPropertyModal('${prop.id}')" style="cursor: pointer;">
      <div class="card-media-wrapper">
        ${mainIsVideo
          ? `<video src="${mainMedia}" class="card-image" muted loop playsinline preload="metadata"></video>
             <div class="card-video-badge"><i class="fas fa-play-circle"></i></div>`
          : `<img src="${mainMedia}" alt="${title}" class="card-image" loading="lazy" />`}
        <div class="card-media-overlay"></div>
        
        <div class="card-top-badges">
          <span class="badge-tag ${statusClass}">${statusLabel}</span>
          ${badgeText ? `<span class="badge-tag badge-gold">${badgeText}</span>` : ''}
        </div>

        <button class="card-wishlist-toggle ${isWishlisted ? 'active' : ''}" 
                onclick="toggleWishlist('${prop.id}', event)" 
                title="${t('btn_add_to_wishlist')}">
          <i class="${isWishlisted ? 'fas' : 'far'} fa-heart"></i>
        </button>

        <!-- Glassmorphism Professional Price Badge -->
        <div class="card-price-tag">
          <div class="card-price-amount">${formatPrice(prop.price)}</div>
        </div>
      </div>

      <div class="card-body">
        <div class="card-location">
          <i class="fas fa-map-marker-alt"></i>
          <span>${district} • ${t('brand_tagline')}</span>
        </div>

        <h3 class="card-title" title="${title}">${title}</h3>
        <p class="card-description">${desc}</p>

        <div class="card-specs-grid">
          <div class="spec-item" title="${t('spec_bedrooms')}">
            <i class="fas fa-bed"></i>
            <span>${prop.specs?.bedrooms || 0} ${t('spec_bedrooms')}</span>
          </div>
          <div class="spec-item" title="${t('spec_bathrooms')}">
            <i class="fas fa-bath"></i>
            <span>${prop.specs?.bathrooms || 0} ${t('spec_bathrooms')}</span>
          </div>
          <div class="spec-item" title="${t('spec_area')}">
            <i class="fas fa-vector-square"></i>
            <span>${prop.specs?.area_sqm || 0} ${t('spec_sqm')}</span>
          </div>
        </div>

        <div class="card-actions-row">
          <button class="btn-luxury" onclick="event.stopPropagation(); openPropertyModal('${prop.id}')">
            <i class="fas fa-eye"></i> ${t('btn_view_details')}
          </button>
          <button class="btn-outline-gold" onclick="event.stopPropagation(); openViewingModal('${prop.id}')">
            <i class="fas fa-calendar-check"></i> ${t('btn_request_viewing')}
          </button>
        </div>
      </div>
    </div>
  `;
}

// ==========================================================================
// Filter Handlers
// ==========================================================================
function initEventListeners() {
  // Purpose tabs (All, For Sale, Regular Rent, Furnished Rent)
  document.querySelectorAll('.filter-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.filters.status = btn.dataset.status;
      fetchProperties();
    });
  });

  // Search input with debounce
  const searchInput = document.getElementById('filterSearch');
  if (searchInput) {
    let timeout = null;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        state.filters.search = e.target.value;
        fetchProperties();
      }, 350);
    });
  }

  // Compound / District Select Filter
  const citySelect = document.getElementById('filterCity');
  if (citySelect) {
    citySelect.addEventListener('change', (e) => {
      state.filters.district = e.target.value;
      fetchProperties();
    });
  }

  const typeSelect = document.getElementById('filterType');
  if (typeSelect) {
    typeSelect.addEventListener('change', (e) => {
      state.filters.type = e.target.value;
      fetchProperties();
    });
  }

  // Bedrooms Select Filter (supports 2, 3, 4, 5, all)
  const bedsSelect = document.getElementById('filterBeds');
  if (bedsSelect) {
    bedsSelect.addEventListener('change', (e) => {
      state.filters.bedrooms = e.target.value;
      fetchProperties();
    });
  }

  const amenitySelect = document.getElementById('filterAmenity');
  if (amenitySelect) {
    amenitySelect.addEventListener('change', (e) => {
      state.filters.amenity = e.target.value;
      fetchProperties();
    });
  }

  // Price inputs
  const minPriceInput = document.getElementById('filterMinPrice');
  const maxPriceInput = document.getElementById('filterMaxPrice');
  if (minPriceInput) {
    minPriceInput.addEventListener('change', (e) => {
      state.filters.minPrice = e.target.value;
      fetchProperties();
    });
  }
  if (maxPriceInput) {
    maxPriceInput.addEventListener('change', (e) => {
      state.filters.maxPrice = e.target.value;
      fetchProperties();
    });
  }

  // Contact form submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
  }

  // Viewing booking form submission
  const viewingForm = document.getElementById('viewingForm');
  if (viewingForm) {
    viewingForm.addEventListener('submit', handleViewingSubmit);
  }

  // Close modals on backdrop click or escape key
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModals();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModals();
  });
}

function resetFilters() {
  state.filters = {
    search: '',
    status: 'all',
    district: 'all',
    type: 'all',
    minPrice: '',
    maxPrice: '',
    bedrooms: 'all',
    amenity: 'all'
  };

  const searchInput = document.getElementById('filterSearch');
  if (searchInput) searchInput.value = '';
  const citySelect = document.getElementById('filterCity');
  if (citySelect) citySelect.value = 'all';
  const typeSelect = document.getElementById('filterType');
  if (typeSelect) typeSelect.value = 'all';
  const bedsSelect = document.getElementById('filterBeds');
  if (bedsSelect) bedsSelect.value = 'all';
  const amenitySelect = document.getElementById('filterAmenity');
  if (amenitySelect) amenitySelect.value = 'all';
  const minPriceInput = document.getElementById('filterMinPrice');
  if (minPriceInput) minPriceInput.value = '';
  const maxPriceInput = document.getElementById('filterMaxPrice');
  if (maxPriceInput) maxPriceInput.value = '';

  document.querySelectorAll('.filter-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.status === 'all');
  });

  fetchProperties();
}

// ==========================================================================
// Property Details Modal & Gallery Slider
// ==========================================================================
function openPropertyModal(propId) {
  const prop = state.properties.find(p => p.id === propId);
  if (!prop) return;

  state.selectedProperty = prop;
  state.activeGalleryIndex = 0;

  updateModalContent(prop);

  const modal = document.getElementById('propertyModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function updateModalContent(prop) {
  const title = getPropText(prop.title);
  const desc = getPropText(prop.description);
  const district = getPropText(prop.location?.district);

  // Gallery (images + videos combined)
  const media = getPropertyMedia(prop);
  state.selectedPropertyMedia = media;
  if (state.activeGalleryIndex >= media.length) state.activeGalleryIndex = 0;
  renderGalleryMainMedia(media[state.activeGalleryIndex] || media[0]);

  const thumbsContainer = document.getElementById('galleryThumbs');
  if (thumbsContainer) {
    thumbsContainer.innerHTML = media.map((item, idx) => {
      const isVid = isVideoUrl(item);
      return `
      <div class="gallery-thumb ${idx === state.activeGalleryIndex ? 'active' : ''}" onclick="setGalleryImage(${idx})">
        ${isVid
          ? `<video src="${item}" muted preload="metadata"></video><div class="gallery-thumb-video-badge"><i class="fas fa-play"></i></div>`
          : `<img src="${item}" alt="Thumbnail ${idx + 1}" />`}
      </div>
    `;
    }).join('');
  }

  // Text contents
  const modalTitle = document.getElementById('modalPropTitle');
  if (modalTitle) modalTitle.textContent = title;

  const modalLocation = document.getElementById('modalPropLocation');
  if (modalLocation) modalLocation.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${district} • ${t('brand_tagline')}`;

  const modalPrice = document.getElementById('modalPropPrice');
  if (modalPrice) modalPrice.textContent = formatPrice(prop.price);

  const modalDesc = document.getElementById('modalPropDesc');
  if (modalDesc) modalDesc.textContent = desc;

  // Specs
  const specsContainer = document.getElementById('modalPropSpecs');
  if (specsContainer) {
    specsContainer.innerHTML = `
      <div class="spec-item"><i class="fas fa-bed"></i> <strong>${prop.specs?.bedrooms || 0}</strong> ${t('spec_bedrooms')}</div>
      <div class="spec-item"><i class="fas fa-bath"></i> <strong>${prop.specs?.bathrooms || 0}</strong> ${t('spec_bathrooms')}</div>
      <div class="spec-item"><i class="fas fa-vector-square"></i> <strong>${prop.specs?.area_sqm || 0}</strong> ${t('spec_sqm')} (${prop.specs?.area_sqft || 0} ${t('spec_sqft')})</div>
      <div class="spec-item"><i class="fas fa-layer-group"></i> <strong>${prop.specs?.floors || 1}</strong> ${t('spec_floors')}</div>
    `;
  }

  // Amenities
  const amenitiesContainer = document.getElementById('modalPropAmenities');
  if (amenitiesContainer && Array.isArray(prop.amenities)) {
    amenitiesContainer.innerHTML = prop.amenities.map(amenityKey => `
      <div class="amenity-chip">
        <i class="fas fa-check-circle"></i>
        <span>${t('amenity_' + amenityKey) || amenityKey}</span>
      </div>
    `).join('');
  }

  // Set action buttons in modal
  const bookingBtn = document.getElementById('modalBookingBtn');
  if (bookingBtn) {
    bookingBtn.onclick = (e) => {
      if (e) e.stopPropagation();
      closeModals();
      openViewingModal(prop.id);
    };
  }

  const whatsappBtn = document.getElementById('modalWhatsappBtn');
  if (whatsappBtn) {
    const msg = encodeURIComponent(`مرحباً عقارات الهدى، أود الاستفسار وحجز معاينة للعقار في الشيخ زايد: ${title} (المعرف: ${prop.id})`);
    whatsappBtn.href = `https://wa.me/201000009999?text=${msg}`;
  }
}

function setGalleryImage(index) {
  const media = state.selectedPropertyMedia;
  if (!media || media.length === 0) return;
  state.activeGalleryIndex = index;
  renderGalleryMainMedia(media[index]);

  document.querySelectorAll('.gallery-thumb').forEach((thumb, idx) => {
    thumb.classList.toggle('active', idx === index);
  });
}

function nextGalleryImage() {
  const media = state.selectedPropertyMedia;
  if (!media || media.length === 0) return;
  state.activeGalleryIndex = (state.activeGalleryIndex + 1) % media.length;
  setGalleryImage(state.activeGalleryIndex);
}

function prevGalleryImage() {
  const media = state.selectedPropertyMedia;
  if (!media || media.length === 0) return;
  state.activeGalleryIndex = (state.activeGalleryIndex - 1 + media.length) % media.length;
  setGalleryImage(state.activeGalleryIndex);
}

// ==========================================================================
// Viewing Booking Modal (طلب معاينة)
// ==========================================================================
function openViewingModal(propId) {
  const prop = state.properties.find(p => p.id === propId);
  const propIdInput = document.getElementById('viewingPropId');
  const propTitleBadge = document.getElementById('viewingPropTitleBadge');

  if (prop && propIdInput && propTitleBadge) {
    propIdInput.value = prop.id;
    propTitleBadge.textContent = getPropText(prop.title);
  }

  const dateInput = document.getElementById('viewingDate');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
    dateInput.value = tomorrow.toISOString().split('T')[0];
  }

  const modal = document.getElementById('viewingModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

async function handleViewingSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');

  const payload = {
    property_id: form.property_id.value || null,
    client_name: form.client_name.value,
    client_phone: form.client_phone.value,
    client_email: form.client_email.value,
    preferred_date: form.preferred_date.value,
    preferred_time: form.preferred_time.value,
    viewing_mode: form.viewing_mode.value,
    notes: form.notes.value
  };

  try {
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${t('loading')}`;
    }

    const res = await fetch('/api/viewings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    if (json.success) {
      showToast(t('viewing_success_title'), 'success');
      form.reset();
      closeModals();
    } else {
      showToast(json.message || 'Error booking viewing', 'error');
    }
  } catch (err) {
    console.error('Failed to submit viewing:', err);
    showToast('Connection error. Please try again.', 'error');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fas fa-check-circle"></i> ${t('btn_submit_booking')}`;
    }
  }
}

// ==========================================================================
// Contact & Inquiry Form
// ==========================================================================
async function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');

  const payload = {
    name: form.name.value,
    email: form.email.value,
    phone: form.phone.value,
    subject: form.subject.value,
    message: form.message.value
  };

  try {
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${t('loading')}`;
    }

    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    if (json.success) {
      showToast(t('form_success'), 'success');
      form.reset();
    } else {
      showToast(json.message || 'Error submitting inquiry', 'error');
    }
  } catch (err) {
    console.error('Failed to submit inquiry:', err);
    showToast('Connection error. Please try again.', 'error');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fas fa-paper-plane"></i> ${t('form_submit')}`;
    }
  }
}

// ==========================================================================
// Wishlist Management
// ==========================================================================
function toggleWishlist(propId, event) {
  if (event) event.stopPropagation();

  const idx = state.wishlist.indexOf(propId);
  if (idx === -1) {
    state.wishlist.push(propId);
    showToast(t('btn_add_to_wishlist'), 'success');
  } else {
    state.wishlist.splice(idx, 1);
    showToast(t('btn_remove_from_wishlist'), 'warning');
  }

  localStorage.setItem('alhuda_wishlist', JSON.stringify(state.wishlist));
  updateWishlistUI();
  renderProperties();
}

function updateWishlistUI() {
  const badge = document.getElementById('wishlistBadgeCount');
  if (badge) {
    badge.textContent = state.wishlist.length;
    badge.style.display = state.wishlist.length > 0 ? 'flex' : 'none';
  }

  const wishlistContainer = document.getElementById('wishlistItemsContainer');
  const totalValEl = document.getElementById('wishlistTotalValue');

  if (!wishlistContainer) return;

  const wishlistedProps = state.properties.filter(p => state.wishlist.includes(p.id));

  if (wishlistedProps.length === 0) {
    wishlistContainer.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: var(--text-secondary);">
        <i class="far fa-heart" style="font-size: 2.5rem; color: var(--gold-primary); margin-bottom: 1rem; opacity: 0.5;"></i>
        <p>${t('wishlist_empty')}</p>
      </div>
    `;
    if (totalValEl) totalValEl.textContent = formatPrice(0);
    return;
  }

  let totalEGP = 0;
  wishlistContainer.innerHTML = wishlistedProps.map(prop => {
    totalEGP += (prop.price || 0);

    return `
      <div class="wishlist-item" onclick="openPropertyModal('${prop.id}')" style="cursor: pointer;">
        <img src="${getPropertyThumbnail(prop)}" alt="${getPropText(prop.title)}" class="wishlist-item-img" />
        <div class="wishlist-item-info">
          <h4 class="wishlist-item-title">${getPropText(prop.title)}</h4>
          <span class="wishlist-item-price">${formatPrice(prop.price)}</span>
          <button class="btn-luxury" style="margin-top: 0.5rem; padding: 0.4rem 0.8rem; font-size: 0.75rem;" onclick="event.stopPropagation(); openViewingModal('${prop.id}'); toggleWishlistDrawer();">
            <i class="fas fa-calendar-check"></i> ${t('btn_request_viewing')}
          </button>
        </div>
        <button class="wishlist-remove-btn" onclick="event.stopPropagation(); toggleWishlist('${prop.id}', event)">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `;
  }).join('');

  if (totalValEl) totalValEl.textContent = formatPrice(totalEGP);
}

function toggleWishlistDrawer() {
  const drawer = document.getElementById('wishlistDrawerBackdrop');
  if (drawer) {
    drawer.classList.toggle('active');
  }
}

// ==========================================================================
// Interactive Mortgage / Installment Calculator (in EGP)
// ==========================================================================
function initMortgageCalculator() {
  const priceSlider = document.getElementById('calcPriceSlider');
  const downSlider = document.getElementById('calcDownSlider');
  const termSlider = document.getElementById('calcTermSlider');
  const rateSlider = document.getElementById('calcRateSlider');

  if (priceSlider) priceSlider.addEventListener('input', calculateMortgage);
  if (downSlider) downSlider.addEventListener('input', calculateMortgage);
  if (termSlider) termSlider.addEventListener('input', calculateMortgage);
  if (rateSlider) rateSlider.addEventListener('input', calculateMortgage);

  calculateMortgage();
}

function calculateMortgage() {
  const priceSlider = document.getElementById('calcPriceSlider');
  const downSlider = document.getElementById('calcDownSlider');
  const termSlider = document.getElementById('calcTermSlider');
  const rateSlider = document.getElementById('calcRateSlider');

  if (!priceSlider || !downSlider || !termSlider || !rateSlider) return;

  const price = parseFloat(priceSlider.value) || 25000000;
  const downPct = parseFloat(downSlider.value) || 20;
  const years = parseFloat(termSlider.value) || 10;
  const annualRate = parseFloat(rateSlider.value) || 8.5;

  const downAmount = price * (downPct / 100);
  const loanPrincipal = price - downAmount;
  const monthlyRate = (annualRate / 100) / 12;
  const totalMonths = years * 12;

  let monthlyPayment = 0;
  if (monthlyRate > 0) {
    monthlyPayment = loanPrincipal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  } else {
    monthlyPayment = loanPrincipal / totalMonths;
  }

  const totalPaid = monthlyPayment * totalMonths;
  const totalInterest = totalPaid - loanPrincipal;

  // Update Display Labels
  document.getElementById('calcPriceVal').textContent = formatPrice(price);
  document.getElementById('calcDownVal').textContent = `${downPct}% (${formatPrice(downAmount)})`;
  document.getElementById('calcTermVal').textContent = `${years} ${t('calc_years')}`;
  document.getElementById('calcRateVal').textContent = `${annualRate}%`;

  document.getElementById('calcMonthlyPayment').textContent = formatPrice(monthlyPayment);
  document.getElementById('calcLoanAmount').textContent = formatPrice(loanPrincipal);
  document.getElementById('calcTotalInterest').textContent = formatPrice(totalInterest);
}

// ==========================================================================
// Toast Notifications
// ==========================================================================
function showToast(message, type = 'gold') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}" style="color: var(--gold-light);"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = '0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ==========================================================================
// Header Scroll Effect & Modals Close
// ==========================================================================
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

function closeModals() {
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.classList.remove('active');
  });
  document.body.style.overflow = '';
}

// Mobile Navigation Drawer Toggle
function toggleMobileNav() {
  const drawer = document.getElementById('mobileNavDrawer');
  const backdrop = document.getElementById('mobileDrawerBackdrop');
  if (drawer && backdrop) {
    const isActive = drawer.classList.contains('active');
    drawer.classList.toggle('active', !isActive);
    backdrop.classList.toggle('active', !isActive);
    document.body.style.overflow = !isActive ? 'hidden' : '';
  }
}
