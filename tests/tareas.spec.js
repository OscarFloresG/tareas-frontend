import { test, expect } from '@playwright/test';

const loginBypass = async (page) => {
  await page.goto('/');
  await page.click('button:has-text("Simulación (Bypass)")');
  await expect(page.locator('button:has-text("Cerrar Sesión")')).toBeVisible();
};

const isAdminSession = async (page) => {
  return (await page.locator('button:has-text("Gestionar Usuarios")').count()) > 0;
};

const createTaskWithTag = async (page, title, tag) => {
  await page.getByLabel('¿Qué tarea tienes pendiente?').fill(title);
  await page.getByLabel('Asignar Etiquetas (Escribe para crear una nueva)').click({ force: true });
  await page.keyboard.type(tag);
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Guardar' }).click();
  await expect(page.locator(`text=${title}`)).toBeVisible();
  await expect(page.locator(`text=${tag.toUpperCase()}`)).toBeVisible();
};

const deleteTask = async (page, title) => {
  const taskRow = page.locator(`.v-list-item:has-text("${title}")`).first();
  await expect(taskRow).toBeVisible();
  await taskRow.locator('button').last().click();
  await expect(page.locator(`text=${title}`)).not.toBeVisible();
};

const filterByTag = async (page, tag) => {
  const filter = page.getByRole('combobox', { name: 'Filtrar por etiquetas...' });
  await filter.click({ force: true });
  await filter.fill(tag);
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Filtrar' }).click();
};

test.describe('Pruebas E2E de Gestión de Tareas', () => {
  test.beforeEach(async ({ page }) => {
    await loginBypass(page);
  });

  test('Autenticación - Login y Logout', async ({ page }) => {
    await expect(page.locator('button:has-text("Cerrar Sesión")')).toBeVisible();
    await expect(page.locator('text=Tareas - Acceso Seguro')).not.toBeVisible();

    await page.click('button:has-text("Cerrar Sesión")');
    await expect(page.locator('text=Tareas - Acceso Seguro')).toBeVisible();
  });

  test('Gestión de Usuarios (Admin) - Abrir diálogo de gestión de usuarios', async ({ page }) => {
    if (!(await isAdminSession(page))) {
      test.skip('No hay sesión admin activa para este entorno');
    }

    await page.click('button:has-text("Gestionar Usuarios")');
    await expect(page.locator('text=Gestión de Usuarios')).toBeVisible();
  });

  test('CRUD Tareas y Etiquetas - Crear tarea con etiqueta y eliminarla', async ({ page }) => {
    const title = `Tarea E2E ${Date.now()}`;
    const tag = `Tag E2E ${Math.floor(Math.random() * 10000)}`;

    await createTaskWithTag(page, title, tag);
    await deleteTask(page, title);
  });

  test('Búsquedas Usuario Normal - Filtrar por etiquetas', async ({ page }) => {
    const title = `Task Filter E2E ${Date.now()}`;
    const tag = `FilterTag E2E ${Math.floor(Math.random() * 10000)}`;

    await createTaskWithTag(page, title, tag);
    await filterByTag(page, tag);
    await expect(page.locator('.v-list-item-title', { hasText: title })).toBeVisible();
  });

  test('Búsquedas Admin - Búsquedas Globales', async ({ page }) => {
    if (!(await isAdminSession(page))) {
      test.skip('No hay sesión admin activa para este entorno');
    }

    await page.click('button:has-text("Búsquedas Globales")');
    await expect(page.locator('text=Búsquedas Globales')).toBeVisible();
    await page.getByLabel('Buscar...').fill('test');
    await page.getByRole('button', { name: 'Buscar' }).click();
    await expect(page.locator('text=Búsquedas Globales')).toBeVisible();
  });
});