import { Component } from '@angular/core';

@Component({
  selector: 'ds-audio-button',
  standalone:true,
  templateUrl: './audio-button.component.html',
  styleUrls: ['./audio-button.component.scss']
})
export class AudioButtonComponent {

  onMicrophoneClick():void{
    // if (this.isRecording) {
    //   this.stopRecording();
    // } else {
    //   this.startRecording();
    // }
  }

  // startRecording() {
  //   navigator.mediaDevices.getUserMedia({ audio: true })
  //     .then(stream => {
  //       this.mediaRecorder = new MediaRecorder(stream);
  //       this.audioChunks = []; // Clear previous audio chunks
  //       this.mediaRecorder.ondataavailable = event => {
  //         if (event.data.size > 0) {
  //           this.audioChunks.push(event.data);
  //         }
  //       };
  //       this.mediaRecorder.start();
  //       this.isRecording = true;
  //       this.buttonLabel = 'Stop Recording';
  //     })
  //     .catch(error => console.error('Error accessing microphone:', error));
  // }

  // stopRecording() {
  //   if(this.mediaRecorder){
  //     this.mediaRecorder.stop();
  //     this.mediaRecorder.onstop = () => {
  //       const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
  //       const reader = new FileReader();
  //       reader.readAsArrayBuffer(audioBlob);
  //       reader.onloadend = () => {
  //         if (reader.result && typeof reader.result !== 'string') {
  //           console.log(reader.result);
  //           this.processArrayBuffer(reader.result as ArrayBuffer);
  //         } else {
  //           console.error('Error reading audio data');
  //         }
  //       };
  //     };
  //   }
  //   this.isRecording = false;
  //   this.buttonLabel = 'Start Recording';
  // }

  // async processArrayBuffer(arrayBuffer: ArrayBuffer): Promise<void> {
  //   const audioCTX = new (window.AudioContext || (window as any).webkitAudioContext)({
  //     sampleRate: 16000,
  //   });
  //   try {
  //     const audioBuffer = await audioCTX.decodeAudioData(arrayBuffer);
  //     console.log(audioBuffer.length)
  //     this.transcribe(audioBuffer);
  //   } catch (error) {
  //     console.error('Error decoding audio data:', error);
  //   }
  // }

  // async transcribe(audioData: AudioBuffer) {
  //   this.isBusy = true;

  //   let audio: Float32Array;
  //   if (audioData.numberOfChannels === 2) {
  //     const SCALING_FACTOR = Math.sqrt(2);

  //     let left = audioData.getChannelData(0);
  //     let right = audioData.getChannelData(1);

  //     audio = new Float32Array(audioData.length);
  //     for (let i = 0; i < audioData.length; ++i) {
  //       audio[i] = SCALING_FACTOR * (left[i] + right[i]) / 2;
  //     }
  //   } else {
  //     // If the audio is not stereo, we can just use the first channel:
  //     audio = audioData.getChannelData(0);
  //     console.log(audio);
  //   }

  //   this.worker.postMessage({
  //     model: 'Xenova/whisper-tiny',
  //     multilingual: false,
  //     quantized: false,
  //     subtask: 'transcribe',
  //     language: 'english',
  //     audio: audio,
  //   });

  //   if(this.result){
  //     const userInput = this.userInputRef.nativeElement;
  //     userInput.textContent = this.result;
  //     this.result = null;
  //   }
  // }
}
