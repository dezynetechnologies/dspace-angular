import { Component, ElementRef, ViewChild } from '@angular/core';
import { SamvadAIService } from 'src/app/core/shared/samvad-ai/samvad-ai.service';

@Component({
  selector: 'ds-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {

  constructor(public service: SamvadAIService) {}

  @ViewChild('userInput') userInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('chatBox') chatBoxRef!: ElementRef<HTMLDivElement>;
  @ViewChild('attachmentDisp') attachDisplay!: ElementRef<HTMLDivElement>;
  selectedFile: File | null = null;
  fileQuery: string = '';

  sendMessage(): void {
    const userInput = this.userInputRef.nativeElement;
    const chatBox = this.chatBoxRef.nativeElement;
    if(!this.selectedFile){
      if (userInput.value.trim() !== '') {
       

        const userDiv = document.createElement('div');
        const userMessage = document.createElement('div');
        const userIcon = document.createElement('i');
        userMessage.classList.add("message") 
        userMessage.classList.add("user-message");
        userMessage.setAttribute('_ngcontent-dspace-angular-c491', '');
        userIcon.classList.add("fa-solid");
        userIcon.classList.add("fa-person");
        userIcon.classList.add("center");
        userIcon.setAttribute('_ngcontent-dspace-angular-c491', '');
        userDiv.setAttribute('_ngcontent-dspace-angular-c491', '');
        userDiv.classList.add("userDiv");
        userMessage.textContent = userInput.value;
        userDiv.appendChild(userMessage);  
        userDiv.appendChild(userIcon);
        chatBox.appendChild(userDiv);

        // Clear the input
        userInput.value = '';

        // Generate bot response
        const botMessage = document.createElement('div');
        const botDiv = document.createElement('div');
        const botIcon = document.createElement('i');
        botMessage.className = "message bot-message";
        botMessage.setAttribute('_ngcontent-dspace-angular-c491', '');
        botDiv.setAttribute('_ngcontent-dspace-angular-c491', '');
        botDiv.classList.add("botDiv");
        botIcon.setAttribute('_ngcontent-dspace-angular-c491', '');
        botIcon.classList.add("fa-solid");
        botIcon.classList.add("fa-robot");
        botIcon.classList.add("center");
        botDiv.appendChild(botIcon);
        botDiv.appendChild(botMessage);
        
        this.service.uploadFile(this.selectedFile,userInput.value).subscribe(response => botMessage.textContent = response.message);
        chatBox.appendChild(botDiv);

        // Scroll to the bottom
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    }
    else{
      if (userInput.value.trim() !== '') {
        const userDiv = document.createElement('div');
        const userMessage = document.createElement('div');
        const userIcon = document.createElement('i');
        userMessage.classList.add("message") 
        userMessage.classList.add("user-message");
        userMessage.setAttribute('_ngcontent-dspace-angular-c491', '');
        userIcon.classList.add("fa-solid");
        userIcon.classList.add("fa-person");
        userIcon.classList.add("center");
        userIcon.setAttribute('_ngcontent-dspace-angular-c491', '');
        userDiv.setAttribute('_ngcontent-dspace-angular-c491', '');
        userDiv.classList.add("userDiv");
        userMessage.textContent = userInput.value;
        userDiv.appendChild(userMessage);  
        userDiv.appendChild(userIcon);
        
        const containerDiv = document.createElement('div');
        const pdfIcon = document.createElement('img');
        pdfIcon.src = '../../../assets/images/pdf.png'; // Path to your PDF icon image
        pdfIcon.alt = 'PDF icon';
        pdfIcon.width = 20;
        containerDiv.classList.add("right");
        containerDiv.appendChild(pdfIcon);
        const fileName = document.createElement('span');
        fileName.textContent = ` ${this.selectedFile.name}`;
        containerDiv.setAttribute('_ngcontent-dspace-angular-c491', '');
        containerDiv.appendChild(fileName);
        chatBox.appendChild(containerDiv);
        chatBox.appendChild(userDiv);

        // Generate bot response
        const botMessage = document.createElement('div');
        const botDiv = document.createElement('div');
        const botIcon = document.createElement('i');
        botMessage.className = "message bot-message";
        botMessage.setAttribute('_ngcontent-dspace-angular-c491', '');
        botDiv.setAttribute('_ngcontent-dspace-angular-c491', '');
        botDiv.classList.add("botDiv");
        botIcon.setAttribute('_ngcontent-dspace-angular-c491', '');
        botIcon.classList.add("fa-solid");
        botIcon.classList.add("fa-robot");
        botIcon.classList.add("center");
        botDiv.appendChild(botIcon);
        botDiv.appendChild(botMessage);
        
        this.service.uploadFile(this.selectedFile,userInput.value).subscribe(response => botMessage.textContent = response.message);
        chatBox.appendChild(botDiv);
        const at = this.attachDisplay.nativeElement;
        this.selectedFile = null;
        at.textContent = "";
        // Clear the input
        userInput.value = '';
        // Scroll to the bottom
        chatBox.scrollTop = chatBox.scrollHeight;
      }
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
    const at = this.attachDisplay.nativeElement;

    if (this.selectedFile) {
      const pdfIcon = document.createElement('img');
      pdfIcon.src = '../../../assets/images/pdf.png'; // Path to your PDF icon image
      pdfIcon.alt = 'PDF icon';
      pdfIcon.width = 20;
      at.appendChild(pdfIcon);
      const fileName = document.createElement('span');
      fileName.textContent = ` ${this.selectedFile.name}`;
      at.appendChild(fileName);
    }
  }

  onMicrophoneClick():void{}

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }
}
