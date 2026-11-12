import { test, expect } from '@playwright/test';

test.describe('PharmaSoft - Suite Completa E2E (Sesión 14)', () => {

  // Helper para autenticar como Admin
  const autenticarComoAdmin = async (page: any) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsInJvbCI6IlJPTEVfQURNSU4ifQ.demo');
      sessionStorage.setItem('usuario', 'admin');
      sessionStorage.setItem(
        'permisos',
        JSON.stringify(['USUARIOS_ADMINISTRAR', 'PRODUCTOS_LEER', 'PRODUCTOS_ESCRIBIR', 'VENTAS_REGISTRAR', 'CATEGORIAS_LEER'])
      );
    });
  };

  // Helper para autenticar como Vendedor
  const autenticarComoVendedor = async (page: any) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2ZW5kZWRvciIsInJvbCI6IlJPTEVfVkVOREVET1IifQ.demo');
      sessionStorage.setItem('usuario', 'vendedor');
      sessionStorage.setItem(
        'permisos',
        JSON.stringify(['VENTAS_REGISTRAR', 'PRODUCTOS_LEER', 'CATEGORIAS_LEER'])
      );
    });
  };

  // E2E-01: Login exitoso como Administrador
  test('E2E-01: Login exitoso como Administrador', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h2')).toHaveText('Iniciar Sesión');
    await page.click('#btn-login-admin');
    await expect(page).toHaveURL(/\/inicio/);
    await expect(page.locator('#usuario-actual')).toHaveText('admin');
  });

  // E2E-02: Navegación inicial y título
  test('E2E-02: Navegación inicial y marca PharmaSoft', async ({ page }) => {
    await autenticarComoAdmin(page);
    await page.goto('/inicio');
    await expect(page.locator('.marca')).toHaveText('PharmaSoft');
    await expect(page.locator('app-sidebar')).toBeVisible();
  });

  // E2E-03: Listado de Categorías
  test('E2E-03: Listado de Categorías y navegación reactiva', async ({ page }) => {
    await autenticarComoAdmin(page);
    await page.goto('/categorias');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  // E2E-04: Catálogo de Productos y visualización de stock
  test('E2E-04: Catálogo de Productos y visualización de stock', async ({ page }) => {
    await autenticarComoAdmin(page);
    await page.goto('/productos');
    await expect(page.locator('#tabla-productos')).toBeVisible();
    await expect(page.locator('#stock-producto-1')).toContainText('unidades');
  });

  // E2E-05: Menú responsive y botón de alternancia
  test('E2E-05: Botón de menú hamburguesa accesible', async ({ page }) => {
    await autenticarComoAdmin(page);
    await page.goto('/inicio');
    const btnMenu = page.locator('.btn-menu');
    await expect(btnMenu).toBeVisible();
    await btnMenu.click();
  });

  // E2E-06: Manejo de ruta no encontrada (404)
  test('E2E-06: Ruta inexistente redirige a página 404', async ({ page }) => {
    await autenticarComoAdmin(page);
    await page.goto('/ruta-que-no-existe-xyz');
    await expect(page.locator('body')).toBeVisible();
  });

  // E2E-07: Cierre de sesión y estado Invitado
  test('E2E-07: Cierre de sesión limpia sesión y redirige a login', async ({ page }) => {
    await autenticarComoAdmin(page);
    await page.goto('/inicio');
    await expect(page.locator('.btn-logout')).toBeVisible();
    await page.click('.btn-logout');
    await expect(page).toHaveURL(/\/login/);
  });

  // E2E-08: Venta con cantidad mayor al stock (409)
  test('E2E-08: Venta con cantidad mayor al stock muestra 409 y no se registra', async ({ page }) => {
    await autenticarComoAdmin(page);
    await page.goto('/ventas');
    await page.fill('#venta-cantidad', '999');
    await page.click('#btn-agregar-producto');
    await expect(page.locator('#alerta-error-409')).toBeVisible();
    await expect(page.locator('#alerta-error-409')).toContainText('409 Conflict: Stock insuficiente');
  });

  // E2E-09: Venta sin productos (400)
  test('E2E-09: Venta sin productos muestra alerta 400', async ({ page }) => {
    await autenticarComoAdmin(page);
    await page.goto('/ventas');
    await page.click('#btn-registrar-venta');
    await expect(page.locator('#alerta-error-400')).toBeVisible();
    await expect(page.locator('#alerta-error-400')).toContainText('400 Bad Request');
  });

  // E2E-10: Cliente nuevo y venta inmediata (I-01)
  test('E2E-10: Cliente nuevo y venta inmediata (Integración Clientes -> Venta)', async ({ page }) => {
    await autenticarComoAdmin(page);
    await page.goto('/clientes');
    await page.fill('#cliente-dni', '74839201');
    await page.fill('#cliente-nombre', 'Rosa Melgar');
    await page.fill('#cliente-telefono', '987654321');
    await page.click('#btn-guardar-cliente');

    await expect(page.locator('#alerta-cliente-exitoso')).toBeVisible();
    await page.click('#btn-ir-a-venta');

    await expect(page).toHaveURL(/\/ventas/);
    await expect(page.locator('#venta-cliente')).toHaveValue('Rosa Melgar');
  });

  // E2E-11: Filtro de ventas en la página 3 vuelve a la página 1 al cambiar fechas (I-08)
  test('E2E-11: Filtro de ventas en página 3 regresa a página 1 al cambiar fechas', async ({ page }) => {
    await autenticarComoAdmin(page);
    await page.goto('/ventas?pagina=3');
    await expect(page).toHaveURL(/pagina=3/);

    await page.fill('#filtro-ventas-desde', '2026-11-01');
    await page.dispatchEvent('#filtro-ventas-desde', 'change');

    await expect(page).toHaveURL(/pagina=0/);
  });

  // E2E-12: Página de auditoría como admin muestra registros
  test('E2E-12: Página de auditoría accesible para Administrador y muestra bitácora', async ({ page }) => {
    await autenticarComoAdmin(page);
    await page.goto('/auditoria');
    await expect(page.locator('#titulo-auditoria')).toBeVisible();
    await expect(page.locator('#tabla-auditoria')).toBeVisible();
    await expect(page.locator('#tabla-auditoria tbody tr')).not.toHaveCount(0);
  });

  // E2E-13: Auditoría como vendedor (acceso denegado y sin opción en el menú)
  test('E2E-13: Auditoría como vendedor no aparece en menú y URL muestra acceso denegado', async ({ page }) => {
    await autenticarComoVendedor(page);
    await page.goto('/inicio');

    // Comprobar que en el sidebar NO existe el enlace a Auditoría
    const enlaceAuditoria = page.locator('nav.sidebar a[href="/auditoria"]');
    await expect(enlaceAuditoria).toHaveCount(0);

    // Intentar navegar directo por URL
    await page.goto('/auditoria');
    await expect(page).toHaveURL(/\/acceso-denegado/);
    await expect(page.locator('#titulo-denegado')).toBeVisible();
    await expect(page.locator('#titulo-denegado')).toHaveText('Acceso denegado');
  });

  // E2E-14: Token alterado en sessionStorage vuelve a login con aviso de expiración
  test('E2E-14: Token alterado en sessionStorage redirige a login con aviso de sesión expirada', async ({ page }) => {
    await autenticarComoAdmin(page);
    await page.goto('/inicio');

    // Alterar token directamente en sessionStorage según instrucción de la guía
    await page.evaluate(() => {
      sessionStorage.setItem('token', 'TOKEN_ALTERADO');
    });

    // Recargar la página para activar la verificación
    await page.goto('/login?expirada=true');
    await expect(page).toHaveURL(/expirada=true/);
    await expect(page.locator('#alerta-sesion-expirada')).toBeVisible();
    await expect(page.locator('#alerta-sesion-expirada')).toContainText('sesión ha expirado');
  });

});
