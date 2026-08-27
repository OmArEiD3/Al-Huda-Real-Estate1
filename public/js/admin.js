/**
 * Al Huda Real Estate - Executive Admin Dashboard Controller
 * Specialized for Sheikh Zayed City, Egypt | Currency: EGP
 */

const adminState = {
  properties: [],
  viewings: [],
  inquiries: [],
  stats: {},
  editingPropertyId: null
};

document.addEventListener('DOMContentLoaded', () => {
  initAdminNav();
  loadAllAdminData();
  initAdminForms();
});

// Re-render when language is switched
window.addEventListener('alhuda_language_changed', () => {
  renderPropertiesTable();
  renderViewingsTable();
  renderInquiriesTable();
  renderStatsView();
});

// ==========================================================================
// Admin Navigation & Tabs
// ==========================================================================
function initAdminNav() {
  document.querySelectorAll('.admin-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.admin-nav-item').forEach(i => i.classList.remove('active'));
      document.querySelectorAll('.admin-view-section').forEach(s => s.classList.remove('active'));

      item.classList.add('active');
      const targetView = document.getElementById(item.dataset.target);
      if (targetView) targetView.classList.add('active');
    });
  });
}

// ==========================================================================
// Load All Data
// ==========================================================================
async function loadAllAdminData() {
  await Promise.all([
    fetchStats(),
    fetchAdminProperties(),
    fetchAdminViewings(),
    fetchAdminInquiries()
  ]);
}

async function fetchStats() {
  try {
    const res = await fetch('/api/stats');
    const json = await res.json();
    if (json.success) {
      adminState.stats = json.data;
      renderStatsView();
    }
  } catch (err) {
    console.error('Failed to fetch stats:', err);
  }
}

async function fetchAdminProperties() {
  try {
    const res = await fetch('/api/properties');
    const json = await res.json();
    if (json.success) {
      adminState.properties = json.data;
      renderPropertiesTable();
    }
  } catch (err) {
    console.error('Failed to fetch properties:', err);
  }
}

async function fetchAdminViewings() {
  try {
    const res = await fetch('/api/viewings');
    const json = await res.json();
    if (json.success) {
      adminState.viewings = json.data;
      renderViewingsTable();

      const badge = document.getElementById('viewingsNavBadge');
      const pendingCount = adminState.viewings.filter(v => v.status === 'pending').length;
      if (badge) {
        badge.textContent = pendingCount;
        badge.style.display = pendingCount > 0 ? 'inline-block' : 'none';
      }
    }
  } catch (err) {
    console.error('Failed to fetch viewings:', err);
  }
}

async function fetchAdminInquiries() {
  try {
    const res = await fetch('/api/inquiries');
    const json = await res.json();
    if (json.success) {
      adminState.inquiries = json.data;
      renderInquiriesTable();

      const badge = document.getElementById('inquiriesNavBadge');
      const newCount = adminState.inquiries.filter(i => i.status === 'new').length;
      if (badge) {
        badge.textContent = newCount;
        badge.style.display = newCount > 0 ? 'inline-block' : 'none';
      }
    }
  } catch (err) {
    console.error('Failed to fetch inquiries:', err);
  }
}

// ==========================================================================
// Render Stats Overview
// ==========================================================================
function renderStatsView() {
  const s = adminState.stats;
  if (!s) return;

  const totalPropsEl = document.getElementById('kpiTotalProps');
  if (totalPropsEl) totalPropsEl.textContent = s.totalProperties || 0;

  const totalValueEl = document.getElementById('kpiTotalValue');
  if (totalValueEl) totalValueEl.textContent = formatPrice(s.totalPortfolioValueEGP || 0);

  const totalViewingsEl = document.getElementById('kpiTotalViewings');
  if (totalViewingsEl) totalViewingsEl.textContent = s.totalViewings || 0;

  const pendingViewingsEl = document.getElementById('kpiPendingViewings');
  if (pendingViewingsEl) pendingViewingsEl.textContent = s.pendingViewings || 0;

  // Breakdown render
  const breakdownContainer = document.getElementById('typeBreakdownList');
  if (breakdownContainer && s.typeBreakdown) {
    breakdownContainer.innerHTML = Object.entries(s.typeBreakdown).map(([type, count]) => `
      <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
        <span style="color: var(--text-dim); text-transform: capitalize;">${t('filter_type_' + type) || type}</span>
        <strong style="color: var(--admin-gold-light); font-weight: 700;">${count}</strong>
      </div>
    `).join('');
  }
}

