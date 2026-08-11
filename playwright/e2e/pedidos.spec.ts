import { test, expect } from '@playwright/test'
///AAA - Preparar, agir, verificar
import { generateOrderCode } from './support/helpers';
import { OrderLockupPage } from './support/pages/OrderLockupPage';

test('deve consultar um pedido aprovado', async ({ page }) => {
  //definir dados de teste
  //const order = 'VLO-U32QEM'
  const order = {
    number: 'VLO-ZHH4X1',
    color: 'Glacier Blue',
    wheels: 'aero Wheels',
    status: 'APROVADO' as const,

    customer: {
      name: 'Luana Seixas',
      email: 'luana@dev.com',
    },

    payment: 'À Vista',
  };

  const orderLookupPage = new OrderLockupPage(page)
  //Preparar
  await page.goto('http://localhost:5173/')
  await expect(page.getByTestId('hero-section').getByRole('heading', { name: 'Velô Sprint' })).toBeVisible()
  //Ação - Agir
  await page.getByRole('link', { name: 'Consultar Pedido' }).click()
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido')
  //identificção visual humanizar as indicações de que o teste está sendo executado
  //encontrar label de texto que contenha o texto "numero pedido"
  //('//label[contains(text(), "Numero Pedido")]')
  //verificar Act
  await orderLookupPage.searchOrder(order.number)
  //await page.waitForTimeout(10000);fica esperado
  //tempo de espera para o elemento ser visivel-explicito melhor para o teste
  // await expect(page.getByTestId('order-result-id')).toBeVisible({ timeout: 10000 })
  // await expect(page.getByTestId('order-result-id')).toContainText(order)
  // await expect(page.getByTestId('order-result-status')).toBeVisible()
  // await expect(page.getByTestId('order-result-status')).toContainText('APROVADO')
  //implementar uma validação para estilização da cor do texto do pedido em analise (componente0)
  //validar classe verficiação de estilo
  await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
    - img
    - paragraph: Pedido
    - paragraph: ${order.number}
    - status:
      - img
      - text: ${order.status}
    - img "Velô Sprint"
    - paragraph: Modelo
    - paragraph: Velô Sprint
    - paragraph: Cor
    - paragraph: ${order.color}
    - paragraph: Interior
    - paragraph: cream
    - paragraph: Rodas
    - paragraph: ${order.wheels}
    - heading "Dados do Cliente" [level=4]
    - paragraph: Nome
    - paragraph: ${order.customer.name}
    - paragraph: Email
    - paragraph: ${order.customer.email}
    - paragraph: Loja de Retirada
    - paragraph
    - paragraph: Data do Pedido
    - paragraph: /\\d+\\/\\d+\\/\\d+/
    - heading "Pagamento" [level=4]
    - paragraph: ${order.payment}
    - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
  `);

  await orderLookupPage.validateStatusBadge(order.status)
});
//interpola variavel para teste dinamico - Use backticks.
//disposição onde os testes são rendereizados - funciona muito bem testes de regressão snapshot
//toHaveClass(/bg-green-100/) troca aspas simmples por barras invertidas "contem"para validar classe 

test('deve consultar um pedido reprovado', async ({ page }) => {
  const order = {
    number: 'VLO-6ZLYO4',
    color: 'Glacier Blue',
    wheels: 'aero Wheels',
    status: 'REPROVADO' as const,
    customer: {
      name: 'Pollyana Seixas',
      email: 'pollysfontesseixas@gmail.com',
    },
    payment: 'À Vista',
  };

  const orderLookupPage = new OrderLockupPage(page)
  await page.goto('http://localhost:5173/');
  await expect(page.getByTestId('hero-section').getByRole('heading', { name: 'Velô Sprint' })).toBeVisible();
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido');
  await orderLookupPage.searchOrder(order.number)
  await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
    - img
    - paragraph: Pedido
    - paragraph: ${order.number}
    - status:
      - img
      - text: ${order.status}
    - img "Velô Sprint"
    - paragraph: Modelo
    - paragraph: Velô Sprint
    - paragraph: Cor
    - paragraph: ${order.color}
    - paragraph: Interior
    - paragraph: cream
    - paragraph: Rodas
    - paragraph: ${order.wheels}
    - heading "Dados do Cliente" [level=4]
    - paragraph: Nome
    - paragraph: ${order.customer.name}
    - paragraph: Email
    - paragraph: ${order.customer.email}
    - paragraph: Loja de Retirada
    - paragraph
    - paragraph: Data do Pedido
    - paragraph: /\\d+\\/\\d+\\/\\d+/
    - heading "Pagamento" [level=4]
    - paragraph: ${order.payment}
    - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
  `);

  await orderLookupPage.validateStatusBadge(order.status)
});


