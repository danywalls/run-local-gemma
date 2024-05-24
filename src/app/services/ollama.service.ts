import { Injectable, signal } from '@angular/core';
import ollama from 'ollama';
import { Message } from '@progress/kendo-angular-conversational-ui';
import { gemmaIA, user } from '../entities/entities';

@Injectable({ providedIn: 'root' })
export class OllamaService {
  messages = signal<Message[]>([
    {
      author: gemmaIA,
      timestamp: new Date(),
      text: 'Hi! 👋 how I can help you!',
    },
  ]);

  async generate(text: string) {
    const gemmaMessage = {
      timestamp: new Date(),
      author: gemmaIA,
      typing: true,
    };

    const userMessage = {
      timestamp: new Date(),
      author: user,
      text,
    };

    this.messages.update((msg) => [...msg, userMessage, gemmaMessage]);

    await this.getGemmaResponse(text);
  }

  async getGemmaResponse(userMessage: string): Promise<void> {
    const responseStream = await ollama.chat({
      model: 'gemma',
      messages: [{ role: 'user', content: userMessage }],
      stream: true,
    });

    let responseContent = '';

    for await (const chunk of responseStream) {
      responseContent += chunk.message.content;

      this.messages.update((messages) => {
        const updatedMessages = [...messages];
        const lastMessageIndex = updatedMessages.length - 1;

        updatedMessages[lastMessageIndex] = {
          ...updatedMessages[lastMessageIndex],
          text: responseContent,
          typing: false,
        };

        return updatedMessages;
      });
    }
  }
}
