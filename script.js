// Elementos DOM
const homePageSearchInput = document.getElementById("homePageSearchInputID");
const homePageSearchButton = document.getElementById("homePageSearchButtonID");
const homePageProdutosDiv = document.getElementById("homePageProdutosDivID");
const homePageProdutosUl = document.getElementById("homePageProdutosUlID");
const themeToggle = document.getElementById("homePageModoEscuroClaroID");
const clearSearchBtn = document.getElementById("clearSearch");
const showHistoryBtn = document.getElementById("showHistory");
const pesquisasRecentes = document.getElementById("homePagePesquisasRecentesID");
const listaPesquisasRecentes = document.getElementById("pesquisasRecentesItemsID");
const carouselIndicators = document.getElementById("carouselIndicators");

// Estado da aplicação
let searchInputText = '';
let favoriteStores = JSON.parse(localStorage.getItem('favoriteStores')) || {};
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
let autoScrollInterval;
let currentCarouselIndex = 0;
const originalItemsCount = 5; // Número original de lojas

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
  initializeFavorites();
  updateCarouselIndicators();
  loadSearchHistory();
  
  // Verificar preferência de tema
  if (localStorage.getItem('darkMode') === 'enabled') {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
});

// Alternar tema claro/escuro
themeToggle.addEventListener('click', function() {
  if (document.body.classList.contains('dark-mode')) {
    disableDarkMode();
  } else {
    enableDarkMode();
  }
});

function enableDarkMode() {
  document.body.classList.add('dark-mode');
  localStorage.setItem('darkMode', 'enabled');
  themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

function disableDarkMode() {
  document.body.classList.remove('dark-mode');
  localStorage.setItem('darkMode', null);
  themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
}

// Mostrar/ocultar lista de produtos ao digitar
homePageSearchInput.addEventListener("keyup", function() {
    searchInputText = homePageSearchInput.value;
    if (event.key === 'Enter') {
      // homePageProdutosDiv.style.display = searchInputText !== "" ? "flex" : "none";
      homePageProdutosDiv.style.display = "flex";
    }  
    else if (searchInputText == "") {
      // homePageProdutosDiv.classList.add('fade-in');
      homePageProdutosDiv.style.display = "none";
    }
  });
homePageSearchButton.addEventListener('click', function() {
  if (searchInputText !== "") {
    homePageProdutosDiv.style.display = "flex";
  }
})

// Limpar pesquisa
clearSearchBtn.addEventListener('click', function() {
  homePageSearchInput.value = '';
  searchInputText = '';
  homePageProdutosDiv.style.display = 'none';
  pesquisasRecentes.style.display = 'none';
});

// Mostrar histórico de pesquisas
showHistoryBtn.addEventListener('click', function() {
  if (searchHistory.length > 0) {
    pesquisasRecentes.style.display = pesquisasRecentes.style.display === 'block' ? 'none' : 'block';
  } else {
    alert('Nenhum histórico de pesquisa disponível.');
  }
});

// Adicionar eventos de clique duplo para cada item da lista
function attachLiListeners() {
  const homePageProdutosLi = homePageProdutosUl.querySelectorAll("li");
  homePageProdutosLi.forEach((produto) => {
    // Remover event listeners existentes para evitar duplicação
    produto.replaceWith(produto.cloneNode(true));
  });
  
  // Adicionar novos event listeners
  const newHomePageProdutosLi = homePageProdutosUl.querySelectorAll("li");
  newHomePageProdutosLi.forEach((produto) => {
    produto.addEventListener("dblclick", function() {
      if (searchInputText && searchInputText.trim() !== "") {
        // Salvar no histórico
        addToSearchHistory(searchInputText);
        
        // Redirecionar
        redirectToSite(this.id, searchInputText);
      }
    });
  });
}
attachLiListeners();

// Função para redirecionar para os sites
function redirectToSite(siteId, searchInputText) {
  let URL;
  switch (siteId) {
    case "amazonProdutos":
      URL = `https://www.amazon.com.br/s?k=${encodeURIComponent(searchInputText)}`;
      break;
    case "mercadolivreProdutos":
      URL = `https://www.mercadolivre.com.br/search?as_word=${encodeURIComponent(searchInputText)}`;
      break;
    case "americanasProdutos":
      URL = `https://www.americanas.com.br/busca/${encodeURIComponent(searchInputText)}`;
      break;
    case "casasbahiaProdutos":
      URL = `https://www.casasbahia.com.br/busca/${encodeURIComponent(searchInputText)}`;
      break;
    case "magazineluisaProdutos":
      URL = `https://www.magazineluiza.com.br/busca/${encodeURIComponent(searchInputText)}`;
      break;
    default:
      URL = '#';
  }
  window.open(URL, "_blank");
}

// Clonar itens para efeito infinito
function cloneItems() {
  const items = Array.from(homePageProdutosUl.children).slice(0, originalItemsCount);
  items.forEach((item) => {
    const clone = item.cloneNode(true);
    homePageProdutosUl.appendChild(clone);
  });
  attachLiListeners();
  initializeFavorites();
}
cloneItems();

// Scroll com roda do mouse
homePageProdutosUl.addEventListener("wheel", (e) => {
  e.preventDefault();
  homePageProdutosUl.scrollLeft += e.deltaY * 1.5;
  updateCarouselIndicators();
});

// Efeito de loop infinito
homePageProdutosUl.addEventListener("scroll", () => {
  const scrollWidth = homePageProdutosUl.scrollWidth / 2; // Porque clonamos os itens
  const scrollLeft = homePageProdutosUl.scrollLeft;
  const clientWidth = homePageProdutosUl.clientWidth;
  
  // Atualizar indicadores baseado na posição de scroll
  const scrollPercentage = scrollLeft / (scrollWidth - clientWidth);
  currentCarouselIndex = Math.floor(scrollPercentage * originalItemsCount);
  updateCarouselIndicators();
  
  // Loop infinito
  if (scrollLeft >= scrollWidth) {
    homePageProdutosUl.scrollLeft = 0;
  } else if (scrollLeft <= 0) {
    homePageProdutosUl.scrollLeft = scrollWidth - clientWidth;
  }
});

// Inicializar favoritos
function initializeFavorites() {
  const favoriteBtns = document.querySelectorAll('.favorite-btn');
  favoriteBtns.forEach(btn => {
    const store = btn.dataset.store;
    // Restaurar estado dos favoritos
    btn.innerHTML = favoriteStores[store] ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
    btn.classList.toggle('active', favoriteStores[store]);
    
    // Remover event listeners antigos
    btn.replaceWith(btn.cloneNode(true));
  });
  
  // Adicionar novos event listeners
  const newFavoriteBtns = document.querySelectorAll('.favorite-btn');
  newFavoriteBtns.forEach(btn => {
    const store = btn.dataset.store;
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      favoriteStores[store] = !favoriteStores[store];
      btn.innerHTML = favoriteStores[store] ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
      btn.classList.toggle('active', favoriteStores[store]);
      localStorage.setItem('favoriteStores', JSON.stringify(favoriteStores));
    });
  });
}