test('deve exibir mensagem de erro quando o pedido não for encontrado', async ({ page }) => {
  const order = generateOrderCode()
  const orderLookupPage = new OrderLockupPage(page)
  await page.goto('http://localhost:5173/')
  await expect(page.getByTestId('hero-section').getByRole('heading', { name: 'Velô Sprint' })).toBeVisible()
  await page.getByRole('link', { name: 'Consultar Pedido' }).click()
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido')
  await orderLookupPage.searchOrder(order)
  await expect(page.locator('#root')).toContainText('Verifique o número do pedido e tente novamente')
  await expect(page.locator('#root')).toContainText('Pedido não encontrado')
  await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - img
    - heading "Pedido não encontrado" [level=3]
    - paragraph: Verifique o número do pedido e tente novamente
    `) // verfica se na area tem a imagem, heading e paragraph - titulo level 3 

});
// await expect(page.locator('#root')).toContainText('Verifique o número do pedido e tente novamente')
// await expect(page.locator('#root')).toContainText('Pedido não encontrado')
//P html não é acessivel para o playwright
//  const title = page.getByRole('heading', { name: 'Pedido não encontrado' })
//  await expect(title).toBeVisible()
//  const message = page.locator('p',{hasText:'Verifique o número do pedido e tente novamente'})
//  await expect(message).toBeVisible()
//  const title = page.getByRole('heading', { name: 'Pedido não encontrado' })
//  await expect(title).toBeVisible()
//usar solução getbytext
//root raiz todo html
//xpath  const message = page.locator('//p[text()="Verifique o número do pedido e tente novamente"]')
//await expect(message).toBeVisible()
//expressao regular melhor para o teste de regressão snapshot
//^começa com $ termina com
//exeplo const containerPedido = page.getbyrole('paragraph').filter({hasText: /^Pedidos$/})

test('deve consultar um pedido em analise', async ({ page }) => {
  const order = {
    number: 'VLO-X1NDVT',
    color: 'Glacier Blue',
    wheels: 'aero Wheels',
    status: 'EM_ANALISE' as const,
    displayStatus: 'EM ANALISE',
    customer: {
      name: 'Maria Luana',
      email: 'maria@dev.com',
    },
    payment: 'À Vista',
  };

  const orderLookupPage = new OrderLockupPage(page)
  await page.goto('http://localhost:5173/');
  await expect(page.getByTestId('hero-section').getByRole('heading', { name: 'Velô Sprint' })).toBeVisible();
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido');
  await orderLookupPage.searchOrder(order.number)
  await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
    - img
    - paragraph: Pedido
    - paragraph: ${order.number}
    - status:
      - img
      - text: ${order.displayStatus}
    - img "Velô Sprint"
    - paragraph: Modelo
    - paragraph: Velô Sprint
    - paragraph: Cor
    - paragraph: ${order.color}
    - paragraph: Interior
    - paragraph: cream
    - paragraph: Rodas
    - paragraph: ${order.wheels}
    - heading "Dados do Cliente" [level=4]
    - paragraph: Nome
    - paragraph: ${order.customer.name}
    - paragraph: Email
    - paragraph: ${order.customer.email}
    - paragraph: Loja de Retirada
    - paragraph
    - paragraph: Data do Pedido
    - paragraph: /\\d+\\/\\d+\\/\\d+/
    - heading "Pagamento" [level=4]
    - paragraph: ${order.payment}
    - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
  `);

  await orderLookupPage.validateStatusBadge(order.status)
});
//TDD testei implemntei usando estilização do componente framework tailwind css