import fs from 'fs/promises';

class MessageManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async getMessages() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data || '[]'); 
        } catch (error) {
            console.error("Error leyendo el archivo de mensajes:", error);
            return []; 
        }
    }

    async saveMessage(message) {
        try {
            const messages = await this.getMessages();
            messages.push(message);
            await fs.writeFile(this.filePath, JSON.stringify(messages, null, 2));
        } catch (error) {
            console.error("Error guardando el mensaje:", error);
        }
    }
}

export default MessageManager;