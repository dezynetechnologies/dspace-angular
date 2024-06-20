import { Component,ViewChild,ElementRef, OnInit, ViewEncapsulation } from '@angular/core';
import { SamvadAIService } from '../core/shared/samvad-ai/samvad-ai.service';
import { AudioButtonComponent } from '../audio-button/audio-button.component';
import * as $ from 'jquery';
import * as moment from 'moment';
//import { pipeline } from '@xenova/transformers';

@Component({
  selector: 'ds-chat-widget',
  standalone:true,
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.scss'],
  imports: [AudioButtonComponent],
  encapsulation: ViewEncapsulation.None 
})
export class ChatWidgetComponent implements OnInit{
  
    audioData: Float32Array | null = null;
    //worker: Worker;
    result: string | null = null;
    isBusy: boolean = false;
    selectedFile: File | null = null;
    fileQuery: string = '';
    now = moment();
    private mediaRecorder: MediaRecorder | undefined;
    private audioChunks: Blob[] = [];
    public isRecording: boolean = false;
    public buttonLabel: string = 'Start Recording';
    status: string = '';
    transcript: string = '';
    isModelLoading: boolean = false;
    isTranscribing: boolean = false;
    loadingProgress: number = 0;
   
    @ViewChild('chatIcon') chatIconRef!: ElementRef<HTMLInputElement>;
    @ViewChild('chatBox') chatBoxRef!: ElementRef<HTMLInputElement>;
    @ViewChild('chatList') chatListRef!: ElementRef<HTMLInputElement>;
    @ViewChild('userInput') userInputRef!: ElementRef<HTMLInputElement>;
    @ViewChild('attachmentDisp') attachDisplay!: ElementRef<HTMLDivElement>;


    constructor(public service: SamvadAIService) {
    
  }

  ngOnInit(): void {
   // this.loadModel();
    //this.loadAndTranscribeAudioFile('../../public/jfk.wav');
  }

  // loadModel(): void {
  //   this.isModelLoading = true;
  //   this.loadingProgress = 0;
  //   this.worker.postMessage({ model: 'Xenova/whisper-tiny', multilingual: false, quantized: false, subtask: 'transcribe', language: 'english' });
  // }
  
  showChat():void{
    const chatIcon = this.chatIconRef.nativeElement;
    const chatBox = this.chatBoxRef.nativeElement;
    chatIcon.classList.add("minimized");
    chatIcon.classList.remove("maximized");
    chatBox.classList.add("box-maximized");
    chatBox.classList.remove("box-minimized");
  }

