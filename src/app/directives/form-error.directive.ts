import { Directive, ElementRef, Input, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
	selector: '[appFormError]'
})
export class FormErrorDirective {
	@Input() isValid: boolean = false;

	constructor(private el: ElementRef, private renderer: Renderer2) {
		// this.el.nativeElement.classList.add(' border-2');
	}

	ngOnChanges(changes: SimpleChanges) {
		const inputValid = changes['isValid'];

		if (!inputValid.firstChange) {
			this.renderer.addClass(this.el.nativeElement, 'border-2');
			if (inputValid.currentValue) {
				this.renderer.removeClass(this.el.nativeElement, 'border-danger');
				this.renderer.addClass(this.el.nativeElement, 'border-success');
			} else {
				this.renderer.removeClass(this.el.nativeElement, 'border-success');
				this.renderer.addClass(this.el.nativeElement, 'border-danger');
			}
		}
	}
}
