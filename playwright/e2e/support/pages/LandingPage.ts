import { Page, expect } from '@playwright/test'

export class LandingPage {
    constructor(private page: Page) { }

    async goto() {
        await this.page.goto('/')
    }

    async validateHero() {
        await expect(
            this.page.getByTestId('hero-section').getByRole('heading', { name: 'Velô Sprint' })
        ).toBeVisible()
    }
}
