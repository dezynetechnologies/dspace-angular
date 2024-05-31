import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import * as annyang from 'annyang';
import { Context } from '../../core/shared/context.model';

@Component({
  selector: 'ds-samvad-ai-search-page',
  templateUrl: './samvad-ai-search-page.component.html',
  styleUrls: ['./samvad-ai-search-page.component.scss']
})

/**
 * Component that represents a search page for administrators
 */
export class SamvadAISearchPageComponent implements OnInit{
  /**
   * The context of this page
   */
  @ViewChild('userInput') userInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('chatBox') chatBoxRef!: ElementRef<HTMLDivElement>;
  selectedFile: File | null = null;

  ngOnInit(): void {
    if (annyang) {
      // Define voice commands
      const commands = {
        'attach': () => {
          this.onAttachmentClick();
        },
        'say *message': (message: string) => {
          this.sendMessage();
        }
        // Add more voice commands as needed
      };

      // Add commands to annyang
      annyang.addCommands(commands);

      // Start listening
      annyang.start();
    }
  }
  
  sendMessage(): void {
    const userInput = this.userInputRef.nativeElement;
    const chatBox = this.chatBoxRef.nativeElement;

    if (userInput.value.trim() !== '') {
      // Create user message
      const userMessage = document.createElement('div');
      userMessage.className = 'message user-message';
      userMessage.textContent = userInput.value;
      chatBox.appendChild(userMessage);

      // Clear the input
      userInput.value = '';

      // Generate bot response
      const botMessage = document.createElement('div');
      botMessage.className = 'message bot-message';
      botMessage.textContent = 'Hello!';
      chatBox.appendChild(botMessage);

      // Scroll to the bottom
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }
  
  onAttachmentClick():void{
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.onchange = (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        this.selectedFile = input.files[0];
        this.displaySelectedFile();
      }
    };
    fileInput.click();
  }

  displaySelectedFile(): void {
    const chatBox = this.chatBoxRef.nativeElement;

    if (this.selectedFile) {
      const fileMessage = document.createElement('div');
      fileMessage.className = 'message user-message gpt-message';
      const pdfIcon = document.createElement('img');
      pdfIcon.src = '../../../assets/images/pdf-icon.png'; // Path to your PDF icon image
      pdfIcon.alt = 'PDF icon';
      pdfIcon.width = 20;
      fileMessage.appendChild(pdfIcon);
      const fileName = document.createElement('span');
      fileName.textContent = ` ${this.selectedFile.name}`;
      fileMessage.appendChild(fileName);
      chatBox.appendChild(fileMessage);

      // Generate bot response
      const botMessage = document.createElement('div');
      botMessage.className = 'message bot-message';
      botMessage.textContent = 'Hello!';
      chatBox.appendChild(botMessage);
    }
  }

  onMicrophoneClick():void{}

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }
  context: Context = Context.AdminSearch;
}
