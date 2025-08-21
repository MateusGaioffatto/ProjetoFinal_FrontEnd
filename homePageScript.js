// const homePageSearchInput = document.getElementById("homePageSearchInputID");
// const homePageProdutosDiv = document.getElementById("homePageProdutosDivID");

// const homePageProdutosUl = document.getElementById("homePageProdutosUlID");
// const homePageProdutosLi = document.querySelectorAll(".homePageProdutosDiv li");
//     const produtosAmazon = homePageProdutosLi[0];
//     const produtosMercadoLivre = homePageProdutosLi[1];
//     const produtosAmericanas = homePageProdutosLi[2];
//     const produtosCasasBahia = homePageProdutosLi[3];
//     const produtosMagazineLuisa = homePageProdutosLi[4];

// let searchInputText;
// homePageSearchInput.addEventListener('input', function() {
//     if (homePageProdutosDiv.style.display === "none") {searchInputText = '';}
//     searchInputText = homePageSearchInput.value;
//     homePageProdutosDiv.style.display = searchInputText !== '' ? "flex" : "none";
// })

// homePageProdutosLi.forEach(produto => {
//     produto.addEventListener('dblclick', function() {
//         if (searchInputText && searchInputText.trim() !== '') {
//             let URL;
//             switch (this.id) {
//                 case 'amazonProdutos': URL = `https://www.amazon.com.br/s?k=${encodeURIComponent(searchInputText)}`; break;
//                 case 'mercadolivreProdutos': URL = `https://www.mercadolivre.com.br/search?as_word=${encodeURIComponent(searchInputText)}`; break;
//                 case 'americanasProdutos': URL = `https://www.americanas.com.br/busca/${encodeURIComponent(searchInputText)}`; break;
//                 case 'casasbahiaProdutos': URL = `https://www.casasbahia.com.br/busca/${encodeURIComponent(searchInputText)}`; break;
//                 case 'magazineluisaProdutos': URL = `https://www.magazineluiza.com.br/busca/${encodeURIComponent(searchInputText)}`; break;
//                 default: URL = '#';
//             }
//             window.open(URL, '_blank');
//         }
//     });
// });

const homePageSearchInput = document.getElementById("homePageSearchInputID");
const homePageProdutosDiv = document.getElementById("homePageProdutosDivID");
const homePageProdutosUl = document.getElementById("homePageProdutosUlID");

let searchInputText;

// Show/hide product list on typing
homePageSearchInput.addEventListener("input", function () {
  searchInputText = homePageSearchInput.value;
  homePageProdutosDiv.style.display = searchInputText !== "" ? "flex" : "none";
});

// Attach redirect to each <li>
function attachLiListeners() {
  const homePageProdutosLi = homePageProdutosUl.querySelectorAll("li");
  homePageProdutosLi.forEach((produto) => {
    produto.addEventListener("dblclick", function () {
      if (searchInputText && searchInputText.trim() !== "") {
        redirectToSite(this.id, searchInputText);
      }
    });
  });
}
attachLiListeners();

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
      URL = "#";
  }
  window.open(URL, "_blank");
}

// ----------------------
// CAROUSEL LOGIC
// ----------------------

// 1. Clone items for infinite effect
function cloneItems() {
  const items = [...homePageProdutosUl.children];
  items.forEach((item) => {
    const clone = item.cloneNode(true);
    homePageProdutosUl.appendChild(clone);
  });
  attachLiListeners(); // important! reattach events to clones
}
cloneItems();

// 2. Wheel scroll (left + right)
homePageProdutosUl.addEventListener("wheel", (e) => {
  e.preventDefault();
  homePageProdutosUl.scrollLeft += e.deltaY * 1.5; // faster, smoother scroll
});

// 3. Infinite loop effect
homePageProdutosUl.addEventListener("scroll", () => {
  const maxScroll = homePageProdutosUl.scrollWidth;
  if (homePageProdutosUl.scrollLeft >= maxScroll) {
    // homePageProdutosUl.scrollLeft = 0;
    cloneItems();
  }
  else if (homePageProdutosUl.scrollLeft <= 0) {
    homePageProdutosUl.scrollLeft = maxScroll;
  }
});

// ----------------------
// AUTO-SCROLL (news ticker style)
// ----------------------
let autoScroll = setInterval(() => {
  homePageProdutosUl.scrollLeft += 1; // slow, continuous
}, 20);

// Pause auto-scroll when hovering
homePageProdutosUl.addEventListener("mouseenter", () => clearInterval(autoScroll));
homePageProdutosUl.addEventListener("mouseleave", () => {
  autoScroll = setInterval(() => {
    homePageProdutosUl.scrollLeft += 1;
  }, 20);
});