  cancelChat():void{
    const chatIcon = this.chatIconRef.nativeElement;
    const chatBox = this.chatBoxRef.nativeElement;
    chatIcon.classList.add("maximized");
    chatIcon.classList.remove("minimized");
    chatBox.classList.add("box-minimized");
    chatBox.classList.remove("box-maximized");
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
      pdfIcon.src = '../../assets/images/pdf.png'; // Path to your PDF icon image
      pdfIcon.alt = 'PDF icon';
      pdfIcon.width = 20;
      at.appendChild(pdfIcon);
      const fileName = document.createElement('span');
      fileName.textContent = `${this.selectedFile.name}`;
      at.appendChild(fileName);
      
      // Generate bot response
      // const botMessage = document.createElement('div');
      // botMessage.className = 'message bot-message';
      // this.service.uploadFile(this.selectedFile,this.fileQuery).subscribe(response => botMessage.textContent = response.message);
      // chatBox.appendChild(botMessage);
    }
  }

  sendClick():void{
    const chatList = this.chatListRef.nativeElement;
    const userInput = this.userInputRef.nativeElement;
    if(!this.selectedFile){
      if (userInput.value.trim() !== '') {
        // Create user message
        const userMessage = document.createElement('li');
        const userDiv = document.createElement('div');
        const userIcon = document.createElement('i');
        const userSpan = document.createElement('span');
        userMessage.setAttribute('_ngcontent-dspace-angular-c379', '');
        userDiv.setAttribute('_ngcontent-dspace-angular-c379', '');
        userIcon.setAttribute('_ngcontent-dspace-angular-c379', '');
        userSpan.setAttribute('_ngcontent-dspace-angular-c379', '');
        userDiv.classList.add("userDiv");
        userIcon.classList.add("fa-solid");
        userIcon.classList.add("fa-person");
        userIcon.classList.add("center")
        userSpan.textContent = userInput.value;
        userSpan.classList.add("humanMessage");
        userDiv.appendChild(userIcon);
        userDiv.appendChild(userSpan);
        userMessage.appendChild(userDiv);
        chatList.appendChild(userMessage);
        this.fileQuery = userInput.value;

        const botMessage = document.createElement('li');
        const botDiv = document.createElement('div');
        const botIcon = document.createElement('i');
        const botSpan = document.createElement('span');
        const textSpan = document.createElement('span');
        const dateSpan = document.createElement('span');

        botMessage.setAttribute('_ngcontent-dspace-angular-c379', '');
        botDiv.setAttribute('_ngcontent-dspace-angular-c379', '');
        botIcon.setAttribute('_ngcontent-dspace-angular-c379', '');
        botSpan.setAttribute('_ngcontent-dspace-angular-c379', '');
        textSpan.setAttribute('_ngcontent-dspace-angular-c379', '');
        dateSpan.setAttribute('_ngcontent-dspace-angular-c379', '');
        botSpan.setAttribute('style', 'display:inline-flex');

        botIcon.classList.add("fa-solid");
        botIcon.classList.add("fa-robot");
        botDiv.appendChild(botIcon);
        this.service.uploadFile(this.selectedFile,userInput.value).subscribe(response => textSpan.textContent = response.message);
        textSpan.classList.add("botMessage");
        dateSpan.classList.add("date-span");
        dateSpan.classList.add("center");
        dateSpan.textContent = this.now.format('HH:mm');
        botSpan.appendChild(textSpan);
        botSpan.appendChild(dateSpan);
        botDiv.appendChild(botSpan);
        botMessage.appendChild(botDiv);
        chatList.appendChild(botMessage);
        userInput.value = '';
      }
    }  

    else{
      if (userInput.value.trim() !== '') {
         // Create user message
        const userMessage = document.createElement('li');
        const userDiv = document.createElement('div');
        const userIcon = document.createElement('i');
        const userSpan = document.createElement('span');
        userMessage.setAttribute('_ngcontent-dspace-angular-c379', '');
        userDiv.setAttribute('_ngcontent-dspace-angular-c379', '');
        userIcon.setAttribute('_ngcontent-dspace-angular-c379', '');
        userSpan.setAttribute('_ngcontent-dspace-angular-c379', '');
        userDiv.classList.add("userDiv");
        userIcon.classList.add("fa-solid");
        userIcon.classList.add("fa-person");
        userIcon.classList.add("center")

        const pdfIcon = document.createElement('img');
        pdfIcon.src = '../../../assets/images/pdf.png'; // Path to your PDF icon image
        pdfIcon.alt = 'PDF icon';
        pdfIcon.width = 20;
        const fileName = document.createElement('span');
        fileName.textContent = ` ${this.selectedFile.name}`;
        const attachDiv = document.createElement('div');
        attachDiv.setAttribute('_ngcontent-dspace-angular-c379', '');
        attachDiv.setAttribute('style', 'padding-right:10px;');
        attachDiv.classList.add("userDiv");
        attachDiv.appendChild(pdfIcon);
        attachDiv.appendChild(fileName);
        userMessage.appendChild(attachDiv);
        userSpan.textContent = userInput.value;
        userSpan.classList.add("humanMessage");
        userDiv.appendChild(userIcon);
        userDiv.appendChild(userSpan);
        userMessage.appendChild(userDiv);
        chatList.appendChild(userMessage);
        this.fileQuery = userInput.value;

        const botMessage = document.createElement('li');
        const botDiv = document.createElement('div');
        const botIcon = document.createElement('i');
        const botSpan = document.createElement('span');
        const textSpan = document.createElement('span');
        const dateSpan = document.createElement('span');

        this.service.uploadFile(this.selectedFile,userInput.value).subscribe(response => textSpan.textContent = response.message);
        botMessage.setAttribute('_ngcontent-dspace-angular-c379', '');
        botDiv.setAttribute('_ngcontent-dspace-angular-c379', '');
        botIcon.setAttribute('_ngcontent-dspace-angular-c379', '');
        botSpan.setAttribute('_ngcontent-dspace-angular-c379', '');
        textSpan.setAttribute('_ngcontent-dspace-angular-c379', '');
        dateSpan.setAttribute('_ngcontent-dspace-angular-c379', '');
        botSpan.setAttribute('style', 'display:inline-flex');

        botIcon.classList.add("fa-solid");
        botIcon.classList.add("fa-robot");
        dateSpan.classList.add("date-span");
        dateSpan.classList.add("center");
        botDiv.appendChild(botIcon);
        textSpan.classList.add("botMessage");
        dateSpan.textContent = this.now.format('HH:mm');
        botSpan.appendChild(textSpan);
        botSpan.appendChild(dateSpan);
        botDiv.appendChild(botSpan);
        botMessage.appendChild(botDiv);
        chatList.appendChild(botMessage);
        const at = this.attachDisplay.nativeElement;
        this.selectedFile = null;
        at.textContent = "";
        userInput.value = '';
      }
    }
  }
}