// ==========================================================================
// Render Properties Table & CRUD
// ==========================================================================
function renderPropertiesTable() {
  const tbody = document.getElementById('propertiesTableBody');
  if (!tbody) return;

  if (adminState.properties.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem;">No properties found in Sheikh Zayed.</td></tr>`;
    return;
  }

  tbody.innerHTML = adminState.properties.map(prop => {
    const title = getPropText(prop.title);
    const district = getPropText(prop.location?.district);
    // Prefer an actual image for the thumbnail; fall back to the first image regardless
    const mainImg = (prop.images || []).find(url => !/\.(mp4|mov|webm|avi|mkv)(\?.*)?$/i.test(url))
      || prop.images?.[0]
      || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c';

    // Status pill
    let statusPill = `<span class="badge-tag badge-sale">${t('status_for_sale')}</span>`;
    if (prop.status === 'for-rent') {
      statusPill = `<span class="badge-tag badge-rent">${t('status_for_rent')}</span>`;
    } else if (prop.status === 'furnished-rent') {
      statusPill = `<span class="badge-tag badge-gold">${t('status_furnished_rent')}</span>`;
    }

    return `
      <tr>
        <td>
          <div class="table-prop-cell">
            <img src="${mainImg}" alt="${title}" class="table-prop-img" />
            <div>
              <div class="table-prop-title">${title}</div>
              <div class="table-prop-sub">${prop.id} • ${prop.specs?.area_sqm || 0} ${t('spec_sqm')}</div>
            </div>
          </div>
        </td>
        <td><strong style="color: var(--admin-gold-light);">${formatPrice(prop.price)}</strong></td>
        <td><span style="text-transform: capitalize;">${t('filter_type_' + prop.type) || prop.type}</span></td>
        <td>${district}</td>
        <td>${statusPill}</td>
        <td>${prop.featured ? '<i class="fas fa-star" style="color: var(--admin-gold);"></i>' : '<span style="color: var(--text-dim);">-</span>'}</td>
        <td>
          <div class="table-actions">
            <button class="btn-icon-sm" onclick="openEditPropertyModal('${prop.id}')" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-icon-sm delete" onclick="deleteProperty('${prop.id}')" title="Delete">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// ==========================================================================
// Render Viewing Bookings Table (طلبات المعاينة)
// ==========================================================================
function renderViewingsTable() {
  const tbody = document.getElementById('viewingsTableBody');
  if (!tbody) return;

  if (adminState.viewings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem;">No viewing requests yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = adminState.viewings.map(v => {
    const propTitle = getPropText(v.property_title);
    const dateFormatted = v.preferred_date || '-';
    const timeFormatted = v.preferred_time || '-';
    const modeLabel = v.viewing_mode === 'virtual-3d' ? '3D Virtual Tour' : 'In-Person (VIP)';

    const cleanPhone = v.client_phone ? v.client_phone.replace(/[^0-9]/g, '') : '';
    const whatsappMsg = encodeURIComponent(`مرحباً ${v.client_name}، نتواصل معكم من شركة عقارات الهدى بالشيخ زايد بخصوص طلب معاينة العقار (${propTitle}) المحدد في تاريخ ${dateFormatted} الساعة ${timeFormatted}. يسعدنا خدمتكم.`);

    return `
      <tr>
        <td>
          <div style="font-weight: 700; color: #fff;">${v.client_name}</div>
          <div style="font-size: 0.78rem; color: var(--text-dim);">${v.client_phone}</div>
          <div style="font-size: 0.75rem; color: var(--text-dim);">${v.client_email || ''}</div>
        </td>
        <td>
          <div style="font-weight: 600; max-width: 200px;" title="${propTitle}">${propTitle}</div>
          <div style="font-size: 0.75rem; color: var(--admin-gold-light);">${v.property_id || ''}</div>
        </td>
        <td>
          <div><i class="far fa-calendar-alt"></i> ${dateFormatted}</div>
          <div style="font-size: 0.78rem; color: var(--text-dim);"><i class="far fa-clock"></i> ${timeFormatted}</div>
        </td>
        <td>
          <span class="badge-tag ${v.viewing_mode === 'virtual-3d' ? 'badge-rent' : 'badge-gold'}">${modeLabel}</span>
        </td>
        <td>
          <select class="admin-select" style="padding: 0.4rem 0.6rem; font-size: 0.8rem; width: auto;" onchange="updateViewingStatus('${v.id}', this.value)">
            <option value="pending" ${v.status === 'pending' ? 'selected' : ''}>${t('admin_status_pending')}</option>
            <option value="confirmed" ${v.status === 'confirmed' ? 'selected' : ''}>${t('admin_status_confirmed')}</option>
            <option value="completed" ${v.status === 'completed' ? 'selected' : ''}>${t('admin_status_completed')}</option>
            <option value="cancelled" ${v.status === 'cancelled' ? 'selected' : ''}>${t('admin_status_cancelled')}</option>
          </select>
        </td>
        <td>
          <p style="font-size: 0.8rem; color: var(--text-dim); max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${v.notes || ''}">
            ${v.notes || '-'}
          </p>
        </td>
        <td>
          <div class="table-actions">
            ${cleanPhone ? `
              <a href="https://wa.me/${cleanPhone}?text=${whatsappMsg}" target="_blank" class="btn-icon-sm whatsapp" title="${t('admin_whatsapp_client')}">
                <i class="fab fa-whatsapp"></i>
              </a>
            ` : ''}
            <button class="btn-icon-sm delete" onclick="deleteViewing('${v.id}')" title="Delete">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

async function updateViewingStatus(id, newStatus) {
  try {
    const res = await fetch(`/api/viewings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    const json = await res.json();
    if (json.success) {
      showToast('Viewing status updated', 'success');
      fetchAdminViewings();
      fetchStats();
    }
  } catch (err) {
    console.error('Failed to update viewing status:', err);
  }
}

async function deleteViewing(id) {
  if (!confirm('Are you sure you want to delete this viewing request?')) return;

  try {
    const res = await fetch(`/api/viewings/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      showToast('Viewing request deleted', 'success');
      fetchAdminViewings();
      fetchStats();
    }
  } catch (err) {
    console.error('Failed to delete viewing:', err);
  }
}

// ==========================================================================
// Render Inquiries Table
// ==========================================================================
function renderInquiriesTable() {
  const tbody = document.getElementById('inquiriesTableBody');
  if (!tbody) return;

  if (adminState.inquiries.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2rem;">No inquiries received yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = adminState.inquiries.map(inq => {
    const cleanPhone = inq.phone ? inq.phone.replace(/[^0-9]/g, '') : '';
    const whatsappMsg = encodeURIComponent(`مرحباً ${inq.name}، نتواصل معكم من شركة عقارات الهدى بالشيخ زايد بخصوص استفساركم: ${inq.subject || ''}`);

    return `
      <tr>
        <td>
          <div style="font-weight: 700; color: #fff;">${inq.name}</div>
          <div style="font-size: 0.78rem; color: var(--text-dim);">${inq.email || ''}</div>
          <div style="font-size: 0.78rem; color: var(--admin-gold-light);">${inq.phone || ''}</div>
        </td>
        <td><strong>${inq.subject || 'General Inquiry'}</strong></td>
        <td>
          <p style="font-size: 0.85rem; color: var(--text-dim); max-width: 300px;">${inq.message}</p>
        </td>
        <td>
          <select class="admin-select" style="padding: 0.4rem 0.6rem; font-size: 0.8rem; width: auto;" onchange="updateInquiryStatus('${inq.id}', this.value)">
            <option value="new" ${inq.status === 'new' ? 'selected' : ''}>${t('admin_inquiry_new')}</option>
            <option value="in-progress" ${inq.status === 'in-progress' ? 'selected' : ''}>${t('admin_inquiry_progress')}</option>
            <option value="resolved" ${inq.status === 'resolved' ? 'selected' : ''}>${t('admin_inquiry_resolved')}</option>
          </select>
        </td>
        <td>
          <div style="font-size: 0.78rem; color: var(--text-dim);">
            ${new Date(inq.created_at).toLocaleDateString()}
          </div>
        </td>
        <td>
          <div class="table-actions">
            ${cleanPhone ? `
              <a href="https://wa.me/${cleanPhone}?text=${whatsappMsg}" target="_blank" class="btn-icon-sm whatsapp" title="${t('admin_whatsapp_client')}">
                <i class="fab fa-whatsapp"></i>
              </a>
            ` : ''}
            <button class="btn-icon-sm delete" onclick="deleteInquiry('${inq.id}')" title="Delete">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

async function updateInquiryStatus(id, newStatus) {
  try {
    const res = await fetch(`/api/inquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    const json = await res.json();
    if (json.success) {
      showToast('Inquiry status updated', 'success');
      fetchAdminInquiries();
      fetchStats();
    }
  } catch (err) {
    console.error('Failed to update inquiry status:', err);
  }
}

async function deleteInquiry(id) {
  if (!confirm('Delete this inquiry?')) return;

  try {
    const res = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      showToast('Inquiry deleted', 'success');
      fetchAdminInquiries();
      fetchStats();
    }
  } catch (err) {
    console.error('Failed to delete inquiry:', err);
  }
}

// ==========================================================================
// Property Modal (Add / Edit) Handlers (With Dropdowns & Clean Specs)
// ==========================================================================
function openAddPropertyModal() {
  adminState.editingPropertyId = null;
  const form = document.getElementById('propertyAdminForm');
  if (form) {
    form.reset();
    form.bedrooms.value = "3";
    form.bathrooms.value = "4";
    form.floors.value = "3";
    form.status.value = "for-sale";
  }

  const modalTitle = document.getElementById('propModalTitle');
  if (modalTitle) modalTitle.textContent = t('admin_add_property');

  document.querySelectorAll('#propertyAdminForm input[name="amenities"]').forEach(cb => {
    cb.checked = false;
  });

  const modal = document.getElementById('propertyAdminModal');
  if (modal) modal.classList.add('active');
}

function openEditPropertyModal(propId) {
  const prop = adminState.properties.find(p => p.id === propId);
  if (!prop) return;

  adminState.editingPropertyId = propId;
  const form = document.getElementById('propertyAdminForm');
  if (!form) return;

  const modalTitle = document.getElementById('propModalTitle');
  if (modalTitle) modalTitle.textContent = t('admin_edit_property');

  // Fill Inputs
  form.title_ar.value = prop.title?.ar || '';
  form.title_en.value = prop.title?.en || '';
  form.desc_ar.value = prop.description?.ar || '';
  form.desc_en.value = prop.description?.en || '';
  form.price.value = prop.price || '';
  form.type.value = prop.type || 'villa';
  form.status.value = prop.status || 'for-sale';
  form.district_ar.value = prop.location?.district?.ar || '';
  form.district_en.value = prop.location?.district?.en || '';
  form.address_ar.value = prop.location?.address?.ar || '';
  form.address_en.value = prop.location?.address?.en || '';

  // Select dropdowns for Bedrooms, Bathrooms, Floors
  form.bedrooms.value = String(prop.specs?.bedrooms || '3');
  form.bathrooms.value = String(prop.specs?.bathrooms || '3');
  form.floors.value = String(prop.specs?.floors || '2');
  form.area_sqm.value = prop.specs?.area_sqm || '';

  form.images.value = [...(prop.images || []), ...(prop.videos || [])].join('\n');
  form.featured.checked = Boolean(prop.featured);
  form.badge_ar.value = prop.badge?.ar || '';
  form.badge_en.value = prop.badge?.en || '';

  // Check amenities
  document.querySelectorAll('#propertyAdminForm input[name="amenities"]').forEach(cb => {
    cb.checked = Array.isArray(prop.amenities) && prop.amenities.includes(cb.value);
  });

  const modal = document.getElementById('propertyAdminModal');
  if (modal) modal.classList.add('active');
}

function initAdminForms() {
  const form = document.getElementById('propertyAdminForm');
  if (form) {
    form.addEventListener('submit', handleSaveProperty);
  }

  // Close modals on click outside
  document.querySelectorAll('.admin-modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeAdminModals();
    });
  });
}

