import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
	selector: '[appScrollToTop]'
})
export class ScrollToTopDirective {
	private scrollThreshold = 200;

	constructor(private el: ElementRef, private renderer: Renderer2) { }

	ngOnInit() {
		this.toggleButtonVisibility();
	}

	@HostListener('click') onClick() {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}

	@HostListener('window:scroll') onScroll() {
		this.toggleButtonVisibility();
	}

	private toggleButtonVisibility(): void {
		const shouldShow = window.scrollY > this.scrollThreshold;
		this.renderer.setStyle(this.el.nativeElement, 'display', shouldShow ? 'block' : 'none');
	}
}
