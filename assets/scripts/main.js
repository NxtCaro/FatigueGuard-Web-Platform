document.addEventListener('DOMContentLoaded', () => {
  const DB_KEY = 'fatigueguard_companies';
  const SESSION_KEY = 'fatigueguard_session';
  const THEME_KEY = 'fatigueguard_theme';
  const DEFAULT_COMPANY = {
    company: 'Transportes Lima SAC',
    ruc: '20123456789',
    admin: 'Demo',
    email: 'admin@fatigueguard.com',
    phone: '+51 999 999 999',
    vehicles: '150',
    drivers: '200',
    password: 'Fatigue123'
  };

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const links = [...document.querySelectorAll('.nav a')];
  const chatModal = document.querySelector('#asistente');
  const authModal = document.querySelector('#auth');
  const dashboard = document.querySelector('#dashboardApp');
  const chatMessages = document.querySelector('#chatbotMessages');
  const chatbotForm = document.querySelector('#chatbotForm');
  const chatbotText = document.querySelector('#chatbotText');
  const loginForm = document.querySelector('#loginForm');
  const registerForm = document.querySelector('#registerForm');
  const loginMessage = document.querySelector('#loginMessage');
  const registerMessage = document.querySelector('#registerMessage');
  let assistantContext = null;

  const getCompanies = () => JSON.parse(localStorage.getItem(DB_KEY) || '[]');
  const saveCompanies = companies => localStorage.setItem(DB_KEY, JSON.stringify(companies));
  const setSession = company => localStorage.setItem(SESSION_KEY, company.email);
  const clearSession = () => localStorage.removeItem(SESSION_KEY);

  const viewTitles = {
    dashboard: ['Panel de monitoreo', 'Resumen General'],
    conductores: ['Conductores', 'Gestion del equipo'],
    vehiculos: ['Vehiculos', 'Control de flota'],
    alertas: ['Alertas', 'Centro de notificaciones'],
    estadisticas: ['Estadisticas', 'Analisis de riesgo'],
    reportes: ['Reportes', 'Documentos automaticos'],
    configuracion: ['Configuracion', 'Empresa y seguridad']
  };

  function renderDashboardApp() {
    if (!dashboard) return;
    dashboard.innerHTML = `
      <aside class="dashboard-sidebar">
        <img src="assets/images/logo.png" alt="FatigueGuard">
        <div class="dashboard-user">
          <span>DE</span>
          <div>
            <strong>Demo</strong>
            <small>Administrador</small>
          </div>
        </div>
        <nav aria-label="Menu del dashboard">
          <button class="active" type="button" data-dashboard-view="dashboard"><svg><use href="#i-chart"/></svg>Dashboard</button>
          <button type="button" data-dashboard-view="conductores"><svg><use href="#i-users"/></svg>Conductores</button>
          <button type="button" data-dashboard-view="vehiculos"><svg><use href="#i-wheel"/></svg>Vehiculos</button>
          <button type="button" data-dashboard-view="alertas"><svg><use href="#i-alert"/></svg>Alertas</button>
          <button type="button" data-dashboard-view="estadisticas"><svg><use href="#i-chart"/></svg>Estadisticas</button>
          <button type="button" data-dashboard-view="reportes"><svg><use href="#i-download"/></svg>Reportes</button>
          <button type="button" data-dashboard-view="configuracion"><svg><use href="#i-shield-check"/></svg>Configuracion</button>
        </nav>
        <div class="dashboard-sidebar-bottom">
          <button type="button" data-logout><svg><use href="#i-download"/></svg>Log Out</button>
        </div>
      </aside>
      <main class="dashboard-main">
        <header class="dashboard-topbar">
          <div>
            <span id="dashboardSubtitle">Resumen General</span>
            <h1 id="dashboardTitle">Panel de monitoreo</h1>
            <p id="dashboardAdmin">Administrador</p>
          </div>
          <div class="dashboard-actions">
            <label class="dashboard-search dashboard-search-contextual" aria-label="Buscar en esta seccion">
              <svg><use href="#i-eye"/></svg>
              <input type="search" placeholder="Buscar conductor, placa o ruta...">
            </label>
          </div>
        </header>

        <section class="dashboard-view active" data-view-panel="dashboard">
          <div class="date-row" aria-label="Rango de fechas de registros">
            <label><span>Desde</span><input type="date" id="dateFrom" value="2026-04-20"></label>
            <span class="date-separator">-</span>
            <label><span>Hasta</span><input type="date" id="dateTo" value="2026-04-26"></label>
            <button type="button" data-action="date-filter">Aplicar</button>
          </div>
          <div class="dashboard-metrics">
            <article class="metric-blue"><small>Conductores Activos</small><strong data-company-drivers>128</strong><p>+12 este mes</p></article>
            <article class="metric-red"><small>Alertas activas</small><strong>7</strong><p>Atencion requerida</p></article>
            <article class="metric-purple"><small>Viajes hoy</small><strong>24</strong><p>+3 respecto ayer</p></article>
            <article class="metric-green"><small>Viajes completados</small><strong>19</strong><p>Hoy</p></article>
          </div>

          <div class="monitor-grid">
            <section class="dashboard-card fatigue-card">
              <h2>Niveles de fatiga (Conductores)</h2>
              <div class="donut-layout">
                <div class="donut-chart"><span>128<small>Total</small></span></div>
                <ul class="legend-list">
                  <li><b class="ok-bg"></b>Seguro (0 - 30%)</li>
                  <li><b class="warn-bg"></b>Advertencia (30 - 60%)</li>
                  <li><b class="orange-bg"></b>Alto (60 - 80%)</li>
                  <li><b class="high-bg"></b>Critico (80 - 100%)</li>
                </ul>
              </div>
            </section>

            <section class="dashboard-card recent-card">
              <h2>Alertas recientes</h2>
              <ul class="alert-list compact">
                <li><span class="alert-icon high-bg">!</span><div><b>Carlos Martinez</b><small>Nivel critico de fatiga detectado</small></div><time>Hace 2 min</time></li>
                <li><span class="alert-icon warn-bg">!</span><div><b>Juan Perez</b><small>Nivel alto de fatiga detectado</small></div><time>Hace 5 min</time></li>
                <li><span class="alert-icon warn-bg">!</span><div><b>Luis Herrera</b><small>Nivel alto de fatiga detectado</small></div><time>Hace 8 min</time></li>
              </ul>
            </section>

            <section class="dashboard-card line-card">
              <h2>Evolucion de fatiga (Promedio)</h2>
              <svg viewBox="0 0 640 180" class="line-chart" role="img" aria-label="Evolucion promedio de fatiga">
                <line x1="30" y1="150" x2="610" y2="150"></line>
                <line x1="30" y1="120" x2="610" y2="120"></line>
                <line x1="30" y1="90" x2="610" y2="90"></line>
                <line x1="30" y1="60" x2="610" y2="60"></line>
                <path d="M30 142 C100 100, 150 42, 220 40 C290 36, 300 126, 370 112 C440 98, 470 70, 540 142"></path>
              </svg>
            </section>

            <section class="dashboard-card risk-card">
              <h2>Conductores con mayor riesgo</h2>
              <ul class="risk-list">
                <li><span>CM</span><b>Carlos Martinez</b><small>ABC-123</small><em class="high">92% Critico</em></li>
                <li><span>JP</span><b>Juan Perez</b><small>DEF-456</small><em class="orange">78% Alto</em></li>
                <li><span>MS</span><b>Maria Salazar</b><small>GHI-789</small><em class="orange">65% Alto</em></li>
              </ul>
            </section>
          </div>
        </section>

        <section class="dashboard-view" data-view-panel="conductores">
          <div class="view-grid">
            <section class="dashboard-card wide">
              <div class="card-heading"><h2>Gestion de conductores</h2><button type="button" data-action="driver">Registrar conductor</button></div>
              <div class="dashboard-table">
                <table>
                  <thead><tr><th>Conductor</th><th>Licencia</th><th>Vehiculo</th><th>Horas hoy</th><th>Fatiga</th><th>Estado</th></tr></thead>
                  <tbody>
                    <tr><td>Carlos Martinez</td><td>AIII-C 458921</td><td>Bus 452</td><td>8h 20m</td><td><span class="state high">Critica</span></td><td>Requiere descanso</td></tr>
                    <tr><td>Juan Perez</td><td>AII-B 882014</td><td>Taxi 102</td><td>6h 45m</td><td><span class="state warn">Moderada</span></td><td>En observacion</td></tr>
                    <tr><td>Maria Salazar</td><td>AIII-C 129874</td><td>Bus 301</td><td>5h 10m</td><td><span class="state ok">Normal</span></td><td>En ruta</td></tr>
                    <tr><td>Luis Herrera</td><td>AII-B 334219</td><td>Van 078</td><td>7h 00m</td><td><span class="state warn">Alta</span></td><td>Pausa recomendada</td></tr>
                  </tbody>
                </table>
              </div>
            </section>
            <section class="dashboard-card profile-card">
              <h2>Perfil destacado</h2>
              <div class="profile-avatar">CM</div>
              <h3>Carlos Martinez</h3>
              <p><b>Vehiculo:</b> Bus 452</p>
              <p><b>Horas conducidas:</b> 8h 20m</p>
              <p><b>Nivel promedio:</b> Alto riesgo</p>
              <p><b>Ultimo evento:</b> Somnolencia detectada</p>
            </section>
          </div>
        </section>

        <section class="dashboard-view" data-view-panel="vehiculos">
          <div class="dashboard-metrics compact-metrics">
            <article><small>Total flota</small><strong data-company-vehicles>150</strong><p>Vehiculos registrados</p></article>
            <article class="success"><small>Operativos</small><strong>138</strong><p>Unidades disponibles</p></article>
            <article class="danger"><small>En riesgo</small><strong>7</strong><p>Con alertas activas</p></article>
            <article><small>Mantenimiento</small><strong>5</strong><p>Revision programada</p></article>
          </div>
          <section class="dashboard-card wide">
            <div class="card-heading"><h2>Vehiculos monitoreados</h2><button type="button" data-action="vehicle">Registrar vehiculo</button></div>
            <div class="vehicle-grid">
              <article><b>Bus 452</b><span>Ruta Lima - Chosica</span><p>Conductor: Carlos Martinez</p><em class="high">Riesgo critico</em></article>
              <article><b>Taxi 102</b><span>Ruta San Isidro</span><p>Conductor: Juan Perez</p><em class="orange">Alerta moderada</em></article>
              <article><b>Bus 301</b><span>Ruta Callao - Centro</span><p>Conductor: Maria Salazar</p><em class="ok">Operacion normal</em></article>
              <article><b>Van 078</b><span>Ruta Miraflores</span><p>Conductor: Luis Herrera</p><em class="orange">Pausa sugerida</em></article>
            </div>
          </section>
        </section>

        <section class="dashboard-view" data-view-panel="alertas">
          <div class="view-grid">
            <section class="dashboard-card alert-dashboard-card">
              <h2>Alerta critica activa</h2>
              <p><b>Conductor:</b> Carlos Martinez</p>
              <p><b>Vehiculo:</b> Bus 452</p>
              <p><b>Evento:</b> Somnolencia detectada</p>
              <p><b>Hora:</b> 14:35 PM</p>
              <strong>Accion recomendada: contactar conductor y programar descanso inmediato.</strong>
            </section>
            <section class="dashboard-card wide">
              <h2>Centro de notificaciones</h2>
              <ul class="alert-list">
                <li><span class="alert-icon high-bg">!</span><div><b>Alta fatiga</b><small>Carlos Martinez - Bus 452 - Hace 5 minutos</small></div><button type="button" data-action="attend-alert">Atender</button></li>
                <li><span class="alert-icon warn-bg">!</span><div><b>Pausa recomendada</b><small>Juan Perez - Taxi 102 - Hace 15 minutos</small></div><button type="button" data-action="contact-driver">Contactar</button></li>
                <li><span class="alert-icon ok-bg">✓</span><div><b>Viaje finalizado</b><small>Maria Salazar - Bus 301 - Hace 30 minutos</small></div><button type="button">Ver</button></li>
                <li><span class="alert-icon orange-bg">!</span><div><b>Tiempo de conduccion alto</b><small>Luis Herrera - Van 078 - Hace 42 minutos</small></div><button type="button" data-action="review-time">Revisar</button></li>
              </ul>
            </section>
          </div>
        </section>

        <section class="dashboard-view" data-view-panel="estadisticas">
          <div class="view-grid">
            <section class="dashboard-card">
              <h2>Fatiga detectada por horario</h2>
              <div class="risk-bars">
                <p><span>00:00</span><b style="width:70%"></b><strong>70%</strong></p>
                <p><span>06:00</span><b style="width:30%"></b><strong>30%</strong></p>
                <p><span>12:00</span><b style="width:40%"></b><strong>40%</strong></p>
                <p><span>18:00</span><b style="width:80%"></b><strong>80%</strong></p>
              </div>
            </section>
            <section class="dashboard-card">
              <h2>Rutas mas criticas</h2>
              <div class="risk-bars">
                <p><span>Chosica</span><b style="width:78%"></b><strong>78%</strong></p>
                <p><span>Callao</span><b style="width:52%"></b><strong>52%</strong></p>
                <p><span>Surco</span><b style="width:37%"></b><strong>37%</strong></p>
                <p><span>Centro</span><b style="width:64%"></b><strong>64%</strong></p>
              </div>
            </section>
            <section class="dashboard-card wide">
              <h2>Indicadores del mes</h2>
              <div class="stats-strip">
                <article><strong>245</strong><span>Viajes analizados</span></article>
                <article><strong>18</strong><span>Alertas detectadas</span></article>
                <article><strong>6</strong><span>Conductores requieren descanso</span></article>
                <article><strong>35%</strong><span>Reduccion de riesgo</span></article>
              </div>
            </section>
          </div>
        </section>

        <section class="dashboard-view" data-view-panel="reportes">
          <div class="report-grid">
            <article class="dashboard-card"><h2>Reporte mensual</h2><p>Resumen de seguridad Julio 2026.</p><button type="button" data-action="monthly-report">Descargar PDF</button></article>
            <article class="dashboard-card"><h2>Reporte de fatiga</h2><p>Eventos por nivel, horario y conductor.</p><button type="button" data-action="fatigue-report">Descargar Excel</button></article>
            <article class="dashboard-card"><h2>Reporte por vehiculo</h2><p>Rendimiento y alertas por unidad.</p><button type="button" data-action="vehicle-report">Generar</button></article>
            <article class="dashboard-card"><h2>Reporte por conductor</h2><p>Historial individual y recomendaciones.</p><button type="button" data-action="driver-report">Generar</button></article>
          </div>
          <section class="dashboard-card wide">
            <h2>Ultimos reportes generados</h2>
            <div class="dashboard-table">
              <table>
                <thead><tr><th>Reporte</th><th>Periodo</th><th>Alertas</th><th>Responsable</th><th>Estado</th></tr></thead>
                <tbody>
                  <tr><td>Seguridad Julio 2026</td><td>01/07 - 31/07</td><td>18</td><td>Demo</td><td>Listo</td></tr>
                  <tr><td>Fatiga por horario</td><td>Semana actual</td><td>7</td><td>Operaciones</td><td>Listo</td></tr>
                  <tr><td>Vehiculos en riesgo</td><td>Ultimas 24h</td><td>4</td><td>Seguridad vial</td><td>En revision</td></tr>
                </tbody>
              </table>
            </div>
          </section>
        </section>

        <section class="dashboard-view" data-view-panel="configuracion">
          <div class="view-grid">
            <section class="dashboard-card">
              <h2>Perfil de empresa</h2>
              <p><b>Empresa:</b> <span data-company-name>-</span></p>
              <p><b>Vehiculos:</b> <span data-company-vehicles>-</span></p>
              <p><b>Conductores:</b> <span data-company-drivers>-</span></p>
              <p><b>Administrador:</b> <span data-company-admin>-</span></p>
            </section>
            <section class="dashboard-card">
              <h2>Seguridad y privacidad</h2>
              <ul class="check-list">
                <li>Datos cifrados</li>
                <li>Acceso empresarial seguro</li>
                <li>Control de permisos</li>
                <li>Proteccion de informacion biometrica</li>
              </ul>
            </section>
            <section class="dashboard-card wide">
              <h2>Preferencias de alertas</h2>
              <div class="settings-grid">
                <label><input type="checkbox" checked> Notificar fatiga critica</label>
                <label><input type="checkbox" checked> Recomendar descanso automatico</label>
                <label><input type="checkbox" checked> Enviar resumen diario</label>
                <label><input type="checkbox"> Requerir doble aprobacion para reportes</label>
              </div>
            </section>
            <section class="dashboard-card wide">
              <h2>Apariencia del sistema</h2>
              <p>Elige una paleta clara u oscura para el dashboard. Tu seleccion se guarda en este navegador.</p>
              <div class="theme-controls">
                <button type="button" data-theme-choice="light">Modo claro</button>
                <button type="button" data-theme-choice="dark">Modo oscuro</button>
              </div>
            </section>
          </div>
        </section>
      </main>
      <button class="dashboard-assistant-float js-open-chat" type="button">
        <svg><use href="#i-bell"/></svg>
        <span>Asistente</span>
      </button>
      <div class="dashboard-toast" id="dashboardToast" role="status" aria-live="polite"></div>
    `;
  }

  function ensureDefaultCompany() {
    const companies = getCompanies();
    const demoIndex = companies.findIndex(company => company.email === DEFAULT_COMPANY.email);
    if (demoIndex === -1) {
      companies.push(DEFAULT_COMPANY);
      saveCompanies(companies);
      return;
    }

    companies[demoIndex] = { ...companies[demoIndex], admin: DEFAULT_COMPANY.admin };
    saveCompanies(companies);
  }

  function normalizeText(text) {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function getActiveDashboardView() {
    return document.querySelector('[data-view-panel].active')?.dataset.viewPanel || 'dashboard';
  }

  function filterDashboardView(view, term) {
    const query = normalizeText(term);
    const panel = document.querySelector(`[data-view-panel="${view}"]`);
    if (!panel) return 0;

    const selectors = {
      conductores: '.dashboard-table tbody tr',
      vehiculos: '.vehicle-grid article',
      alertas: '.alert-list li, .alert-dashboard-card'
    };
    const items = [...panel.querySelectorAll(selectors[view] || '')];
    let visible = 0;

    items.forEach(item => {
      const matches = !query || normalizeText(item.textContent).includes(query);
      item.classList.toggle('search-hidden', !matches);
      if (matches) visible += 1;
    });

    return visible;
  }

  const assistantKnowledge = [
    {
      keywords: ['para que sirve', 'que es', 'sistema de empresas', 'sistema empresarial', 'plataforma empresarial', 'que incluye', 'incluye el sistema', 'empresas', 'empresa de transporte'],
      answer: 'El sistema empresarial sirve para que una empresa de transporte controle su flota desde la web. La app del conductor detecta fatiga y envia datos al servidor; el dashboard permite ver conductores, vehiculos, alertas, estadisticas y reportes para tomar decisiones preventivas antes de que ocurra un accidente.'
    },
    {
      keywords: ['como funciona', 'funcionamiento', 'proceso', 'flujo', 'arquitectura'],
      answer: 'Funciona asi: el conductor usa la app movil, la camara y la IA detectan senales de fatiga, los eventos se envian al sistema y el administrador los revisa en el dashboard web para actuar a tiempo.'
    },
    {
      keywords: ['registrar', 'registro', 'crear cuenta', 'nueva empresa', 'ruc'],
      answer: 'Para registrar una empresa, entra a Iniciar Sesion y selecciona Registrar empresa. Completa empresa, RUC, administrador, correo, telefono, cantidad de vehiculos, conductores y contrasena.'
    },
    {
      keywords: ['login', 'iniciar sesion', 'sesion', 'entrar', 'acceso', 'cuenta'],
      answer: 'Para iniciar sesion usa el boton Iniciar Sesion. Si quieres probar el dashboard directo, usa el correo admin@fatigueguard.com con la contrasena Fatigue123.'
    },
    {
      keywords: ['demo', 'prueba', 'contrasena', 'password', 'usuario demo', 'correo demo'],
      answer: 'La cuenta demo es admin@fatigueguard.com y la contrasena es Fatigue123.'
    },
    {
      keywords: ['dashboard', 'panel', 'panel de monitoreo', 'resumen general'],
      answer: 'El dashboard es el panel privado de la empresa. Muestra conductores activos, alertas activas, viajes del dia, viajes completados, niveles de fatiga, alertas recientes y conductores con mayor riesgo.'
    },
    {
      keywords: ['conductor', 'conductores', 'chofer', 'licencia', 'horas conducidas'],
      answer: 'En Conductores puedes ver nombres, licencias, vehiculo asignado, horas conducidas, nivel de fatiga y estado operativo. Esto ayuda a decidir descansos, rotaciones o seguimiento individual.'
    },
    {
      keywords: ['vehiculo', 'vehiculos', 'flota', 'unidad', 'placa', 'ruta'],
      answer: 'En Vehiculos puedes revisar unidades registradas, rutas, conductor asignado, estado operativo, unidades en riesgo y vehiculos que necesitan mantenimiento o seguimiento.'
    },
    {
      keywords: ['alerta', 'alertas', 'critica', 'notificacion', 'riesgo', 'atender'],
      answer: 'Las alertas avisan cuando un conductor presenta fatiga moderada, alta o critica. Cada alerta muestra conductor, vehiculo, evento, hora y una accion recomendada, como contactar al conductor o programar descanso.'
    },
    {
      keywords: ['estadistica', 'estadisticas', 'analitica', 'grafico', 'patron', 'horario', 'ruta critica'],
      answer: 'Las estadisticas permiten encontrar patrones: horarios con mas fatiga, rutas criticas, conductores con mayor riesgo y evolucion promedio de la fatiga durante la semana.'
    },
    {
      keywords: ['reporte', 'reportes', 'pdf', 'excel', 'descargar', 'mensual'],
      answer: 'Los reportes resumen viajes analizados, alertas detectadas, conductores que requieren descanso, riesgo por vehiculo y resultados por conductor. Sirven para auditorias, seguridad vial y decisiones internas.'
    },
    {
      keywords: ['configuracion', 'configurar', 'perfil empresa', 'permisos', 'preferencias'],
      answer: 'En Configuracion puedes revisar el perfil de empresa, datos de flota, administrador, seguridad, privacidad y preferencias de alertas.'
    },
    {
      keywords: ['privacidad', 'seguridad', 'datos', 'biometrico', 'biometrica', 'cifrado'],
      answer: 'La informacion debe manejarse con acceso seguro, permisos por administrador, datos cifrados y proteccion de datos biometricos porque el sistema trabaja con deteccion facial.'
    },
    {
      keywords: ['fatiga', 'somnolencia', 'cansancio', 'microsueno', 'dormido'],
      answer: 'FatigueGuard detecta senales de fatiga y somnolencia desde la app del conductor. Luego esos eventos llegan al dashboard para que la empresa actue a tiempo y reduzca riesgos.'
    },
    {
      keywords: ['ia', 'inteligencia artificial', 'camara', 'reconocimiento facial', 'deteccion'],
      answer: 'La IA analiza senales visuales como parpadeos, ojos cerrados, cabeceos y posibles signos de somnolencia. La web no reemplaza a la app movil: recibe los datos para que la empresa los gestione.'
    },
    {
      keywords: ['base de datos', 'localstorage', 'guardar', 'datos guardados'],
      answer: 'En este prototipo la base de datos esta simulada con localStorage del navegador. Eso permite registrar empresas e iniciar sesion en la misma computadora sin instalar un servidor.'
    },
    {
      keywords: ['contacto', 'soporte', 'ayuda', 'correo', 'telefono'],
      answer: 'Para soporte o consultas puedes usar el contacto de la landing: safedrive@gmail.com. En una version real tambien podria agregarse un canal de soporte dentro del dashboard.'
    },
    {
      keywords: ['precio', 'costo', 'plan', 'pago', 'licencia'],
      answer: 'El prototipo no define precios. Para una propuesta real, lo ideal seria ofrecer planes por cantidad de vehiculos, conductores monitoreados y nivel de reportes.'
    }
  ];

  function openModal(modal) {
    modal?.classList.add('open');
    modal?.setAttribute('aria-hidden', 'false');
  }

  function closeModals() {
    document.querySelectorAll('.app-modal.open').forEach(modal => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    });
  }

  function openAuth(tab = 'login') {
    closeModals();
    openModal(authModal);
    setAuthTab(tab);
  }

  function setAuthTab(tab) {
    document.querySelectorAll('[data-auth-tab]').forEach(button => {
      button.classList.toggle('active', button.dataset.authTab === tab);
    });
    document.querySelectorAll('.auth-form').forEach(form => {
      form.classList.toggle('active', form.id === `${tab}Form`);
    });
  }

  function addChatMessage(text, type = 'bot') {
    if (!chatMessages) return;
    const message = document.createElement('div');
    message.className = `chat-message ${type}`;
    message.textContent = text;
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function answerQuestion(text) {
    const normalized = normalizeText(text);

    if (/^(hola|buenas|buenos dias|buenas tardes|buenas noches|hey)\b/.test(normalized)) {
      return 'Hola. Dime que duda tienes sobre FatigueGuard y te respondo puntual.';
    }

    let bestMatch = null;
    let bestScore = 0;

    assistantKnowledge.forEach(item => {
      let score = 0;
      item.keywords.forEach(keyword => {
        const normalizedKeyword = normalizeText(keyword);
        if (normalized.includes(normalizedKeyword)) {
          score += normalizedKeyword.includes(' ') ? 4 : 2;
        }
      });
      if (score > bestScore) {
        bestScore = score;
        bestMatch = item;
      }
    });

    if (bestMatch) return bestMatch.answer;

    const words = normalized.split(/\s+/).filter(word => word.length > 3);
    assistantKnowledge.forEach(item => {
      let score = 0;
      const answerText = normalizeText(`${item.keywords.join(' ')} ${item.answer}`);
      words.forEach(word => {
        if (answerText.includes(word)) score += 1;
      });
      if (score > bestScore) {
        bestScore = score;
        bestMatch = item;
      }
    });

    if (bestMatch && bestScore >= 2) return bestMatch.answer;

    return 'No tengo suficiente informacion para responder eso con precision en este prototipo. Si lo relacionas con FatigueGuard, la app movil, el dashboard, alertas, reportes, conductores o vehiculos, te puedo dar una respuesta mas exacta.';
  }

  function startChat() {
    const context = document.body.classList.contains('dashboard-open') ? 'dashboard' : 'landing';
    if (assistantContext !== context) {
      chatMessages.innerHTML = '';
      assistantContext = context;
    }
    if (!chatMessages.children.length) {
      const greeting = context === 'dashboard'
        ? 'Hola, soy tu asistente dentro del dashboard. Dime que necesitas revisar y te ayudo.'
        : 'Hola, soy el asistente virtual de FatigueGuard. Dime tu duda y te respondo.';
      addChatMessage(greeting);
    }
  }

  function updateDashboardCompany(company) {
    document.querySelector('#dashboardAdmin').textContent = `Administrador: ${company.admin} - ${company.email}`;
    document.querySelectorAll('[data-company-name]').forEach(node => { node.textContent = company.company; });
    document.querySelectorAll('[data-company-admin]').forEach(node => { node.textContent = company.admin; });
    document.querySelectorAll('[data-company-vehicles]').forEach(node => { node.textContent = company.vehicles; });
    document.querySelectorAll('[data-company-drivers]').forEach(node => { node.textContent = company.drivers; });
    document.querySelectorAll('.dashboard-user strong').forEach(node => { node.textContent = company.admin; });
    document.querySelectorAll('.dashboard-user span').forEach(node => {
      const cleanName = company.admin.replace(/\s+/g, ' ').trim();
      node.textContent = cleanName.includes(' ')
        ? cleanName.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()
        : cleanName.slice(0, 2).toUpperCase();
    });
  }

  function switchDashboardView(view) {
    const title = viewTitles[view] || viewTitles.dashboard;
    document.querySelector('#dashboardTitle').textContent = title[0];
    document.querySelector('#dashboardSubtitle').textContent = title[1];
    document.querySelectorAll('[data-dashboard-view]').forEach(button => {
      button.classList.toggle('active', button.dataset.dashboardView === view);
    });
    document.querySelectorAll('[data-view-panel]').forEach(panel => {
      panel.classList.toggle('active', panel.dataset.viewPanel === view);
    });

    const search = document.querySelector('.dashboard-search-contextual');
    const searchableViews = ['conductores', 'vehiculos', 'alertas'];
    const isSearchable = searchableViews.includes(view);
    if (search) {
      const input = search.querySelector('input');
      search.classList.toggle('visible', isSearchable);
      if (input) {
        input.value = '';
        input.placeholder = view === 'conductores'
          ? 'Buscar conductor o licencia...'
          : view === 'vehiculos'
            ? 'Buscar placa, unidad o ruta...'
            : 'Buscar alerta, conductor o nivel...';
      }
    }
    ['conductores', 'vehiculos', 'alertas'].forEach(section => filterDashboardView(section, ''));
  }

  function showDashboard(company) {
    closeModals();
    document.body.classList.add('dashboard-open');
    dashboard?.classList.add('open');
    dashboard?.setAttribute('aria-hidden', 'false');
    assistantContext = null;
    chatMessages.innerHTML = '';
    updateDashboardCompany(company);
    switchDashboardView('dashboard');
    window.scrollTo(0, 0);
  }

  function hideDashboard() {
    document.body.classList.remove('dashboard-open');
    dashboard?.classList.remove('open');
    dashboard?.setAttribute('aria-hidden', 'true');
    assistantContext = null;
    chatMessages.innerHTML = '';
  }

  function applyTheme(theme) {
    const selectedTheme = theme === 'dark' ? 'dark' : 'light';
    document.body.classList.toggle('theme-dark', selectedTheme === 'dark');
    document.body.classList.toggle('theme-light', selectedTheme === 'light');
    localStorage.setItem(THEME_KEY, selectedTheme);
    document.querySelectorAll('[data-theme-choice]').forEach(button => {
      button.classList.toggle('active', button.dataset.themeChoice === selectedTheme);
    });
  }

  function showToast(message) {
    const toast = document.querySelector('#dashboardToast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2600);
  }

  function formatDashboardDate(value) {
    if (!value) return '';
    const [year, month, day] = value.split('-');
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return `${Number(day)} ${months[Number(month) - 1]} ${year}`;
  }

  function handleDashboardAction(action, buttonText = '') {
    const messages = {
      driver: 'Formulario de conductor preparado: aqui se registraria licencia, vehiculo asignado y horario.',
      vehicle: 'Formulario de vehiculo preparado: aqui se registraria placa, ruta, unidad y conductor asignado.',
      'attend-alert': 'Alerta marcada como atendida. Accion recomendada enviada al supervisor.',
      'contact-driver': 'Contacto simulado: se enviaria una llamada o mensaje al conductor.',
      'view-trip': 'Detalle de viaje abierto: conductor, ruta, horario, eventos y estado final.',
      'review-time': 'Revision iniciada: se recomienda evaluar descanso por tiempo de conduccion alto.',
      'monthly-report': 'Reporte mensual generado. En un sistema real se descargaria como PDF.',
      'fatigue-report': 'Reporte de fatiga generado. En un sistema real se exportaria como Excel.',
      'vehicle-report': 'Reporte por vehiculo generado con alertas, rutas y kilometraje simulado.',
      'driver-report': 'Reporte por conductor generado con historial, fatiga y recomendaciones.'
    };
    showToast(messages[action] || `Accion ejecutada: ${buttonText || 'operacion del sistema'}.`);
  }

  renderDashboardApp();
  applyTheme(localStorage.getItem(THEME_KEY) || 'light');
  ensureDefaultCompany();

  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menu' : 'Abrir menu');
  });

  links.forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  }));

  const sections = [...document.querySelectorAll('section[id], footer[id]')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
    });
  }, { rootMargin: '-25% 0px -65% 0px' });
  sections.forEach(section => observer.observe(section));

  document.addEventListener('click', event => {
    const authButton = event.target.closest('.js-open-auth');
    if (authButton) {
      event.preventDefault();
      openAuth('login');
      return;
    }

    const chatButton = event.target.closest('.js-open-chat');
    if (chatButton) {
      event.preventDefault();
      openModal(chatModal);
      startChat();
      return;
    }

    if (event.target.closest('.js-close-modal')) {
      closeModals();
      return;
    }

    const authTab = event.target.closest('[data-auth-tab]');
    if (authTab) {
      setAuthTab(authTab.dataset.authTab);
      return;
    }

    const chatOption = event.target.closest('[data-chat-option]');
    if (chatOption) {
      addChatMessage(chatOption.textContent, 'user');
      addChatMessage(answerQuestion(chatOption.textContent));
      return;
    }

    const viewButton = event.target.closest('[data-dashboard-view]');
    if (viewButton) {
      switchDashboardView(viewButton.dataset.dashboardView);
      return;
    }

    const themeButton = event.target.closest('[data-theme-choice]');
    if (themeButton) {
      applyTheme(themeButton.dataset.themeChoice);
      showToast(themeButton.dataset.themeChoice === 'dark' ? 'Modo oscuro activado.' : 'Modo claro activado.');
      return;
    }

    const actionButton = event.target.closest('[data-action]');
    if (actionButton) {
      if (actionButton.dataset.action === 'date-filter') {
        const from = document.querySelector('#dateFrom')?.value;
        const to = document.querySelector('#dateTo')?.value;
        showToast(`Mostrando registros desde ${formatDashboardDate(from)} hasta ${formatDashboardDate(to)}.`);
        return;
      }
      handleDashboardAction(actionButton.dataset.action, actionButton.textContent.trim());
      return;
    }

    const alertViewButton = event.target.closest('.alert-list button');
    if (alertViewButton) {
      handleDashboardAction('view-trip', alertViewButton.textContent.trim());
      return;
    }

    if (event.target.closest('[data-logout]')) {
      clearSession();
      hideDashboard();
      window.location.hash = '#inicio';
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeModals();
    if (event.key === 'Enter' && event.target.matches('.dashboard-search input')) {
      event.preventDefault();
      const query = event.target.value.trim();
      const activeView = getActiveDashboardView();
      if (!['conductores', 'vehiculos', 'alertas'].includes(activeView) || !query) return;
      const visible = filterDashboardView(activeView, query);
      showToast(`Busqueda en ${viewTitles[activeView][0]}: ${visible} resultado(s) para "${query}".`);
    }
  });

  document.addEventListener('input', event => {
    if (!event.target.matches('.dashboard-search input')) return;
    const activeView = getActiveDashboardView();
    if (!['conductores', 'vehiculos', 'alertas'].includes(activeView)) return;
    filterDashboardView(activeView, event.target.value);
  });

  chatbotForm?.addEventListener('submit', event => {
    event.preventDefault();
    const text = chatbotText.value.trim();
    if (!text) return;
    addChatMessage(text, 'user');
    chatbotText.value = '';
    addChatMessage(answerQuestion(text));
  });

  registerForm?.addEventListener('submit', event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(registerForm));
    const email = data.email.trim().toLowerCase();
    const companies = getCompanies();

    if (companies.some(company => company.email === email || company.ruc === data.ruc.trim())) {
      registerMessage.textContent = 'Esta empresa ya esta registrada. Inicia sesion con su correo empresarial.';
      registerMessage.classList.remove('success');
      return;
    }

    const company = {
      company: data.company.trim(),
      ruc: data.ruc.trim(),
      admin: data.admin.trim(),
      email,
      phone: data.phone.trim(),
      vehicles: data.vehicles,
      drivers: data.drivers,
      password: data.password
    };

    companies.push(company);
    saveCompanies(companies);
    setSession(company);
    registerMessage.textContent = 'Cuenta creada correctamente. Entrando al dashboard...';
    registerMessage.classList.add('success');
    setTimeout(() => showDashboard(company), 450);
  });

  loginForm?.addEventListener('submit', event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(loginForm));
    const email = data.email.trim().toLowerCase();
    const company = getCompanies().find(item => item.email === email && item.password === data.password);

    if (!company) {
      loginMessage.textContent = 'Correo o contrasena incorrectos. Si aun no tienes cuenta, registra tu empresa.';
      loginMessage.classList.remove('success');
      return;
    }

    setSession(company);
    loginMessage.textContent = 'Acceso correcto. Cargando dashboard...';
    loginMessage.classList.add('success');
    setTimeout(() => showDashboard(company), 350);
  });

  const sessionEmail = localStorage.getItem(SESSION_KEY);
  const currentCompany = getCompanies().find(company => company.email === sessionEmail);
  if (currentCompany) showDashboard(currentCompany);
});
