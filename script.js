// Simple interactivity: slider, language toggle, cart, modals
document.addEventListener('DOMContentLoaded', ()=>{

  // Slider
  let slides = document.querySelectorAll('.slide');
  let idx = 0;
  const show = i=>{
    slides.forEach(s=>s.classList.remove('active'));
    slides[i].classList.add('active');
  }
  document.querySelector('.slide-btn.next').addEventListener('click', ()=>{ idx=(idx+1)%slides.length; show(idx); });
  document.querySelector('.slide-btn.prev').addEventListener('click', ()=>{ idx=(idx-1+slides.length)%slides.length; show(idx); });
  setInterval(()=>{ idx=(idx+1)%slides.length; show(idx); }, 6000);

  // Best sellers carousel simple scroll
  const cardWrap = document.querySelector('.cards');
  document.querySelectorAll('.cbtn.next').forEach(b=>b.addEventListener('click', ()=>{ cardWrap.scrollBy({left:220,behavior:'smooth'}) }));
  document.querySelectorAll('.cbtn.prev').forEach(b=>b.addEventListener('click', ()=>{ cardWrap.scrollBy({left:-220,behavior:'smooth'}) }));

  // Language toggle
  const langBtn = document.getElementById('langBtn');
  const tagline = document.querySelector('.tagline');
  let isJP=false;
  langBtn.addEventListener('click', ()=> {
    isJP = !isJP;
    if(isJP){ langBtn.textContent='EN'; tagline.textContent = tagline.dataset.ja; document.documentElement.lang='ja'; }
    else{ langBtn.textContent='日本語'; tagline.textContent = tagline.dataset.en; document.documentElement.lang='en'; }
  });

  // Cart logic using localStorage
  const cartBtn = document.getElementById('cartBtn');
  const cartModal = document.getElementById('cartModal');
  const cartList = document.getElementById('cartList');
  const cartCount = document.getElementById('cartCount');
  const cartTotal = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const checkoutModal = document.getElementById('checkoutModal');
  const closeCart = document.getElementById('closeCart');
  const closeCheckout = document.getElementById('closeCheckout');
  const addButtons = document.querySelectorAll('.add');

  function loadCart(){ return JSON.parse(localStorage.getItem('pekoCart')||'[]'); }
  function saveCart(c){ localStorage.setItem('pekoCart', JSON.stringify(c)); updateCartUI(); }
  function updateCartUI(){
    const c = loadCart();
    cartCount.textContent = c.reduce((s,i)=>s+i.qty,0);
    cartList.innerHTML = c.length? c.map((it,idx)=>`<div class="cart-row"><strong>${it.name}</strong> x ${it.qty} — ¥${(it.price*it.qty).toFixed(2)} <button data-idx="${idx}" class="remove">remove</button></div>`).join('') : '<p>Cart kosong</p>';
    cartTotal.textContent = c.reduce((s,i)=>s+i.price*i.qty,0).toFixed(2);
    // attach remove handlers
    cartList.querySelectorAll('.remove').forEach(b=>{
      b.addEventListener('click', e=>{
        const idx = Number(e.target.dataset.idx);
        const arr = loadCart();
        arr.splice(idx,1);
        saveCart(arr);
      });
    });
  }

  addButtons.forEach(b=>{
    b.addEventListener('click', e=>{
      const name = b.dataset.name;
      const price = Number(b.dataset.price);
      const arr = loadCart();
      const found = arr.find(x=>x.name===name);
      if(found) found.qty++;
      else arr.push({name,price,qty:1});
      saveCart(arr);
      // animate cart
      cartBtn.animate([{transform:'scale(1)'},{transform:'scale(1.08)'},{transform:'scale(1)'}],{duration:300});
    });
  });

  cartBtn.addEventListener('click', ()=>{ cartModal.setAttribute('aria-hidden','false'); updateCartUI(); });
  closeCart.addEventListener('click', ()=> cartModal.setAttribute('aria-hidden','true'));
  checkoutBtn.addEventListener('click', ()=>{ cartModal.setAttribute('aria-hidden','true'); checkoutModal.setAttribute('aria-hidden','false'); });

  closeCheckout.addEventListener('click', ()=> checkoutModal.setAttribute('aria-hidden','true'));

  // Checkout form
  document.getElementById('checkoutForm').addEventListener('submit', e=>{
    e.preventDefault();
    // in real site, post to server. Here we clear cart and show success
    localStorage.removeItem('pekoCart');
    document.getElementById('orderSuccess').style.display='block';
    document.getElementById('checkoutForm').style.display='none';
    updateCartUI();
  });

  // Audio controls
  const bgAudio = document.getElementById('bgAudio');
  const playBtn = document.getElementById('playAudio');
  playBtn.addEventListener('click', ()=>{
    if(bgAudio.paused){ bgAudio.play().catch(()=>{}); playBtn.textContent='⏸︎ Pause ambient'; }
    else{ bgAudio.pause(); playBtn.textContent='▶︎ Play ambient'; }
  });

  // Small fish swimming in footer - simple CSS animation toggled
  // (already animated via CSS keyframes)

  // Initialize UI
  updateCartUI();
});
