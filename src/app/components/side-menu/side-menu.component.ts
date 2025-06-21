import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';
import { NavigationEnd, Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-side-menu',
  imports: [ MaterialModule ],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sidenav', { static: true }) sidenav!: MatSidenav;
  @ViewChild('contentRef') contentRef!: ElementRef<HTMLElement>;
  urls: Path[] = [
    { path: '/home', name: 'Home'},
    { path: '/about', name: 'About me' },
    { path: '/contact', name: 'Contact me' },
    { path: '/demo', name: 'Demo' }
  ];
  showGoTop: boolean = false;
  private mutationObserver!: MutationObserver;
  private resizeObserver!: ResizeObserver;
  constructor(
    private router: Router
  ) {
    
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
   
        for (let url of this.urls) {
          url.selected = url.path == event.url;
        }
         
      }
    });
  }

  ngAfterViewInit(): void {
    this.setupMutationObserver();
    this.setupResizeObserver();
    this.updateGoTopVisibility(); // initial check
  }

  ngOnDestroy(): void {
    this.mutationObserver?.disconnect();
    this.resizeObserver?.disconnect();
  }

  goTo(url: string) {
    this.router.navigate([url]);
    this.sidenav.close();
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }

  onContentScroll(event: Event): void {
    this.updateGoTopVisibility()
  }

  
  goToTop(): void {
    const content = document.querySelector('.content');
    content?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private updateGoTopVisibility(): void {
    const el = this.contentRef.nativeElement;
    const scrollTop = el.scrollTop;
    const scrollHeight = el.scrollHeight;
    const clientHeight = el.clientHeight;
    const distanceToBottom = scrollHeight - (scrollTop + clientHeight);
    const isScrollable = scrollHeight > clientHeight;

    // Dynamically set threshold as a percentage of the client height
    const bottomThreshold = clientHeight * 0.1; // 10% of visible area

    this.showGoTop = isScrollable && distanceToBottom < bottomThreshold;
  }

  private setupMutationObserver(): void {
    if (typeof window !== 'undefined' && 'MutationObserver' in window) { 
      
      this.mutationObserver = new MutationObserver(() => {
        this.updateGoTopVisibility();
      });
  
      this.mutationObserver.observe(this.contentRef.nativeElement, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }
  }

  private setupResizeObserver(): void {
    if (typeof window !== 'undefined' && 'ResizeObserver' in window) { 

      this.resizeObserver = new ResizeObserver(() => {
        this.updateGoTopVisibility();
      });
  
      this.resizeObserver.observe(this.contentRef.nativeElement);
    }
  }
}


class Path {
  path: string = '';
  name: string = '';
  selected?: boolean = false;
}