// Atualizar indicadores do carrossel
function updateCarouselIndicators() {
  carouselIndicators.innerHTML = '';
  for (let i = 0; i < originalItemsCount; i++) {
    const indicator = document.createElement('div');
    indicator.classList.add('indicator');
    if (i === currentCarouselIndex) indicator.classList.add('active');
    
    indicator.addEventListener('click', () => {
      const itemWidth = homePageProdutosUl.scrollWidth / (originalItemsCount * 2);
      const scrollPos = itemWidth * i * 2;
      homePageProdutosUl.scrollTo({ left: scrollPos, behavior: 'smooth' });
    });
    
    carouselIndicators.appendChild(indicator);
  }
}

// Adicionar ao histórico de pesquisas
function addToSearchHistory(term) {
  // Não adicionar se já existir ou estiver vazio
  if (!term.trim() || searchHistory.includes(term)) return;
  
  // Adicionar no início da lista
  searchHistory.unshift(term);
  
  // Manter apenas os 5 últimos
  if (searchHistory.length > 5) {
    searchHistory.pop();
  }
  
  // Salvar e atualizar
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  loadSearchHistory();
}

// Carregar histórico de pesquisas
function loadSearchHistory() {
  listaPesquisasRecentes.innerHTML = '';
  
  if (searchHistory.length === 0) {
    pesquisasRecentes.style.display = 'none';
    return;
  }
  
  searchHistory.forEach(term => {
    const item = document.createElement('div');
    item.classList.add('recent-item');
    item.textContent = term;
    
    item.addEventListener('click', () => {
      homePageSearchInput.value = term;
      searchInputText = term;
      homePageProdutosDiv.style.display = 'flex';
      homePageProdutosDiv.classList.add('fade-in');
      pesquisasRecentes.style.display = 'none';
    });
    
    listaPesquisasRecentes.appendChild(item);
  });
}

// Auto-scroll com pausa ao passar o mouse
function startAutoScroll() {
  autoScrollInterval = setInterval(() => {
    homePageProdutosUl.scrollLeft += 1;
    
    // Atualizar indicadores durante o auto-scroll
    const scrollWidth = homePageProdutosUl.scrollWidth / 2;
    const scrollLeft = homePageProdutosUl.scrollLeft;
    const clientWidth = homePageProdutosUl.clientWidth;
    const scrollPercentage = scrollLeft / (scrollWidth - clientWidth);
    currentCarouselIndex = Math.floor(scrollPercentage * originalItemsCount);
    updateCarouselIndicators();
    
    // Reiniciar quando chegar ao final
    if (homePageProdutosUl.scrollLeft >= scrollWidth) {
      homePageProdutosUl.scrollLeft = 0;
    }
  }, 30);
}

homePageProdutosUl.addEventListener("mouseenter", () => {
  clearInterval(autoScrollInterval);
});

homePageProdutosUl.addEventListener("mouseleave", () => {
  startAutoScroll();
});

// Iniciar auto-scroll
startAutoScroll();