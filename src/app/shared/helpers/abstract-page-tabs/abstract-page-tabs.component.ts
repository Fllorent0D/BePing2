import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SuperTabs} from '@ionic-super-tabs/angular';

export class AbstractPageTabsComponent implements AfterViewInit {

    @ViewChild('superTabs') public slides: SuperTabs;
    @ViewChild('scrollMenu') public menu: ElementRef<HTMLDivElement>;
    tabIndex = 0;

    constructor(protected changeDetectionRef: ChangeDetectorRef) {
    }

    ngAfterViewInit() {
        this.slides.tabChange.subscribe((event: CustomEvent) => {
            const previousIndex = this.tabIndex;
            const previousElement = document.getElementById(`tab${previousIndex + 1}`);
            this.tabIndex = event.detail.index;

            const toScroll = previousElement.scrollWidth * (previousIndex > this.tabIndex ? -1 : 1);
            this.menu.nativeElement.scrollBy({left: toScroll, top: 0, behavior: 'smooth'});
            this.changeDetectionRef.markForCheck();
        });
    }

    selectTab(index) {
        if (index === this.tabIndex) {
            return;
        }
        this.slides.selectTab(index);
    }
}
