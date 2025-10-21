import { AfterViewInit, Directive, ElementRef, HostListener, Input, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[textareaAutosize]',
  standalone: true
})
export class Autosize implements AfterViewInit {
  @Input('textareaAutosize') maxRows: number = 5;

  private maxHeight!: number;
  private textareaEl: HTMLTextAreaElement;

  constructor(private elementRef: ElementRef<HTMLTextAreaElement>,
    @Optional() @Self() private ngControl: NgControl) {
    this.textareaEl = this.elementRef.nativeElement;
  }

  @HostListener('input')
  onInput(): void {
    this.resize();
  }

  ngAfterViewInit(): void {
    this.calculateMaxHeight();
    setTimeout(() => this.resize());
    
    if (this.ngControl && this.ngControl.valueChanges) {
      this.ngControl.valueChanges.subscribe(() => this.resize());
    }
  }

  private resize(): void {
    this.textareaEl.style.height = 'auto';
    const scrollHeight = this.textareaEl.scrollHeight;
    this.textareaEl.style.height = `${Math.min(scrollHeight, this.maxHeight)}px`;
  }

  private calculateMaxHeight(): void {
    const computedStyle = getComputedStyle(this.textareaEl);
    const lineHeight = parseFloat(computedStyle.lineHeight);
    const paddingTop = parseFloat(computedStyle.paddingTop);
    const paddingBottom = parseFloat(computedStyle.paddingBottom);
    this.maxHeight = (this.maxRows * lineHeight) + paddingTop + paddingBottom;
  }

}
