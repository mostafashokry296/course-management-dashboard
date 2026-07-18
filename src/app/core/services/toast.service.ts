import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
     id: number;
     message: string;
     type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
     private nextId = 0;
     toasts = signal<ToastMessage[]>([]);

     show(message: string, type: ToastType = 'success'): void {
          const id = this.nextId++;
          this.toasts.update(current => [...current, { id, message, type }]);

          setTimeout(() => {
               this.remove(id);
          }, 3000);
     }

     success(message: string): void {
          this.show(message, 'success');
     }

     error(message: string): void {
          this.show(message, 'error');
     }

     remove(id: number): void {
          this.toasts.update(current => current.filter(t => t.id !== id));
     }
}