async function handleSaveProperty(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');

  // Collect checked amenities
  const checkedAmenities = [];
  form.querySelectorAll('input[name="amenities"]:checked').forEach(cb => {
    checkedAmenities.push(cb.value);
  });

  // 🔼 Upload pending local files first, then collect image/video URLs separately
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fas fa-cloud-upload-alt fa-spin"></i> جاري رفع الملفات...`;
  }

  // Upload local files to server (already split into images vs videos by type)
  const uploaded = await uploadPendingFiles();
  let allImages = [...uploaded.images];
  let allVideos = [...uploaded.videos];

  // Also collect any manual URLs from the textarea, splitting by file extension
  const textareaUrls = (form.images.value || '')
    .split('\n')
    .map(url => url.trim())
    .filter(url => url.length > 0);

  const VIDEO_EXT_REGEX = /\.(mp4|mov|webm|avi|mkv)(\?.*)?$/i;
  textareaUrls.forEach(url => {
    if (VIDEO_EXT_REGEX.test(url)) {
      allVideos.push(url);
    } else {
      allImages.push(url);
    }
  });

  // Fallback placeholder image if no images provided
  if (allImages.length === 0 && allVideos.length === 0) {
    allImages = ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c'];
  }

  const payload = {
    title: { ar: form.title_ar.value, en: form.title_en.value },
    description: { ar: form.desc_ar.value, en: form.desc_en.value },
    price: Number(form.price.value),
    currency: 'EGP',
    type: form.type.value,
    status: form.status.value,
    location: {
      city: { ar: 'مدينة الشيخ زايد', en: 'Sheikh Zayed City' },
      district: { ar: form.district_ar.value, en: form.district_en.value },
      country: { ar: 'مصر', en: 'Egypt' },
      address: { ar: form.address_ar.value, en: form.address_en.value }
    },
    specs: {
      bedrooms: Number(form.bedrooms.value) || 3,
      bathrooms: Number(form.bathrooms.value) || 3,
      area_sqm: Number(form.area_sqm.value) || 0,
      floors: Number(form.floors.value) || 1
    },
    amenities: checkedAmenities,
    images: allImages,
    videos: allVideos,
    featured: form.featured.checked,
    badge: { ar: form.badge_ar.value, en: form.badge_en.value }
  };

  try {
    if (submitBtn) {
      submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...`;
    }

    const isEdit = Boolean(adminState.editingPropertyId);
    const endpoint = isEdit ? `/api/properties/${adminState.editingPropertyId}` : '/api/properties';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    if (json.success) {
      showToast(isEdit ? 'تم تعديل العقار بالشيخ زايد بنجاح! ✅' : 'تم إضافة العقار بالشيخ زايد بنجاح! ✅', 'success');
      closeAdminModals();
      fetchAdminProperties();
      fetchStats();
    } else {
      showToast(json.message || 'خطأ في حفظ العقار', 'error');
    }
  } catch (err) {
    console.error('Failed to save property:', err);
    showToast('فشل الاتصال بالخادم. يرجى المحاولة مرة أخرى.', 'error');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fas fa-save"></i> <span data-i18n="btn_save_property">حفظ العقار</span>`;
    }
  }
}

