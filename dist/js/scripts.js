/*!
* Start Bootstrap - Stylish Portfolio v6.0.6 (https://startbootstrap.com/theme/stylish-portfolio)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-stylish-portfolio/blob/master/LICENSE)
*/
let dados = [];
window.addEventListener('DOMContentLoaded', event => {

    const sidebarWrapper = document.getElementById('sidebar-wrapper');
    let scrollToTopVisible = false;
    // Closes the sidebar menu
    const menuToggle = document.body.querySelector('.menu-toggle');
    menuToggle.addEventListener('click', event => {
        event.preventDefault();
        sidebarWrapper.classList.toggle('active');
        _toggleMenuIcon();
        menuToggle.classList.toggle('active');
    })

    // Closes responsive menu when a scroll trigger link is clicked
    var scrollTriggerList = [].slice.call(document.querySelectorAll('#sidebar-wrapper .js-scroll-trigger'));
    scrollTriggerList.map(scrollTrigger => {
        scrollTrigger.addEventListener('click', () => {
            sidebarWrapper.classList.remove('active');
            menuToggle.classList.remove('active');
            _toggleMenuIcon();
        })
    });

    function _toggleMenuIcon() {
        const menuToggleBars = document.body.querySelector('.menu-toggle > .fa-bars');
        const menuToggleTimes = document.body.querySelector('.menu-toggle > .fa-xmark');
        if (menuToggleBars) {
            menuToggleBars.classList.remove('fa-bars');
            menuToggleBars.classList.add('fa-xmark');
        }
        if (menuToggleTimes) {
            menuToggleTimes.classList.remove('fa-xmark');
            menuToggleTimes.classList.add('fa-bars');
        }
    }

    // Scroll to top button appear
    document.addEventListener('scroll', () => {
        const scrollToTop = document.body.querySelector('.scroll-to-top');
        if (document.documentElement.scrollTop > 100) {
            if (!scrollToTopVisible) {
                fadeIn(scrollToTop);
                scrollToTopVisible = true;
            }
        } else {
            if (scrollToTopVisible) {
                fadeOut(scrollToTop);
                scrollToTopVisible = false;
            }
        }
    })
})

function fadeOut(el) {
    el.style.opacity = 1;
    (function fade() {
        if ((el.style.opacity -= .1) < 0) {
            el.style.display = "none";
        } else {
            requestAnimationFrame(fade);
        }
    })();
};

function fadeIn(el, display) {
    el.style.opacity = 0;
    el.style.display = display || "block";
    (function fade() {
        var val = parseFloat(el.style.opacity);
        if (!((val += .1) > 1)) {
            el.style.opacity = val;
            requestAnimationFrame(fade);
        }
    })();
};

const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRhI4KXM8PKpPAX-Oe5ABc6QIC4x1oJNCVDE9IjuXpk7E_GqjT6Cu4Z1gdLyNfDXRXWlP2P9IluR65b/pub?output=csv";

async function carregarDados() {
  const response = await fetch(url);
  const csv = await response.text();
  return csv;
}

function csvParaJson(csv) {
  const linhas = csv.split("\n");
  const headers = linhas[0].split(",");

  return linhas.slice(1).map(linha => {
    const valores = linha.split(",");
    const objeto = {};

    headers.forEach((header, i) => {
      objeto[header.trim()] = valores[i]?.trim();
    });

    return objeto;
  });
}

function selecionarDisciplina(disciplina) {
  const select = document.getElementById("filtroDisciplina");

  select.value = disciplina;

  aplicarFiltros(); // reaplica os filtros automaticamente

  document.getElementById("portfolio").scrollIntoView({
    behavior: "smooth"
  });
}

function renderizar(lista) {
  const container = document.getElementById("lista_disciplinas");

  container.innerHTML = lista.map(item => `
    <div class="col-lg-3 col-md-6 mb-5 mb-lg-0 pt-xxl-4" onclick="selecionarDisciplina('${item}')">
                        <span class="service-icon rounded-circle mx-auto mb-3"><i class="icon-book-open"></i></span>
                        <h4><strong>${item}</strong></h4>
                    </div>
  `).join("");
}

function renderizarLivros(lista) {
  const container = document.getElementById("lista_livros");

  if (!lista || lista.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <h4 class="mb-3">📚 Nenhum livro encontrado</h4>
        <p class="text-muted">
          Não encontramos materiais para os filtros selecionados.<br>
          Tente escolher outra disciplina ou turma.
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = lista.map (item => { 
    const img = item.Capa && item.Capa.trim() !== "" 
      ? item.Capa 
      : "dist/assets/img/portfolio-1.jpg";
    return `
                        <div class="col-lg-3">
                        <a class="portfolio-item" href="${item.URL}" target="_blank">
                            <div class="caption">
                                <div class="caption-content">
                                    <div class="h2">Turma ${item.Turma} - ${item.Disciplina}</div>
                                    <p class="mb-0">${item.Titulo}</p>
                                </div>
                            </div>
                            <img class="img-fluid" src="${img}" alt="..." />
                        </a>
                    </div>
    `}).join("");
}


function extrairUnicos(lista) {
  const disciplinas = [...new Set(lista.map(item => item.Disciplina))];
  const turmas = [...new Set(lista.map(item => item.Turma))];

  return { disciplinas, turmas };
}

function preencherDropdown(disciplinas, turmas) {
  const selectDisc = document.getElementById("filtroDisciplina");

  selectDisc.innerHTML += disciplinas.map(d => `
    <option value="${d}">${d}</option>
  `).join("");

  const selectTur = document.getElementById("filtroTurma");

  selectTur.innerHTML += turmas.map(t => `
    <option value="${t}">${t}</option>
  `).join("");
}

function aplicarFiltros() {
  const disciplina = document.getElementById("filtroDisciplina").value;
  const turma = document.getElementById("filtroTurma").value;

  // 🔥 NOVA REGRA
  if (!disciplina && !turma) {
    renderizarLivros([]); // ou mostrar mensagem
    return;
  }

  const filtrados = dados.filter(item => {
    const matchDisciplina = 
      !disciplina || item.Disciplina === disciplina;

    const matchTurma = 
      !turma || item.Turma === turma;

    return matchDisciplina && matchTurma;
  });

  renderizarLivros(filtrados);
}

async function main() {
  const csv = await carregarDados();
  dados = csvParaJson(csv);
  const { disciplinas, turmas } = extrairUnicos(dados);
  console.log(dados);
  console.log(disciplinas);

  preencherDropdown(disciplinas, turmas);
  renderizar(disciplinas);

  document.getElementById("filtroDisciplina")
  .addEventListener("change", aplicarFiltros);
  document.getElementById("filtroTurma")
  .addEventListener("change", aplicarFiltros);
  
}

main();
