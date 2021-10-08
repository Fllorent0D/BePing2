import {AfterViewInit, Directive, ElementRef, EventEmitter, OnDestroy, Output} from '@angular/core';
import {fromEvent, Subscription} from 'rxjs';
import {startWith} from 'rxjs/operators';

@Directive({
    selector: '[bepingAppear]'
})
export class AppearDirective implements AfterViewInit, OnDestroy {
    @Output()
    bepingAppear: EventEmitter<void>;

    elementPos: number;
    elementHeight: number;

    scrollPos: number;
    windowHeight: number;

    subscriptionScroll: Subscription;
    subscriptionResize: Subscription;

    constructor(private element: ElementRef) {
        this.bepingAppear = new EventEmitter<void>();
    }

    saveDimensions() {
        this.elementPos = this.getOffsetTop(this.element.nativeElement);
        this.elementHeight = this.element.nativeElement.offsetHeight;
        this.windowHeight = window.innerHeight;
    }

    saveScrollPos() {
        this.scrollPos = window.scrollY;
    }

    getOffsetTop(element: any) {
        let offsetTop = element.offsetTop || 0;
        if (element.offsetParent) {
            offsetTop += this.getOffsetTop(element.offsetParent);
        }
        return offsetTop;
    }

    checkVisibility() {
        if (this.isVisible()) {
            // double check dimensions (due to async loaded contents, e.g. images)
            this.saveDimensions();
            if (this.isVisible()) {
                this.unsubscribe();
                this.bepingAppear.emit();
            }
        }
    }

    isVisible() {
        return this.scrollPos >= this.elementPos || (this.scrollPos + this.windowHeight) >= (this.elementPos + this.elementHeight);
    }

    subscribe() {
        this.subscriptionScroll = fromEvent(window, 'scroll').pipe(startWith(null))
            .subscribe(() => {
                this.saveScrollPos();
                this.checkVisibility();
            });
        this.subscriptionResize = fromEvent(window, 'resize').pipe(startWith(null))
            .subscribe(() => {
                this.saveDimensions();
                this.checkVisibility();
            });
    }

    unsubscribe() {
        if (this.subscriptionScroll) {
            this.subscriptionScroll.unsubscribe();
        }
        if (this.subscriptionResize) {
            this.subscriptionResize.unsubscribe();
        }
    }

    ngAfterViewInit() {
        this.subscribe();
    }

    ngOnDestroy() {
        this.unsubscribe();
    }
}
