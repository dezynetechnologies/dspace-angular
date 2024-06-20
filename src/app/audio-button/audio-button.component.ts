import { Component,ElementRef,ViewChild } from '@angular/core';

@Component({
  selector: 'ds-audio-button',
  standalone:true,
  templateUrl: './audio-button.component.html',
  styleUrls: ['./audio-button.component.scss']
})
export class AudioButtonComponent {

  audioData: Float32Array | null = null;
  worker: Worker;
  result: string | null = null;
  isBusy: boolean = false;
  fileQuery: string = '';
  private mediaRecorder: MediaRecorder | undefined;
  private audioChunks: Blob[] = [];
  public isRecording: boolean = false;
  status: string = '';
  isModelLoading: boolean = false;
  isTranscribing: boolean = false;
  loadingProgress: number = 0;

  @ViewChild('microphoneButton') microphone!: ElementRef<HTMLDivElement>;

  constructor() {
    // this.worker = new Worker(new URL('../../assets/worker.js', import.meta.url), {
    //   type: 'module',
    // });

    this.worker = new Worker('../../assets/worker.js', {
      type: 'module',
    });

    this.worker.onmessage = (event) => {
      const { type, progress, transcript, error } = event.data;
      if (type === 'modelProgress') {
        this.loadingProgress = progress;
      } else if (type === 'modelLoaded') {
        this.isModelLoading = false;
        console.log('Model loaded successfully');
      } else if (type === 'transcriptionComplete') {
        this.isTranscribing = false;
        this.result = transcript;
        console.log('Transcription complete:', this.result);
      } else if (type === 'error') {
        console.error('Error:', error);
        this.isModelLoading = false;
        this.isTranscribing = false;
      }
    };
  }

  ngOnInit(): void {
   this.loadModel();
  }

  loadModel(): void {
    this.isModelLoading = true;
    this.loadingProgress = 0;
    this.worker.postMessage({ model: 'Xenova/whisper-tiny', multilingual: false, quantized: false, subtask: 'transcribe', language: 'english' });
  }

  onMicrophoneClick():void{
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  startRecording() {
    const microphoneButton = this.microphone.nativeElement;
    microphoneButton.setAttribute('_ngcontent-dspace-angular-c379', '');
    microphoneButton.classList.add("start-recording");
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = []; // Clear previous audio chunks
        this.mediaRecorder.ondataavailable = event => {
          if (event.data.size > 0) {
            this.audioChunks.push(event.data);
          }
        };
        console.log("Recording started");
        this.mediaRecorder.start();
        this.isRecording = true;
      })
      .catch(error => console.error('Error accessing microphone:', error));
  }

  stopRecording() {
    const microphoneButton = this.microphone.nativeElement;
    microphoneButton.setAttribute('_ngcontent-dspace-angular-c379', '');
    microphoneButton.classList.remove("start-recording");
    if(this.mediaRecorder){
      this.mediaRecorder.stop();
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.readAsArrayBuffer(audioBlob);
        reader.onloadend = () => {
          if (reader.result && typeof reader.result !== 'string') {
            console.log("Recording stopped");
            console.log(reader.result);
            this.processArrayBuffer(reader.result as ArrayBuffer);
          } else {
            console.error('Error reading audio data');
          }
        };
      };
    }
    this.isRecording = false;
  }

  async processArrayBuffer(arrayBuffer: ArrayBuffer): Promise<void> {
    const audioCTX = new (window.AudioContext || (window as any).webkitAudioContext)({
      sampleRate: 16000,
    });
    try {
      const audioBuffer = await audioCTX.decodeAudioData(arrayBuffer);
      console.log(audioBuffer)
      this.transcribe(audioBuffer);
    } catch (error) {
      console.error('Error decoding audio data:', error);
    }
  }

  async transcribe(audioData: AudioBuffer) {
    this.isBusy = true;

    let audio: Float32Array;
    if (audioData.numberOfChannels === 2) {
      const SCALING_FACTOR = Math.sqrt(2);

      let left = audioData.getChannelData(0);
      let right = audioData.getChannelData(1);

      audio = new Float32Array(audioData.length);
      for (let i = 0; i < audioData.length; ++i) {
        audio[i] = SCALING_FACTOR * (left[i] + right[i]) / 2;
      }
    } else {
      // If the audio is not stereo, we can just use the first channel:
      audio = audioData.getChannelData(0);
      console.log(audio);
    }

    this.worker.postMessage({
      model: 'Xenova/whisper-tiny',
      multilingual: false,
      quantized: false,
      subtask: 'transcribe',
      language: 'english',
      audio: audio,
    });
  }
}
