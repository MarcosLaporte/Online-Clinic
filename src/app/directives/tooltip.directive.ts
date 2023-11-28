import { Directive, ElementRef, Input, Renderer2, HostListener } from '@angular/core';

@Directive({
	selector: '[appTooltip]'
})
export class TooltipDirective {
	@Input() message: string = '';

	constructor(private el: ElementRef, private renderer: Renderer2) { }

	@HostListener('mouseenter') onMouseEnter() {
		const newTooltip = this.createTooltip();
		this.renderer.appendChild(this.el.nativeElement, newTooltip)
	}

	@HostListener('mouseleave') onMouseLeave() {
		setTimeout(() => {
			const tooltip = this.el.nativeElement.querySelector('.myTooltip');
			this.renderer.removeChild(this.el, tooltip);
		}, 300);
	}

	private createTooltip(): HTMLElement {
		const tooltip = this.renderer.createElement('div');
		const text = this.renderer.createText(this.message);
		this.renderer.appendChild(tooltip, text);

		this.renderer.addClass(tooltip, 'myTooltip');

		return tooltip;
	}
}
