import { Component, inject } from '@angular/core';
import { ChatModule } from '@progress/kendo-angular-conversational-ui';
import { user } from './entities/entities';
import { OllamaService } from './services/ollama.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChatModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  protected readonly user = user;
  protected readonly _ollamaService = inject(OllamaService);
  $messages = this._ollamaService.messages;

  async generate($event: any): Promise<void> {
    const { text } = $event.message;
    await this._ollamaService.generate(text);
  }
}
