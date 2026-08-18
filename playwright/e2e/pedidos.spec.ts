import { test } from '@playwright/test'
/// AAA - Arrange, Act, Assert
import { generateOrderCode } from './support/helpers';
import { OrderLockupPage, OrderDetails } from './support/pages/OrderLockupPage';
import { LandingPage } from './support/pages/LandingPage';
import { Navbar } from './support/components/Navbar';

test.describe('Consulta de Pedido', () => {

  test.beforeEach(async ({ page }) => {
    // Arrange
    //landing
    await new LandingPage(page).goto()
    await new LandingPage(page).validateHero()
    //arrange navega via compononte compartilhado
    await new Navbar(page).clickConsultarPedido()
    //assert confirma que estamos na pagina correta
    await new OrderLockupPage(page).validatePageLoaded()
  })

  test('deve consultar um pedido aprovado', async ({ page }) => {
    // Test Data
    const order: OrderDetails = {
      number: 'VLO-ZHH4X1',
      status: 'APROVADO',
      color: 'Glacier Blue',
      wheels: 'aero Wheels',
      customer: {
        name: 'Luana Seixas',
        email: 'luana@dev.com',
      },
      payment: 'À Vista',
    };

    const orderLookupPage = new OrderLockupPage(page)
    // Act
    await orderLookupPage.searchOrder(order.number)
    // Assert
    await orderLookupPage.validateOrderDetails(order)
    await orderLookupPage.validateStatusBadge('APROVADO')
  });

  test('deve consultar um pedido reprovado', async ({ page }) => {
    const order: OrderDetails = {
      number: 'VLO-6ZLYO4',
      status: 'REPROVADO',
      color: 'Glacier Blue',
      wheels: 'aero Wheels',
      customer: {
        name: 'Pollyana Seixas',
        email: 'pollysfontesseixas@gmail.com',
      },
      payment: 'À Vista',
    };

    const orderLookupPage = new OrderLockupPage(page)
    await orderLookupPage.searchOrder(order.number)
    await orderLookupPage.validateOrderDetails(order)
    await orderLookupPage.validateStatusBadge('REPROVADO')
  });

  test('deve exibir mensagem de erro quando o pedido não for encontrado', async ({ page }) => {
    const order = generateOrderCode()
    const orderLookupPage = new OrderLockupPage(page)
    await orderLookupPage.searchOrder(order)
    await orderLookupPage.validateOrderNotFound()
  });

  test('deve consultar um pedido em analise', async ({ page }) => {
    const order: OrderDetails = {
      number: 'VLO-X1NDVT',
      status: 'EM ANALISE',
      color: 'Glacier Blue',
      wheels: 'aero Wheels',
      customer: {
        name: 'Maria Luana',
        email: 'maria@dev.com',
      },
      payment: 'À Vista',
    };

    const orderLookupPage = new OrderLockupPage(page)
    await orderLookupPage.searchOrder(order.number)
    await orderLookupPage.validateOrderDetails(order)
    await orderLookupPage.validateStatusBadge('EM_ANALISE')
  });

});
