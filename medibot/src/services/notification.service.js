class NotificationService {
  constructor() {
    this.bot = null;
  }

  setBot(bot) {
    this.bot = bot;
  }

  async sendMessage(telegramId, message, options = {}) {
    if (!this.bot) {
      throw new Error('Bot instance not set');
    }

    try {
      await this.bot.telegram.sendMessage(telegramId, message, {
        parse_mode: 'HTML',
        ...options,
      });
      return true;
    } catch (error) {
      console.error(`Failed to send message to ${telegramId}:`, error.message);
      return false;
    }
  }

  async sendMessageWithKeyboard(telegramId, message, keyboard) {
    if (!this.bot) {
      throw new Error('Bot instance not set');
    }

    try {
      await this.bot.telegram.sendMessage(telegramId, message, {
        parse_mode: 'HTML',
        reply_markup: keyboard,
      });
      return true;
    } catch (error) {
      console.error(`Failed to send message to ${telegramId}:`, error.message);
      return false;
    }
  }

  async broadcastMessage(telegramIds, message) {
    const results = [];
    for (const id of telegramIds) {
      const success = await this.sendMessage(id, message);
      results.push({ telegramId: id, success });
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    return results;
  }
}

module.exports = new NotificationService();
