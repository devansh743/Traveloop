// =============================
// SCREEN 10: PACKING CHECKLIST
// =============================

Screens.packing = function() {
  const el = document.getElementById('screen-packing');
  const items = WL.packingList;
  const checkedCount = items.filter(i => i.checked).length;
  const pct = items.length ? Math.round((checkedCount / items.length) * 100) : 0;

  el.innerHTML = `
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:14px">
    <div>
      <h1 style="font-size:26px;font-weight:800;margin-bottom:4px">🎒 Packing Checklist</h1>
      <p style="color:var(--text-secondary)">${checkedCount} of ${items.length} items packed</p>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn btn-secondary btn-sm" onclick="PackingScreen.resetAll()">🔄 Reset All</button>
      <button class="btn btn-primary" onclick="PackingScreen.showAddModal()">+ Add Item</button>
    </div>
  </div>

  <!-- Progress -->
  <div class="card" style="margin-bottom:24px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <span style="font-size:15px;font-weight:600">Packing Progress</span>
      <span style="font-size:24px;font-weight:800;color:${pct === 100 ? 'var(--success)' : 'var(--primary-light)'}">
        ${pct}% ${pct === 100 ? '✅' : ''}
      </span>
    </div>
    <div class="progress-bar" style="height:12px">
      <div class="progress-fill" style="width:${pct}%;${pct===100?'background:linear-gradient(90deg,var(--success),#059669)':''}"></div>
    </div>
  </div>

  <!-- Category Tabs -->
  <div class="tabs" style="margin-bottom:22px;flex-wrap:wrap">
    <button class="tab active" onclick="PackingScreen.filterCat('all',this)">All (${items.length})</button>
    ${WL.packingCategories.map(cat => {
      const cnt = items.filter(i => i.category === cat).length;
      return cnt ? `<button class="tab" onclick="PackingScreen.filterCat('${cat}',this)">${cat} (${cnt})</button>` : '';
    }).join('')}
  </div>

  <!-- Items -->
  <div id="packingItems">
    ${renderPackingItems(items)}
  </div>

  <!-- Add Item Modal -->
  <div class="modal-overlay" id="packModal">
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">Add Packing Item</h3>
        <button class="modal-close" onclick="document.getElementById('packModal').classList.remove('open')">✕</button>
      </div>
      <div class="form-group">
        <label class="form-label">Item Name</label>
        <input type="text" class="form-input" id="packItemName" placeholder="e.g. Sunscreen" />
      </div>
      <div class="form-group">
        <label class="form-label">Category</label>
        <select class="form-select" id="packItemCat">
          ${WL.packingCategories.map(c => `<option>${c}</option>`).join('')}
        </select>
      </div>
      <div style="display:flex;gap:10px">
        <button class="btn btn-primary btn-block" onclick="PackingScreen.addItem()">Add Item</button>
        <button class="btn btn-secondary" onclick="document.getElementById('packModal').classList.remove('open')">Cancel</button>
      </div>
    </div>
  </div>`;
};

function renderPackingItems(items, cat = 'all') {
  const filtered = cat === 'all' ? items : items.filter(i => i.category === cat);

  if (!filtered.length) return `<div class="empty-state">
    <div class="empty-icon">🎒</div>
    <div class="empty-title">No items here</div>
    <button class="btn btn-primary" onclick="PackingScreen.showAddModal()">Add Item</button>
  </div>`;

  // Group by category
  const groups = {};
  filtered.forEach(item => {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  });

  return Object.entries(groups).map(([cat, catItems]) => `
  <div style="margin-bottom:20px">
    <div style="font-size:13px;font-weight:700;color:var(--text-secondary);text-transform:uppercase;
      letter-spacing:0.8px;margin-bottom:10px;display:flex;align-items:center;gap:8px">
      ${getCatIcon(cat)} ${cat}
      <span class="badge badge-primary">${catItems.filter(i=>i.checked).length}/${catItems.length}</span>
    </div>
    ${catItems.map(item => `
    <div class="checklist-item ${item.checked ? 'checked' : ''}" id="pack-${item.id}">
      <input type="checkbox" ${item.checked ? 'checked' : ''} id="chk-${item.id}"
        onchange="PackingScreen.toggle('${item.id}')" />
      <label for="chk-${item.id}">${item.item}</label>
      <button class="checklist-del" onclick="PackingScreen.remove('${item.id}')">🗑️</button>
    </div>`).join('')}
  </div>`).join('');
}

function getCatIcon(cat) {
  const icons = { Clothing:'👕', Documents:'📄', Electronics:'💻', Toiletries:'🧴', Medications:'💊', Other:'📦' };
  return icons[cat] || '📦';
}

window.PackingScreen = {
  currentCat: 'all',

  toggle(id) {
    const item = WL.packingList.find(i => i.id === id);
    if (item) { item.checked = !item.checked; WL.save(); }
    Screens.packing();
  },

  remove(id) {
    WL.packingList = WL.packingList.filter(i => i.id !== id);
    WL.save();
    Screens.packing();
  },

  resetAll() {
    WL.packingList.forEach(i => i.checked = false);
    WL.save();
    Screens.packing();
    showToast('Checklist reset!');
  },

  filterCat(cat, btn) {
    this.currentCat = cat;
    document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('packingItems').innerHTML = renderPackingItems(WL.packingList, cat);
  },

  showAddModal() {
    document.getElementById('packModal').classList.add('open');
    document.getElementById('packItemName').focus();
  },

  addItem() {
    const name = document.getElementById('packItemName').value.trim();
    const cat = document.getElementById('packItemCat').value;
    if (!name) { showToast('Please enter an item name', 'error'); return; }
    WL.packingList.push({ id: 'p' + genId(), item: name, category: cat, checked: false });
    WL.save();
    document.getElementById('packModal').classList.remove('open');
    Screens.packing();
    showToast(`✅ "${name}" added to ${cat}`);
  }
};
