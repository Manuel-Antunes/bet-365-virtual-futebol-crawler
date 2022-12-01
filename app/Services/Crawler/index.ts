import { Browser, Device, Page } from 'puppeteer'
import PCR from 'puppeteer-chromium-resolver'
import puppeteer from 'puppeteer-extra'

export default class CrawlerService {
  private browser: Browser

  private readonly device: Device = {
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.62',
    viewport: {
      width: 1920,
      height: 1080,
    },
  }

  public async init() {
    const option = {
      revision: '',
      detectionPath: '',
      folderName: '.chromium-browser-snapshots',
      defaultHosts: ['https://storage.googleapis.com', 'https://npm.taobao.org/mirrors'],
      hosts: [],
      cacheRevisions: 2,
      retry: 3,
      silent: false,
    }
    const stats = await PCR(option)
    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-extensions',
        '--disable-dev-tools',
        '--disable-infobars',
        '--ignore-certificate-errors',
        '--start-maximized',
        '--disable-blink-features=AutomationControlled',
      ],
      headless: false,
      ignoreHTTPSErrors: true,
      executablePath: process.env.CHROME_BIN || stats.executablePath,
    })
    // const stealth = StealthPlugin()
    // stealth.enabledEvasions.delete('chrome.runtime')
    // stealth.enabledEvasions.delete('iframe.contentWindow')
    // puppeteer.use(stealth)
    this.browser = browser
  }

  public async crawl() {
    // await this.testHeadless()
    await this.goToVirtualFootball()
  }

  public async testHeadless() {
    const page = await this.openPage()
    await page.goto('https://bot.sannysoft.com')
    await page.waitForTimeout(5000)
    await page.screenshot({ path: 'testresult.png', fullPage: true })
    await page.close()
  }

  public async goToVirtualFootball() {
    const page = await this.openPage()
    await this.setCookies(page)
    await page.goto('https://www.bet365.com/#/HO/')
    console.log('oi')
    await page.waitForSelector(
      '.g5-Application > .ccm-CookieConsentPopup > .ccm-CookieConsentPopup_ContentContainer > .ccm-CookieConsentPopup_ButtonContainer > .ccm-CookieConsentPopup_Accept'
    )
    await page.click(
      '.g5-Application > .ccm-CookieConsentPopup > .ccm-CookieConsentPopup_ContentContainer > .ccm-CookieConsentPopup_ButtonContainer > .ccm-CookieConsentPopup_Accept'
    )

    await page.waitForSelector(
      '.wn-WebNavModule > .wn-Menu > .wn-PreMatchGroup > .wn-PreMatchItem:nth-child(21) > span'
    )
    await page.click(
      '.wn-WebNavModule > .wn-Menu > .wn-PreMatchGroup > .wn-PreMatchItem:nth-child(21) > span'
    )

    await page.waitForSelector(
      '.wcl-CommonElementStyle_PrematchCenter > .vs-VirtualSplashModule-pagewide > .vs-VirtualSplashModule_Container > .vs-VirtualSplashPod > .vs-VirtualSplashPod_Image-146'
    )
    await page.click(
      '.wcl-CommonElementStyle_PrematchCenter > .vs-VirtualSplashModule-pagewide > .vs-VirtualSplashModule_Container > .vs-VirtualSplashPod > .vs-VirtualSplashPod_Image-146'
    )
    await this.browser.close()
  }

  private async setCookies(page: Page) {
    const cookies = [
      // cookie exported by google chrome plugin editthiscookie
      {
        domain: '.' + 'bet365.com',
        expirationDate: +Date.now() / 1000 + 10 * 36 * 24 * 3600,
        name: 'aps03',
        path: '/',
        value: 'lng=1&tzi=1&oty=2&ct=197&cg=0&cst=0&hd=N&cf=N',
      },
      {
        domain: '.' + 'bet365.com',
        expirationDate: +Date.now() / 1000 + 10 * 36 * 24 * 3600,
        name: 'session',
        path: '/',
        value: 'processform=0',
      },
    ]
    await page.setCookie(...cookies)
  }

  private async openPage() {
    const context = await this.browser.createIncognitoBrowserContext()
    const page = await context.newPage()

    const pages = await this.browser.pages()
    if (pages.length > 1) {
      await pages[0].close()
    }
    await page.emulate(this.device)
    return page
  }
}
