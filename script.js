(() => {
  const mediaQuery = window.matchMedia("(max-width: 768px)");

  const inicializarCarouselSecao = (seletorSecao, seletorTrilha, seletorItem) => {
    const secao = document.querySelector(seletorSecao);
    if (!secao) return;

    const trilha = secao.querySelector(seletorTrilha);
    const slides = Array.from(secao.querySelectorAll(seletorItem));
    const botaoAnterior = secao.querySelector("[data-carousel-prev]");
    const botaoProximo = secao.querySelector("[data-carousel-next]");

    if (!trilha || slides.length === 0 || !botaoAnterior || !botaoProximo) return;

    let indiceAtual = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    const LIMIAR_SWIPE = 45;
    const LIMIAR_VERTICAL = 30;

    const atualizarCarrossel = () => {
      trilha.style.transform = `translateX(-${indiceAtual * 100}%)`;
      botaoAnterior.disabled = indiceAtual === 0;
      botaoProximo.disabled = indiceAtual === slides.length - 1;
    };

    const resetarCarrossel = () => {
      indiceAtual = 0;
      trilha.style.transform = "";
      botaoAnterior.disabled = false;
      botaoProximo.disabled = false;
    };

    const sincronizarComViewport = () => {
      if (mediaQuery.matches) {
        atualizarCarrossel();
        return;
      }

      resetarCarrossel();
    };

    botaoAnterior.addEventListener("click", () => {
      if (!mediaQuery.matches || indiceAtual === 0) return;
      indiceAtual -= 1;
      atualizarCarrossel();
    });

    botaoProximo.addEventListener("click", () => {
      if (!mediaQuery.matches || indiceAtual === slides.length - 1) return;
      indiceAtual += 1;
      atualizarCarrossel();
    });

    const aoIniciarToque = (evento) => {
      if (!mediaQuery.matches) return;
      const toque = evento.changedTouches[0];
      touchStartX = toque.clientX;
      touchStartY = toque.clientY;
    };

    const aoFinalizarToque = (evento) => {
      if (!mediaQuery.matches) return;
      const toque = evento.changedTouches[0];
      touchEndX = toque.clientX;
      touchEndY = toque.clientY;

      const deltaX = touchEndX - touchStartX;
      const deltaY = Math.abs(touchEndY - touchStartY);

      if (Math.abs(deltaX) < LIMIAR_SWIPE || deltaY > LIMIAR_VERTICAL) return;

      if (deltaX < 0 && indiceAtual < slides.length - 1) {
        indiceAtual += 1;
        atualizarCarrossel();
        return;
      }

      if (deltaX > 0 && indiceAtual > 0) {
        indiceAtual -= 1;
        atualizarCarrossel();
      }
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", sincronizarComViewport);
    } else if (typeof mediaQuery.addListener === "function") {
      mediaQuery.addListener(sincronizarComViewport);
    }
    trilha.addEventListener("touchstart", aoIniciarToque, { passive: true });
    trilha.addEventListener("touchend", aoFinalizarToque, { passive: true });
    sincronizarComViewport();
  };

  inicializarCarouselSecao(".s5.secao-desafios", ".grade-desafios", ".item-desafio");
  inicializarCarouselSecao(".s8.secao-unimos-forcas", ".grade-unimos-forcas", ".item-unimos-forcas");
})();
