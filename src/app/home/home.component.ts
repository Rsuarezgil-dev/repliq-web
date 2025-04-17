import { ChangeDetectorRef, Component, ElementRef, HostListener, QueryList, ViewChildren } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  isScrolled: boolean = false; // Variable para rastrear el estado del scroll
  isHeaderFixed: boolean = false;
  isMenuOpen: boolean = false;
  @ViewChildren('videoPlayer') videoPlayers!: QueryList<ElementRef>;
  currentYear: string = moment().format('YYYY'); // Obtiene el año actual
  isOpen: boolean[] = [false, false, false]; // Estado de cada acordeón

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {

    setTimeout(() => {
      this.cdr.detectChanges();
      this.playVideos();
    }, 1000);

    // Inicializa el efecto de escritura al cargar el componente
    const startTyping = () => {
      this.typeEffect(
        'typed-line-1',
        ['Simulación estratégica'],
        100,
        () => {
          this.typeEffect(
            'typed-line-2',
            ['resultados reales'],
            100,
            () => {
              this.typeEffect(
                'typed-subtext',
                ['Valida tus estrategias con perfiles sintéticos impulsados con IA.'],
                50,
                () => {
                  setTimeout(() => {
                    // Limpia los textos antes de reiniciar
                    document.getElementById('typed-line-1')!.innerHTML = '';
                    document.getElementById('typed-line-2')!.innerHTML = '';
                    document.getElementById('typed-subtext')!.innerHTML = '';
                    startTyping(); // Reinicia el efecto
                  }, 4000); // Pausa de 3 segundos antes de reiniciar
                }
              );
            }
          );
        }
      );
    };

    startTyping();

  }


  ngAfterViewInit(): void {
    this.videoPlayers.forEach((videoRef) => {
      const video = videoRef.nativeElement as HTMLVideoElement;

      // Asegurar que el video esté silenciado antes de intentar reproducirlo
      video.muted = true;

      // Intentar reproducir solo cuando el video esté listo
      video.addEventListener('canplaythrough', () => {
        video.play().catch(error => console.warn('Reproducción bloqueada por el navegador.', error));
      });
    });
  }

  typeEffect(elementId: string, texts: string[], typingSpeed: number, callback?: () => void): void {
    const element = document.getElementById(elementId);
    let textIndex = 0;
    let charIndex = 0;

    const type = () => {
      if (element && textIndex < texts.length) {
        if (charIndex < texts[textIndex].length) {
          element.innerHTML = texts[textIndex].substring(0, charIndex + 1) + '<span class="cursor">|</span>';
          charIndex++;
          setTimeout(type, typingSpeed);
        } else {
          // Elimina el cursor al completar el texto
          element.innerHTML = texts[textIndex];
          textIndex++;
          charIndex = 0;
          if (textIndex < texts.length) {
            setTimeout(type, 1000); // Pausa antes de comenzar el siguiente texto
          } else if (callback) {
            callback(); // Llama al callback cuando termine
          }
        }
      }
    };

    type();
  }

  playVideos(): void {
    this.videoPlayers.forEach((videoRef) => {
      const video = videoRef.nativeElement as HTMLVideoElement;
      video.muted = true;
      video.play().catch(error => console.warn('Reproducción bloqueada. Se intentará después de una interacción del usuario.', error));
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen; // Alterna el estado del menú
  }

  toggleAccordion(index: number): void {
    this.isOpen[index] = !this.isOpen[index]; // Alterna el estado del acordeón seleccionado
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    this.isScrolled = scrollPosition > 50; // Cambia el estado si el scroll supera 50px
  }
} 