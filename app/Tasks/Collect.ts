import CrawlerService from '@ioc:Adonis/Services/Crawler'
import { BaseTask } from 'adonis5-scheduler/build/src/Scheduler/Task'

export default class Collect extends BaseTask {
  public static get schedule() {
    return '* * * * * *'
  }
  /**
   * Set enable use .lock file for block run retry task
   * Lock file save to `build/tmpTaskLock`
   */
  public static get useLock() {
    return true
  }

  public async handle() {
    await CrawlerService.crawl()
    this.logger.info('Handled')
  }
}
