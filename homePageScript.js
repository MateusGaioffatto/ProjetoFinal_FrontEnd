const homePageSearchInput = document.getElementById("homePageSearchInputID");
const homePageProdutosDiv = document.getElementById("homePageProdutosDivID");

homePageSearchInput.addEventListener("input", function() {
    homePageProdutosDiv.style.display = "flex";
})