async function deleteProperty(propId) {
  if (!confirm(t('admin_delete_confirm'))) return;

  try {
    const res = await fetch(`/api/properties/${propId}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      showToast('تم حذف العقار بنجاح', 'success');
      fetchAdminProperties();
      fetchStats();
    }
  } catch (err) {
    console.error('Failed to delete property:', err);
  }
}

// ==========================================================================
// Database Tools: Export & Reset
// ==========================================================================
function exportDatabaseJSON() {
  const data = {
    properties: adminState.properties,
    viewings: adminState.viewings,
    inquiries: adminState.inquiries,
    exported_at: new Date().toISOString()
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `al_huda_zayed_backup_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast('تم تحميل نسخة احتياطية من بيانات الشيخ زايد', 'success');
}

async function resetSampleDatabase() {
  if (!confirm('هل تريد بالتأكيد استعادة بيانات عقارات الشيخ زايد الافتراضية؟')) return;

  try {
    const res = await fetch('/api/reset', { method: 'POST' });
    const json = await res.json();
    if (json.success) {
      showToast('تمت استعادة بيانات الشيخ زايد بنجاح', 'success');
      loadAllAdminData();
    }
  } catch (err) {
    console.error('Failed to reset database:', err);
  }
}

function closeAdminModals() {
  document.querySelectorAll('.admin-modal-backdrop').forEach(modal => {
    modal.classList.remove('active');
  });
  // Reset upload state when closing
  uploadedFileUrls = [];
  pendingLocalFiles = [];
  const previewGrid = document.getElementById('mediaPreviewGrid');
  if (previewGrid) {
    previewGrid.innerHTML = '';
    previewGrid.style.display = 'none';
  }
  const fileInput = document.getElementById('mediaFileInput');
  if (fileInput) fileInput.value = '';
}

// ==========================================================================
// Helper: Format Price in EGP
// ==========================================================================
function formatPrice(amount) {
  if (!amount && amount !== 0) return '0 ج.م';
  const num = Number(amount);
  if (isNaN(num)) return '0 ج.م';
  if (num >= 1_000_000) {
    const millions = (num / 1_000_000).toFixed(2).replace(/\.?0+$/, '');
    return `${millions} مليون ج.م`;
  }
  return num.toLocaleString('ar-EG') + ' ج.م';
}

// ==========================================================================
// Helper: Get Bilingual Text (AR / EN based on current lang)
// ==========================================================================
function getPropText(obj) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  const lang = document.documentElement.lang || 'ar';
  return obj[lang] || obj.ar || obj.en || '';
}

// ==========================================================================
// Toast Notification System (for admin.html which doesn't load app.js)
// ==========================================================================
function showToast(message, type = 'gold') {
  // Remove existing toasts
  const existing = document.querySelectorAll('.admin-toast-notification');
  existing.forEach(t => t.remove());

  const colorMap = {
    success: { bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.45)', color: '#34d399', icon: 'fa-check-circle' },
    error:   { bg: 'rgba(239, 68, 68, 0.15)',  border: 'rgba(239, 68, 68, 0.45)',  color: '#f87171', icon: 'fa-exclamation-circle' },
    warning: { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.45)', color: '#fbbf24', icon: 'fa-exclamation-triangle' },
    gold:    { bg: 'rgba(212, 175, 55, 0.15)', border: 'rgba(212, 175, 55, 0.45)', color: '#fbe6a2', icon: 'fa-star' }
  };
  const style = colorMap[type] || colorMap.gold;

  const toast = document.createElement('div');
  toast.className = 'admin-toast-notification';
  toast.style.cssText = `
    position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
    background: ${style.bg}; border: 1px solid ${style.border};
    backdrop-filter: blur(18px); color: ${style.color};
    padding: 0.9rem 1.6rem; border-radius: 14px;
    display: flex; align-items: center; gap: 0.65rem;
    font-size: 0.92rem; font-weight: 700;
    box-shadow: 0 12px 35px rgba(0,0,0,0.5);
    z-index: 99999; white-space: nowrap;
    animation: toastIn 0.35s cubic-bezier(0.22,1,0.36,1) forwards;
  `;
  toast.innerHTML = `<i class="fas ${style.icon}"></i> ${message}`;

  if (!document.querySelector('#admin-toast-keyframes')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'admin-toast-keyframes';
    styleEl.textContent = `
      @keyframes toastIn { from { opacity:0; transform: translateX(-50%) translateY(20px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }
      @keyframes toastOut { from { opacity:1; } to { opacity:0; transform: translateX(-50%) translateY(20px); } }
    `;
    document.head.appendChild(styleEl);
  }

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==========================================================================
// ✨ Local File Upload System (Drag & Drop + Click to Upload + Preview)
// ==========================================================================

// Track uploaded file server URLs and pending local files (not yet uploaded)
let uploadedFileUrls = [];
let pendingLocalFiles = [];

/**
 * Called when user selects files via <input type="file">
 */
function handleLocalFilesSelected(files) {
  if (!files || files.length === 0) return;
  addFilesToQueue(Array.from(files));
}

/**
 * Add files to the pending queue and render previews
 */
function addFilesToQueue(files) {
  const validFiles = files.filter(f => {
    const ext = f.name.split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'mp4', 'mov', 'webm'].includes(ext);
  });

  if (validFiles.length === 0) {
    showToast('الرجاء اختيار صور أو فيديوهات فقط (JPG, PNG, WEBP, MP4, MOV)', 'warning');
    return;
  }

  validFiles.forEach(file => {
    pendingLocalFiles.push(file);
    renderFilePreview(file, pendingLocalFiles.length - 1);
  });

  const previewGrid = document.getElementById('mediaPreviewGrid');
  if (previewGrid) previewGrid.style.display = 'grid';
}

/**
 * Render a single file preview card in the grid
 */
function renderFilePreview(file, index) {
  const previewGrid = document.getElementById('mediaPreviewGrid');
  if (!previewGrid) return;

  const card = document.createElement('div');
  card.className = 'media-preview-card';
  card.dataset.fileIndex = index;

  const isVideo = file.type.startsWith('video/');
  const objectUrl = URL.createObjectURL(file);

  if (isVideo) {
    card.innerHTML = `
      <video src="${objectUrl}" style="width:100%;height:100%;object-fit:cover;" muted></video>
      <div class="media-type-badge"><i class="fas fa-video"></i> فيديو</div>
      <button class="media-remove-btn" onclick="removeFilePreview(this, '${objectUrl}')" type="button">
        <i class="fas fa-times"></i>
      </button>
    `;
  } else {
    card.innerHTML = `
      <img src="${objectUrl}" alt="preview" style="width:100%;height:100%;object-fit:cover;" />
      <div class="media-type-badge"><i class="fas fa-image"></i> صورة</div>
      <button class="media-remove-btn" onclick="removeFilePreview(this, '${objectUrl}')" type="button">
        <i class="fas fa-times"></i>
      </button>
    `;
  }

  previewGrid.appendChild(card);
}

/**
 * Remove a file preview card from the grid
 */
function removeFilePreview(btn, objectUrl) {
  const card = btn.closest('.media-preview-card');
  const fileIndex = parseInt(card.dataset.fileIndex, 10);

  // Remove from pendingLocalFiles array
  if (!isNaN(fileIndex) && pendingLocalFiles[fileIndex]) {
    pendingLocalFiles[fileIndex] = null; // Mark as removed
  }

  URL.revokeObjectURL(objectUrl);
  card.remove();

  // Hide grid if empty
  const previewGrid = document.getElementById('mediaPreviewGrid');
  if (previewGrid && previewGrid.children.length === 0) {
    previewGrid.style.display = 'none';
  }
}

/**
 * Upload all pending local files to the server before saving property
 * Returns array of server-side URLs
 */
// Returns { images: [...], videos: [...] } separating uploaded server URLs by file type,
// matching the original File objects (order-preserving, same as multer's req.files order).
async function uploadPendingFiles() {
  const filesToUpload = pendingLocalFiles.filter(f => f !== null);
  if (filesToUpload.length === 0) return { images: [], videos: [] };

  const formData = new FormData();
  filesToUpload.forEach(file => {
    formData.append('media_files', file);
  });

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const result = await response.json();
    if (result.success && Array.isArray(result.urls)) {
      showToast(`✅ تم رفع ${result.urls.length} ملف بنجاح`, 'success');

      const images = [];
      const videos = [];
      result.urls.forEach((url, idx) => {
        const originalFile = filesToUpload[idx];
        const isVideo = (originalFile && originalFile.type && originalFile.type.startsWith('video/'))
          || /\.(mp4|mov|webm|avi|mkv)$/i.test(url);
        if (isVideo) {
          videos.push(url);
        } else {
          images.push(url);
        }
      });
      return { images, videos };
    } else {
      showToast(result.message || 'فشل رفع الملفات', 'error');
      return { images: [], videos: [] };
    }
  } catch (err) {
    console.error('File upload error:', err);
    showToast('خطأ في الاتصال أثناء رفع الملفات', 'error');
    return { images: [], videos: [] };
  }
}

/**
 * Initialize Drag & Drop on the dropzone
 */
document.addEventListener('DOMContentLoaded', () => {
  const dropzone = document.getElementById('mediaDropzone');
  if (!dropzone) return;

  ['dragenter', 'dragover'].forEach(evt => {
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('dragover');
    });
  });

  ['dragleave', 'dragend', 'drop'].forEach(evt => {
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('dragover');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      addFilesToQueue(Array.from(files));
    }
  });
});
